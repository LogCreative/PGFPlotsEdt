"""A basic LaTeX backend server for local runtime
"""

import os
import shutil
import subprocess
import platform
from flask import Flask, send_from_directory, render_template_string, Response, request

rootdir = os.path.dirname(os.path.abspath(__file__))
tmpdir = os.path.join(rootdir, 'tmp')

# If fail?
# Silent?
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
        return None
    return tex[:header_end] + "\\begin{document}\n\\end{document}",\
        "%&{}\n".format(get_header_name(sessid)) + tex[header_end:]


def same_or_write(filename, cur_content):
    filepath = os.path.join(tmpdir, "{}.tex".format(filename))
    if os.path.isfile(filepath):
        with open(filepath, 'r') as f:
            prev_content = str(f.read())
        if prev_content == cur_content:
            return False  # the same as before
    with open(filepath, 'w') as f:
        f.write(cur_content)
    return True


def compile_header(cur_header: str, sessid: str):
    header_name = get_header_name(sessid)
    if same_or_write(header_name, cur_header):
        run_cmd('etex -ini -interaction=nonstopmode -jobname={} "&pdflatex" mylatexformat.ltx """{}.tex"""'
                .format(header_name, header_name))


def compile_body(cur_body: str, sessid: str):
    body_name = get_body_name(sessid)
    if same_or_write(body_name, cur_body):
        run_cmd('pdflatex {}.tex -interaction=nonstopmode'.format(body_name))


def compile_tex(tex: str, sessid: str):
    tex_header, tex_body = get_header_body(tex, sessid)
    compile_header(tex_header, sessid)
    compile_body(tex_body, sessid)
    with open(os.path.join(tmpdir, "{}.pdf".format(get_body_name(sessid))), 'rb') as f:
        pdf = f.read()
    return pdf


app = Flask(__name__, static_url_path='', static_folder=".", template_folder=".")


@app.route('/', methods=['GET'])
def index():
    return send_from_directory(rootdir, "index.html")


@app.route('/compile', methods=['GET', 'POST'])
def compile():
    if request.method == 'POST':
        return Response(
            compile_tex(request.form['texdata'], request.form['requestid']),
            mimetype="application/pdf"
        )
    else:
        return render_template_string("PGFPlotsEdt LaTeX Server: POST a LaTeX request (texdata, requestid) to render.")


if __name__ == '__main__':
    os.makedirs(tmpdir, exist_ok=True)
    app.run(host="127.0.0.1", port=5678)
    shutil.rmtree(tmpdir)
