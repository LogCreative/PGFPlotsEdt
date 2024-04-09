"""
A basic PGFPlotsEdt LaTeX backend server for local runtime
"""

#  Copyright (c) Log Creative 2020--2024.
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.

import os
import shutil
import subprocess
import time
import platform
import glob

import re

from res.version_updater import write_version_info

from flask import Flask, send_from_directory, render_template_string, Response, request

rootdir = os.path.dirname(os.path.abspath(__file__))
tmpdir = os.path.join(rootdir, 'tmp')

app = Flask(__name__, static_url_path='', static_folder=".", template_folder=".")


def run_cmd(cmd: str):
    subprocess.call("cd {} && {}".format(tmpdir, cmd), shell=True)


def get_header_name(sessid: str):
    return "{}_header".format(sessid)


def get_body_name(sessid: str):
    return "{}".format(sessid)

ctex_re = re.compile(r"\\usepackage(\[[^\]]*\])?\{ctex\}")

def get_header_body(tex: str, compiler: str, sessid: str):
    # Normalize CRLF
    tex = tex.replace("\r\n", "\n")
    # Add magic command to make the file different for different compilers
    program_magic_cmd = "% !TEX program = {}\n".format(compiler)
    header_additional = program_magic_cmd
    body_additional = program_magic_cmd
    if not compiler == "pdflatex":
        header_additional += "\\RequirePackage[OT1]{fontenc}\n"
        body_additional += "\\endofdump\n"
    # Handle CJK
    if platform.system() == "Windows":
        tex = tex.replace("\\begin{CJK}{UTF8}{gbsn}", "\\begin{CJK}{UTF8}{song}")
    # Hand CTeX
    ctex_match = ctex_re.search(tex)
    if ctex_match is not None:
        tex = tex.replace(ctex_match.group(0), "")
        body_additional += ctex_match.group(0) + '\n'
    # Find the header end
    header_end = tex.find("\\begin{document}")
    if header_end == -1:
        return None, None
    return header_additional + tex[:header_end] + "\\begin{document}\n\\end{document}\n", \
           "%&{}\n".format(get_header_name(sessid)) + body_additional + tex[header_end:]


