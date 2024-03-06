import multiprocessing
from pathlib import Path

import gunicorn.app.base

import sys
sys.path.append('..')
from server import create_app, tmpdir

# Cache LRU size
CACHE_SIZE = 50


def number_of_workers():
    # Should not use full amount of cpu cores, 
    # since there should be cores handling the compiling task.
    return multiprocessing.cpu_count()


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


def on_starting(server):
    server.log.info('''
    
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


def post_request(worker, req):
    # Implement LRU cache on the deploy side.
    if req.method == 'POST' and req.path == '/compile':
        # Clean the least used files in tmpdir
        file_lists = list(Path(tmpdir).glob('*'))
        header_lists = [f for f in file_lists if f.suffix == '.tex' and '_header' in f.stem]
        header_lists.sort(key=lambda x: x.stat().st_atime)
        sessid_lists = [f.stem.split('_')[0] for f in header_lists]
        if len(sessid_lists) > CACHE_SIZE:
            # Remove one at a time.
            sessid_removal = sessid_lists[0]
            worker.log.info("Removing session {} from cache.".format(sessid_removal))
            for filepath in filter(lambda x: sessid_removal in x.stem, file_lists):
                filepath.unlink(missing_ok=True) # maybe removed by other workers


if __name__ == '__main__':
    options = {
        'bind': '%s:%s' % ('0.0.0.0', '5678'),
        'workers': number_of_workers(),
        'on_starting': on_starting,
        'post_request': post_request,
    }
    deployApp = create_app(timeout=30, length_limit=8196)
    StandaloneApplication(deployApp, options).run()
