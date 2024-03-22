import multiprocessing
from pathlib import Path
import os
import signal
import subprocess

import gunicorn.app.base

import sys
sys.path.append('..')
import server

# Cache LRU size
CACHE_SIZE = 50

# Timeout for each compilation
TIMEOUT = 30

# Limit for the length of the input
LENGTH_LIMIT = 8196


def number_of_workers():
    # Should not use full amount of cpu cores, 
    # since there should be cores handling the compiling task.
    return multiprocessing.cpu_count()


def run_cmd_with_timeout(cmd: str):
    try:
        p = subprocess.Popen(
            "cd {} && {}".format(server.tmpdir, cmd),  # cmd
            stdout=subprocess.PIPE,  # hide output
            shell=True,  # run in shell to prevent error
            start_new_session=True  # create a process group
        )
        p.wait(timeout=TIMEOUT)  # timeout
    except subprocess.TimeoutExpired:
        os.killpg(os.getpgid(p.pid), signal.SIGTERM)  # prevent background running
        raise subprocess.TimeoutExpired(p.args, TIMEOUT)  # raise the exception for the main loop
# Patch server run_cmd
server.run_cmd = run_cmd_with_timeout


def tex_length_limit_hook(tex: str):
    if len(tex) > LENGTH_LIMIT:
        raise Exception("The length of the LaTeX source is too long.")
# Patch server tex_length_limit_hook
server.tex_length_limit_hook = tex_length_limit_hook


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
    server.compiling_sessions = multiprocessing.Manager().dict()
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


def pre_request(worker, req):
    # Implement LRU cache on the deploy side.
    if req.method == 'POST' and req.path == '/compile':
        # Clean the least used files in tmpdir
        file_lists = list(Path(server.tmpdir).glob('*'))
        header_lists = [f for f in file_lists if f.suffix == '.tex' and '_header' in f.stem]
        # Sort by the last access time
        header_lists.sort(key=lambda x: x.stat().st_atime)
        sessid_lists = [f.stem.split('_')[0] for f in header_lists]
        # remove compiling sessions
        sessid_lists = list(filter(lambda x: x not in server.compiling_sessions.keys(), sessid_lists))
        if len(sessid_lists) >= CACHE_SIZE:
            # Remove one at a time.
            sessid_removal = sessid_lists[0]
            worker.log.info("Removing session {} from cache.".format(sessid_removal))
            for filepath in filter(lambda x: sessid_removal in x.stem, file_lists):
                filepath.unlink(missing_ok=True)  # maybe removed by other workers


if __name__ == '__main__':
    options = {
        'bind': '%s:%s' % ('0.0.0.0', '5678'),
        'workers': number_of_workers(),
        'on_starting': on_starting,
        'pre_request': pre_request,
        'errorlog': 'error.log',
    }
    deployApp = server.app
    os.makedirs(server.tmpdir, exist_ok=True)
    StandaloneApplication(deployApp, options).run()
