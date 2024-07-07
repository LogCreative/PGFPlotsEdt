"""
PGFPlotsEdt Deployment Server
"""

#  Copyright (c) Log Creative 2020--2024.
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.

import multiprocessing
from pathlib import Path
import os
import signal
import subprocess
import hashlib

import gunicorn.app.base

import sys
sys.path.append('..')
import ppedt_server
from res.version_updater import write_version_info
from config import *


def number_of_workers():
    # Should not use full amount of cpu cores, 
    # since there should be cores handling the compiling task.
    return multiprocessing.cpu_count()


def run_cmd_with_timeout(cmd: str):
    try:
        p = subprocess.Popen(
            "cd {} && {}".format(ppedt_server.tmpdir, cmd),  # cmd
            stdout=subprocess.PIPE,  # hide output
            shell=True,  # run in shell to prevent error
            start_new_session=True  # create a process group
        )
        p.wait(timeout=TIMEOUT)  # timeout
    except subprocess.TimeoutExpired:
        os.killpg(os.getpgid(p.pid), signal.SIGTERM)  # prevent background running
        raise subprocess.TimeoutExpired(p.args, TIMEOUT)  # raise the exception for the main loop
# Patch server run_cmd
ppedt_server.run_cmd = run_cmd_with_timeout


def tex_length_limit_hook(tex: str):
    if len(tex) > LENGTH_LIMIT:
        raise Exception("The length of the LaTeX source is too long.")
# Patch server tex_length_limit_hook
ppedt_server.tex_length_limit_hook = tex_length_limit_hook

tmp_header_cache_dir = os.path.join(ppedt_server.tmpdir, 'cache')

def get_header_hashed_name(header: str):
    header_hash = hashlib.sha256((header).encode()).hexdigest()[:16]
    return "{}_header.fmt".format(header_hash)

def compile_header_cached(cur_header: str, compiler: str, sessid: str):
    header_name = ppedt_server.get_header_name(sessid)
    header_hased_name = get_header_hashed_name(cur_header)
    header_hashed_path = os.path.join(tmp_header_cache_dir, header_hased_name)
    header_ref_path = os.path.join(ppedt_server.tmpdir, "{}.fmt".format(header_name))
    # remove the original link
    if os.path.exists(header_ref_path):
        os.unlink(header_ref_path)
    if ppedt_server.same_or_write(header_name, cur_header) and not os.path.isfile(header_hashed_path):
        ppedt_server.clean_log(header_name)
        ppedt_server.clean_log(ppedt_server.get_body_name(sessid))
        ppedt_server.run_cmd(ppedt_server.header_cmd(header_name, compiler))
        if not os.path.isfile(header_ref_path):
            return  # early stop if the compilation failed
        # rename the compiled header to hased header name, 
        # since there may be another worker compiling the same header
        os.rename(header_ref_path, header_hashed_path)
        # It is not necessary to deal with the log,
        # if there is another one using this fmt, then the header is successfully compiled,
        # the body is the failed part, the returned log is the body log.
    # create the link to the hashed path
    # Though hard links are better, it will occupy more space.
    # The soft link target may be removed by the LRU cleaner,
    # in this situation, recompiling will work.
    os.symlink(header_hashed_path, header_ref_path)
# Patch server compile_header
ppedt_server.compile_header = compile_header_cached


def reqid_hook(reqid: str):
    # Hash the request id to prevent the file being guessed by others.
    # But the hash here is not using the determinent hash function like header cache,
    # the hash() from python has randomness in different runs.
    # This could prevent attackers traverse the original request id to get the hashed one 
    # (since some parameters are unknown to everyone except the program).
    reqhash = hash(reqid)       # reqid should be string
    reqhash += sys.maxsize + 1  # make it positive, https://stackoverflow.com/a/18766856
    return hex(reqhash)[2:]     # remove the '0x'
ppedt_server.reqid_hook = reqid_hook


class StandaloneApplication(gunicorn.app.base.BaseApplication):

    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super().__init__()

    def load_config(self):
        config = {key: value for key, value in self.options.items()
                  if key in self.cfg.settings and value is not None}
        for key, value in config.items():
            self.cfg.set(key.lower(), value)

    def load(self):
        return self.application


def on_starting(serv):
    # Use a shared dict to store compiling sessions
    ppedt_server.compiling_sessions = multiprocessing.Manager().dict()
    serv.log.info('''
    
    PGFPlotsEdt Deployment Server
    
    Copyright (C) 2020--2024  Log Creative

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
          
    Ctrl-C to terminate the server.
    ''')


def dir_clean_LRU(dirpath: str, key_suffix: str = '.tex'):
    # Clean the least used files (excluding folders) in tmpdir
    glob_list = list(Path(dirpath).glob('*'))
    file_list = list(filter(lambda x: x.is_file(), glob_list))
    header_list = [f for f in file_list if f.suffix == key_suffix and '_header' in f.stem]
    # Sort by the last access time
    header_list.sort(key=lambda x: x.stat().st_atime)
    sessid_list = [f.stem.split('_')[0] for f in header_list]
    # remove compiling sessions
    sessid_list = list(filter(lambda x: x not in ppedt_server.compiling_sessions.keys(), sessid_list))
    if len(sessid_list) >= CACHE_SIZE:
        # Remove one at a time.
        sessid_removal = sessid_list[0]
        for filepath in filter(lambda x: sessid_removal in x.stem, file_list):
            filepath.unlink(missing_ok=True)  # maybe removed by other workers


def pre_request(worker, req):
    # Implement LRU cache on the deploy side.
    if req.method == 'POST' and req.path == '/compile':
        dir_clean_LRU(ppedt_server.tmpdir, '.tex')
        dir_clean_LRU(tmp_header_cache_dir, '.fmt')


if __name__ == '__main__':
    options = {
        'bind': '{}:{}'.format(HOST, PORT),
        'workers': number_of_workers() if WORKERS == 'auto' else int(WORKERS),
        'on_starting': on_starting,
        'pre_request': pre_request,
        'errorlog': 'error.log',
    }
    deployApp = ppedt_server.app
    os.makedirs(ppedt_server.tmpdir, exist_ok=True)
    os.makedirs(tmp_header_cache_dir, exist_ok=True)
    ver = write_version_info(os.path.join(ppedt_server.rootdir, "res"))
    print("PGFPlotsEdt {} deployment server is running, see error.log for running information.".format(ver))
    StandaloneApplication(deployApp, options).run()
