import multiprocessing
import logging
import gunicorn.app.base

import sys
sys.path.append('..')
from server import create_app


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


if __name__ == '__main__':
    glogger = logging.getLogger('gunicorn.error')

    glogger.warning('''
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
    options = {
        'bind': '%s:%s' % ('0.0.0.0', '5678'),
        'workers': number_of_workers(),
    }
    deployApp = create_app(timeout=30)
    StandaloneApplication(deployApp, options).run()
