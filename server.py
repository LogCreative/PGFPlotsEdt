"""A basic LaTeX backend server for local runtime
"""

import os
import shutil
import subprocess
import time
import platform
import glob

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


def get_header_body(tex: str, sessid: str):
    tex = tex.replace("\r\n", "\n")
    if platform.system() == "Windows":
        tex = tex.replace("\\begin{CJK}{UTF8}{gbsn}", "\\begin{CJK}{UTF8}{song}")
    header_end = tex.find("\\begin{document}")
    if header_end == -1:
        return None, None
    return tex[:header_end] + "\\begin{document}\n\\end{document}\n", \
           "%&{}\n".format(get_header_name(sessid)) + tex[header_end:]


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


def compile_header(cur_header: str, sessid: str):
    header_name = get_header_name(sessid)
    if same_or_write(header_name, cur_header):
        clean_log(header_name)
        clean_log(get_body_name(sessid))
        run_cmd(
            'etex -ini -interaction=nonstopmode -halt-on-error -jobname={} "&pdflatex" mylatexformat.ltx """{}.tex"""'
            .format(header_name, header_name))


def compile_body(cur_body: str, sessid: str):
    body_name = get_body_name(sessid)
    if same_or_write(body_name, cur_body):
        clean_log(body_name)
        run_cmd('pdflatex -interaction=nonstopmode -halt-on-error {}.tex'.format(body_name))


def clean_files(sessid: str, pdf: bool):
    for filepath in glob.glob("{}/{}*".format(tmpdir, sessid)):
        if not (filepath.endswith(".tex") or filepath.endswith(".log") or filepath.endswith(".fmt")):
            if not (not pdf and filepath.endswith(".pdf")):
                os.remove(filepath)


def tex_length_limit_hook(tex: str):
    pass


def compile_tex(tex: str, sessid: str):
    tex_length_limit_hook(tex)
    tex_header, tex_body = get_header_body(tex, sessid)
    try:
        if tex_header is not None:
            compile_header(tex_header, sessid)
            compile_body(tex_body, sessid)
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


@app.route('/', methods=['GET'])
def index():
    return send_from_directory(rootdir, "index.html")


@app.route('/compile', methods=['GET', 'POST'])
def compile():
    if request.method == 'POST':
        reqid = str(request.form['requestid'])
        if not (reqid.isnumeric() and int(reqid) >= 0):
            return render_template_string("Invalid session id.")
        if reqid not in compiling_sessions.keys():
            compiling_sessions[reqid] = 1
            try:
                pdf = compile_tex(request.form['texdata'], reqid)
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
        return render_template_string("PGFPlotsEdt LaTeX Server: POST a LaTeX request (texdata, requestid) to render.")


def get_git_commit_count():
    try:
        return int(subprocess.check_output(["git", "rev-list", "HEAD", "--count"]).decode('utf-8').strip())
    except Exception:
        return -1


def write_version_info():
    vercount = get_git_commit_count()
    if vercount > -1:
        with open(os.path.join(rootdir, "res", "version.js"), "w", encoding="utf-8") as f:
            f.write('// Deployed from: {}\n'.format(time.strftime("%Y-%m-%d %H:%M:%S")))
            f.write('const version = "v{:.2f}";\n'.format(vercount/100.0))


if __name__ == '__main__':
    # Clean up the tmpdir and create a new one.
    if os.path.isdir(tmpdir):
        shutil.rmtree(tmpdir)
    os.mkdir(tmpdir)
    write_version_info()
    app.run(host="127.0.0.1", port=5678)
