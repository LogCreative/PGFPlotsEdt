"""
PGFPlotsEdt Local Server with LLM
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
## The original Llama 3 model:
model = "HF://mlc-ai/Llama-3-8B-Instruct-q4f16_1-MLC"
## The experimental finetuned Llama 3 model:
# model = "HF://LogCreative/Llama-3-8B-Instruct-pgfplots-finetune-q4f16_1-MLC"
engine = None

import sys
import server
from res.version_updater import write_version_info

def llm_hook(code, prompt):
    for response in engine.chat.completions.create(
        messages=[
            {"role": "user", "content": "You are a LaTeX code helper, especially for the code of package pgfplots. Return only the modified version of the following code without any additional text. {}: {}".format(prompt, code)}
        ],
        model=model,
        stream=True,
    ):
        yield response.choices[0].delta.content

server.llm_hook = llm_hook


def llm_test():
    return "PGFPlotsEdt LaTeX Server: POST a request (code, prompt) to LLM.\n", 200

server.llm_test = llm_test


if __name__ == '__main__':
    print("Loading LLM model...")
    engine = MLCEngine(model)

    ver = write_version_info(os.path.join(server.rootdir, "res"))
    print("PGFPlotsEdt {} with Llama 3".format(ver))

    # Clean up the tmpdir and create a new one.
    if os.path.isdir(server.tmpdir):
        shutil.rmtree(server.tmpdir)
    os.mkdir(server.tmpdir)

    server.app.run(host="127.0.0.1", port=5678)

print("\nPress CTRL+C again to exit.")
