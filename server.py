"""A basic LaTeX backend server for local runtime
"""

import os
import shutil
import subprocess
import time
import signal
import platform
import glob
from cachetools import LRUCache
import multiprocessing

from flask import Flask, send_from_directory, render_template_string, Response, request

def create_app(max_size: int = 1000, timeout: int = 100000):

    app = Flask(__name__, static_url_path='', static_folder=".", template_folder=".")

    rootdir = os.path.dirname(os.path.abspath(__file__))
    tmpdir = os.path.join(rootdir, 'tmp')

    # Clean up the tmpdir and create a new one.
    if os.path.isdir(tmpdir):
        shutil.rmtree(tmpdir)
    os.mkdir(tmpdir)

    def run_cmd(cmd: str):
        try:
            p = subprocess.Popen(
                "cd {} && {}".format(tmpdir, cmd),      # cmd
                stdout=subprocess.PIPE,                 # hide output
                shell=True,                             # run in shell to prevent error
                start_new_session=True                  # create a process group
            )
            p.wait(timeout=timeout)                     # timeout
        except subprocess.TimeoutExpired:
            os.killpg(os.getpgid(p.pid), signal.SIGTERM)        # prevent background running
            raise subprocess.TimeoutExpired(p.args, timeout)    # raise the exception for the main loop

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

    def clear_files(file_prefix: str):
        for filepath in glob.glob("{}/{}*".format(tmpdir, file_prefix)):
            os.remove(filepath)

    class HeaderLRUCache(LRUCache):
        def popitem(self):
            key, value = super().popitem()
            clear_files(key)        # only header related
            return key, value

    class BodyLRUCache(LRUCache):
        def popitem(self):
            key, value = super().popitem()
            clear_files(key + ".")  # only body related
            return key, value

    header_cache = HeaderLRUCache(maxsize=max_size)
    body_cache = BodyLRUCache(maxsize=max_size)

    def same_or_write(cache: LRUCache, filename: str, cur_content: str):
        if filename in cache and cache[filename] == cur_content:
            return False  # same as before
        else:
            cache[filename] = cur_content
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
        if same_or_write(header_cache, header_name, cur_header):
            clean_log(header_name)
            clean_log(get_body_name(sessid))
            run_cmd(
                'etex -ini -interaction=nonstopmode -halt-on-error -jobname={} "&pdflatex" mylatexformat.ltx """{}.tex"""'
                .format(header_name, header_name))

    def compile_body(cur_body: str, sessid: str):
        body_name = get_body_name(sessid)
        if same_or_write(body_cache, body_name, cur_body):
            clean_log(body_name)
            run_cmd('pdflatex -interaction=nonstopmode -halt-on-error {}.tex'.format(body_name))

    def clean_files(sessid: str, pdf: bool):
        for filepath in glob.glob("{}/{}*".format(tmpdir, sessid)):
            if not (filepath.endswith(".tex") or filepath.endswith(".log") or filepath.endswith(".fmt")):
                if not (not pdf and filepath.endswith(".pdf")):
                    os.remove(filepath)

    def compile_tex(tex: str, sessid: str):
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
        except ValueError as e:     # raise by LRUCache when the content is too large.
            app.logger.warning("Content Length Error on Session {}: {}".format(sessid, e))
            raise Exception("Content length is too large.")
        except subprocess.TimeoutExpired as e:
            app.logger.warning("Compilation timeout for session {}: {}".format(sessid, e))
            raise Exception("Compilation timeout.")
        except Exception as e:
            app.logger.warning("Compilation error for session {}: {}".format(sessid, e))
            raise Exception("Compilation Error.")
        finally:
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

    # A shared dict for the compiling sessions
    compiling_sessions = multiprocessing.Manager().dict()

    @app.route('/', methods=['GET'])
    def index():
        return send_from_directory(rootdir, "index.html")

    @app.route('/compile', methods=['GET', 'POST'])
    def compile():
        if request.method == 'POST':
            reqid = request.form['requestid']
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

    return app

if __name__ == '__main__':
    create_app().run(host="127.0.0.1", port=5678)
