"""
PGFPlotsEdt Private Server with LLM
"""

#  Copyright (c) Log Creative 2020--2024.
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.


import os
import shutil

from mlc_llm import MLCEngine

# Create engine
# FIXME: this model is not good enough.
model = "HF://mlc-ai/TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC"
engine = None

import sys
sys.path.append('..')
import server
from res.version_updater import write_version_info

def llm(code, prompt):
    response = engine.chat.completions.create(
        messages=[
            {"role": "user", "content": "You are a LaTeX code helper, especially for code of package pgfplots. Return only the modified version of the following code without any additional text. {}: {}".format(prompt, code)}
        ],
        model=model,
        stream=False,
    )
    return response.choices[0].message.content

server.llm_hook = llm

if __name__ == '__main__':
    print("Loading LLM model...")
    engine = MLCEngine(model)

    ver = write_version_info(os.path.join(server.rootdir, "res"))
    print("PGFPlotsEdt {} with LLM".format(ver))

    # Clean up the tmpdir and create a new one.
    if os.path.isdir(server.tmpdir):
        shutil.rmtree(server.tmpdir)
    os.mkdir(server.tmpdir)

    server.app.run(host="127.0.0.1", port=5678)