def same_or_write(filename: str, cur_content: str):
    filepath = os.path.join(tmpdir, "{}.tex".format(filename))
    if os.path.isfile(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            prev_content = f.read()
        if prev_content == cur_content:
            return False  # the same as before
    filepath = os.path.join(tmpdir, "{}.tex".format(filename))
    pdfpath = os.path.join(tmpdir, "{}.pdf".format(filename))
    if os.path.isfile(pdfpath):
        os.remove(pdfpath)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(cur_content)
    return True


def clean_log(filename: str):
    logpath = os.path.join(tmpdir, "{}.log".format(filename))
    if os.path.isfile(logpath):
        os.remove(logpath)


def header_cmd(jobname: str, compiler: str):
    ecompiler = "xetex" if compiler == "xelatex" else "etex"
    return '{} -ini -interaction=nonstopmode -halt-on-error -jobname={} "&{}" mylatexformat.ltx """{}.tex"""'.format(
        ecompiler, jobname, compiler, jobname)


def compile_header(cur_header: str, compiler: str, sessid: str):
    header_name = get_header_name(sessid)
    if same_or_write(header_name, cur_header):
        clean_log(header_name)
        clean_log(get_body_name(sessid))
        run_cmd(header_cmd(header_name, compiler))


def body_cmd(jobname: str, compiler: str):
    return '{} -interaction=nonstopmode -halt-on-error {}.tex'.format(compiler, jobname)


def compile_body(cur_body: str, compiler: str, sessid: str):
    body_name = get_body_name(sessid)
    if same_or_write(body_name, cur_body):
        clean_log(body_name)
        run_cmd(body_cmd(body_name, compiler))


def clean_files(sessid: str, pdf: bool):
    for filepath in glob.glob("{}/{}*".format(tmpdir, sessid)):
        if not (filepath.endswith(".tex") or filepath.endswith(".log") or filepath.endswith(".fmt")):
            if not (not pdf and filepath.endswith(".pdf")):
                os.remove(filepath)


def tex_length_limit_hook(tex: str):
    pass

def compile_tex(tex: str, compiler: str, sessid: str):
    tex_length_limit_hook(tex)
    tex_header, tex_body = get_header_body(tex, compiler, sessid)
    try:
        if tex_header is not None:
            compile_header(tex_header, compiler, sessid)
            fmtpath = os.path.join(tmpdir, "{}.fmt".format(get_header_name(sessid)))
            if os.path.isfile(fmtpath):
                compile_body(tex_body, compiler, sessid)
                pdfpath = os.path.join(tmpdir, "{}.pdf".format(get_body_name(sessid)))
                if os.path.isfile(pdfpath):
                    with open(pdfpath, 'rb') as f:
                        pdf = f.read()
                    clean_files(sessid, pdf=False)
                    return pdf
    except subprocess.TimeoutExpired as e:
        clean_files(sessid, pdf=True)
        app.logger.warning("Compilation timeout for session {}: {}".format(sessid, e))
        raise Exception("Compilation timeout.")
    except Exception as e:
        clean_files(sessid, pdf=True)
        app.logger.warning("Compilation error for session {}: {}".format(sessid, e))
        raise Exception("Compilation Error.")
    clean_files(sessid, pdf=True)
    app.logger.warning("Compilation error for session {}".format(sessid))
    return None


def get_log(sessid: str):
    for logpath in [
        os.path.join(tmpdir, "{}.log".format(get_body_name(sessid))),
        os.path.join(tmpdir, "{}.log".format(get_header_name(sessid)))
    ]:
        if os.path.isfile(logpath):
            with open(logpath, "r", encoding='utf-8') as f:
                return f.read()
    return "Compilation Failure"


# A dict for storing compiling session id
compiling_sessions = dict()

def reqid_hook(reqid: str):
    return reqid

def get_reqid(request):
    try:
        reqid = request.form['requestid']
        reqtex = request.form['texdata']
        reqcompiler = request.form['compiler']
        reqid = int(reqid)
        assert reqid >= 0, "reqid must be a non-negative integer."
        assert reqcompiler in ["pdflatex", "xelatex"], "Invalid compiler."
        reqid = str(reqid)
    except Exception as e:
        app.logger.warning("Invalid request: {}".format(e))
        return None
    return reqid_hook(reqid)


@app.route('/', methods=['GET'])
def index():
    return send_from_directory(rootdir, "index.html")


@app.route('/compile', methods=['GET', 'POST'])
def compile():
    if request.method == 'POST':
        reqid = get_reqid(request)
        if reqid is None:
            return render_template_string("Invalid request.")
        if reqid not in compiling_sessions.keys():
            compiling_sessions[reqid] = 1
            try:
                pdf = compile_tex(request.form['texdata'], request.form['compiler'], reqid)
            except Exception as e:
                compiling_sessions.pop(reqid)
                return render_template_string("{} {}".format(e, time.strftime("%Y-%m-%d %H:%M:%S")))
            if pdf is not None:
                res = Response(
                    pdf,
                    mimetype="application/pdf"
                )
            else:
                res = Response(
                    get_log(reqid),
                    mimetype="text/plain"
                )
            compiling_sessions.pop(reqid)
            return res
        else:
            app.logger.warning(
                "Previous run of Session {} has not been finished. The request is discarded.".format(reqid))
            return render_template_string("Previous run has not been finished.")
    else:
        return render_template_string("PGFPlotsEdt LaTeX Server: POST a LaTeX request (texdata, compiler, requestid) to render.\n")


if __name__ == '__main__':
    # Clean up the tmpdir and create a new one.
    if os.path.isdir(tmpdir):
        shutil.rmtree(tmpdir)
    os.mkdir(tmpdir)
    ver = write_version_info(os.path.join(rootdir, "res"))
    print("PGFPlotsEdt {}".format(ver))
    app.run(host="127.0.0.1", port=5678)
