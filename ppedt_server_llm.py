"""
PGFPlotsEdt Local Server with LLM
"""

#  Copyright (c) Log Creative 2020--2024.
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.

#  Method: PGFPlotsEdt with LLM
#  Usage:
#  1. Meet system requirements: GPU with 6GB VRAM, TeX Distribution (TeX Live/MiKTeX/MacTeX) and Anaconda.
#  2. Create the conda environment by `conda env update -n ppedt -f ppedt_server_llm.yml`.
#  3. Activate the conda environment: `conda activate ppedt`. You can update the packages by `conda env update -f ppedt_server_llm.yml` later on.
#  4. Run: `python ppedt_server_llm.py`.
#  See the documentation https://github.com/LogCreative/PGFPlotsEdt/blob/master/docs/README.md#pgfplots-with-llm for details.

import os
import shutil
import subprocess

from mlc_llm import MLCEngine

# Create engine
## The original Llama 3 model:
model = "HF://mlc-ai/Llama-3-8B-Instruct-q4f16_1-MLC"
## The experimental finetuned Llama 3 model:
# model = "HF://LogCreative/Llama-3-8B-Instruct-pgfplots-finetune-q4f16_1-MLC"
engine = None

import sys
import ppedt_server
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

ppedt_server.llm_hook = llm_hook


def llm_test():
    return "PGFPlotsEdt LaTeX Server: POST a request (code, prompt) to LLM.\n", 200

ppedt_server.llm_test = llm_test


def get_doc_path():
    try:
        # Try to get the documentation from the local TeX distribution.
        doc_output = subprocess.check_output(["texdoc", "-l", "pgfplots.pdf"], input=b'x').decode("utf-8") # press x to cancel the opening of the PDF
        doc_output_parts = doc_output.splitlines()[0].split()
        doc_path = None
        for part in doc_output_parts: # Find the path of the documentation
            if part.endswith("pgfplots.pdf"):
                doc_path = part
                break
        return doc_path
    except subprocess.CalledProcessError:
        return None

if __name__ == '__main__':
    # FIXME: It should be latex file based
    doc_path = get_doc_path()
    if doc_path is None:
        print("The documentation of pgfplots is not found. Please install the package and make sure the documentation is available.")
    else:
        # Enable langchain
        print("Loading the documentation of pgfplots...")
        from langchain_community.document_loaders import PDFMinerLoader
        loader = PDFMinerLoader(doc_path)
        documents = loader.load()


    print("Loading LLM model...")
    engine = MLCEngine(model)

    ver = write_version_info(os.path.join(ppedt_server.rootdir, "res"))
    print("PGFPlotsEdt {} with Llama 3".format(ver))

    # Clean up the tmpdir and create a new one.
    if os.path.isdir(ppedt_server.tmpdir):
        shutil.rmtree(ppedt_server.tmpdir)
    os.mkdir(ppedt_server.tmpdir)

    ppedt_server.app.run(host="127.0.0.1", port=5678)

print("\nPress CTRL+C again to exit.")
