"""A basic LaTeX backend server for local runtime
"""

import os
import shutil
import subprocess
import platform
import glob
from flask import Flask, send_from_directory, render_template_string, Response, request

rootdir = os.path.dirname(os.path.abspath(__file__))
tmpdir = os.path.join(rootdir, 'tmp')

def run_cmd(cmd: str):
    subprocess.call("cd {} && ".format(tmpdir) + cmd, shell=True)


def get_header_name(sessid: str):
    return "{}_header".format(sessid)


def get_body_name(sessid: str):
    return "{}".format(sessid)


def get_header_body(tex: str, sessid):
    tex = tex.replace("\r\n", "\n")
    if platform.system() == "Windows":
        tex = tex.replace("\\begin{CJK}{UTF8}{gbsn}", "\\begin{CJK}{UTF8}{song}")
    header_end = tex.find("\\begin{document}")
    if header_end == -1:
        return None, None
    return tex[:header_end] + "\\begin{document}\n\\end{document}\n",\
        "%&{}\n".format(get_header_name(sessid)) + tex[header_end:]


def same_or_write(filename, cur_content):
    filepath = os.path.join(tmpdir, "{}.tex".format(filename))
    if os.path.isfile(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            prev_content = str(f.read())
        if prev_content == cur_content:
            return False  # the same as before
    pdfpath = os.path.join(tmpdir, "{}.pdf".format(filename))
    if os.path.isfile(pdfpath):
        os.remove(pdfpath)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(cur_content)
    return True


def compile_header(cur_header: str, sessid: str):
    header_name = get_header_name(sessid)
    if same_or_write(header_name, cur_header):
        run_cmd('etex -ini -interaction=nonstopmode -halt-on-error -jobname={} "&pdflatex" mylatexformat.ltx """{}.tex"""'
                .format(header_name, header_name))


def compile_body(cur_body: str, sessid: str):
    body_name = get_body_name(sessid)
    if same_or_write(body_name, cur_body):
        run_cmd('pdflatex -interaction=nonstopmode -halt-on-error {}.tex'.format(body_name))


def clean_files(sessid: str, pdf: bool):
    for filepath in glob.glob("{}/{}*".format(tmpdir, sessid)):
        if not (filepath.endswith(".tex") or filepath.endswith(".log") or filepath.endswith(".fmt")):
            if not (not pdf and filepath.endswith(".pdf")):
                os.remove(filepath)


def compile_tex(tex: str, sessid: str):
    tex_header, tex_body = get_header_body(tex, sessid)
    if tex_header is not None:
        compile_header(tex_header, sessid)
        compile_body(tex_body, sessid)
        pdfpath = os.path.join(tmpdir, "{}.pdf".format(get_body_name(sessid)))
        if os.path.isfile(pdfpath):
            with open(pdfpath, 'rb') as f:
                pdf = f.read()
            clean_files(sessid, pdf=False)
            return pdf
    app.logger.warning("Compilation Failure on Session {}!".format(sessid))
    clean_files(sessid, pdf=True)
    return None


def get_log(sessid: str):
    logpath = os.path.join(tmpdir, "{}.log".format(get_body_name(sessid)))
    if os.path.isfile(logpath):
        with open(logpath, "r", encoding='utf-8') as f:
            return f.read()
    return "Compilation Failure"


app = Flask(__name__, static_url_path='', static_folder=".", template_folder=".")


@app.route('/', methods=['GET'])
def index():
    return send_from_directory(rootdir, "index.html")


compiling_sessions = set()


@app.route('/compile', methods=['GET', 'POST'])
def compile():
    if request.method == 'POST':
        reqid = request.form['requestid']
        if reqid not in compiling_sessions:
            compiling_sessions.add(reqid)
            pdf = compile_tex(request.form['texdata'], reqid)
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
            compiling_sessions.remove(reqid)
            return res
        else:
            app.logger.warning("Previous run of Session {} has not been finished. The request is discarded.".format(reqid))
            return render_template_string("Previous run has not been finished.")
    else:
        return render_template_string("PGFPlotsEdt LaTeX Server: POST a LaTeX request (texdata, requestid) to render.")


if __name__ == '__main__':
    os.makedirs(tmpdir, exist_ok=True)
    app.run(host="127.0.0.1", port=5678)
    shutil.rmtree(tmpdir)