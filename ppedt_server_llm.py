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

# The following pre commands may be helpful
# (the first is to set the model cache dir,
#  the second is to set the mlc model cache dir,
#  the third is to set hugging face mirror):
# export HF_HOME=cache/
# export MLC_LLM_HOME=mlc_cache/
# export HF_ENDPOINT=https://hf-mirror.com

import os
import shutil
import subprocess
import tarfile
from typing import Any

from mlc_llm import MLCEngine

# Create engine
## The original Llama 3 model:
model = "HF://mlc-ai/Llama-3-8B-Instruct-q4f16_1-MLC"
## The experimental finetuned Llama 3 model:
# model = "HF://LogCreative/Llama-3-8B-Instruct-pgfplots-finetune-q4f16_1-MLC"

# RAG is enabled or not
rag = True

engine = None

import ppedt_server
from res.version_updater import write_version_info


PRE_PROMPT = "You are a LaTeX code helper, especially for the code of package pgfplots. Return only the modified version of the following code without any additional text or explanation. You have to make sure the code could compile successfully."

CODE_BEGIN_IDENTIFIER = "\\documentclass"

def code_filter(gen):
    # filter the explanation part by finding \documentclass
    full_code = ""
    for delta in gen:
        if full_code is not None:
            full_code += delta
            if full_code.find(CODE_BEGIN_IDENTIFIER) != -1:
                start_code = full_code[full_code.index(CODE_BEGIN_IDENTIFIER):]
                full_code = None
                yield start_code
        else:
            yield delta


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
                maybe_doc_path = part.replace("pgfplots.pdf", "pgfplots.doc.src.tar.bz2")
                if os.path.isfile(maybe_doc_path):
                    doc_path = maybe_doc_path
                    break
        return doc_path
    except Exception:
        return None


def basic_load():
    def mlc_basic(code, prompt):
        for response in engine.chat.completions.create(
            messages=[
                {"role": "user", "content": PRE_PROMPT + " " + prompt + ":\n" + code}
            ],
            model=model,
            stream=True,
        ):
            yield response.choices[0].delta.content
    
    def llm_hook(code, prompt):
        yield from code_filter(mlc_basic(code, prompt))
    ppedt_server.llm_hook = llm_hook


def rag_load(doc_path):
    from llama_index.core import Settings, SimpleDirectoryReader, VectorStoreIndex, get_response_synthesizer, set_global_handler, PromptTemplate
    from llama_index.core.node_parser import LangchainNodeParser
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding
    from langchain.text_splitter import LatexTextSplitter
    from llama_index.core.llms import (
        CustomLLM,
        CompletionResponse,
        CompletionResponseGen,
        LLMMetadata,
    )
    from llama_index.core.llms.callbacks import llm_completion_callback
    from llama_index.core.retrievers import VectorIndexRetriever
    from llama_index.core.query_engine import RetrieverQueryEngine
    from llama_index.core.postprocessor import SimilarityPostprocessor
    
    # Extract the documentation source
    doc_extracted_path = os.path.join(ppedt_server.tmpdir, "pgfplots_doc")
    with tarfile.open(doc_path, "r:bz2") as tar:
        tar.extractall(doc_extracted_path)

    # Check out LLM input and output in the console.
    set_global_handler("simple")
    
    documents = SimpleDirectoryReader(
        doc_extracted_path,
        required_exts=[".tex"],
        exclude=["pgfplotstodo.tex", "TeX-programming-notes.tex", "pgfmanual-en-macros.tex"]
    ).load_data()
    # unfortunately, tree-sitter does not support latex
    splitter = LangchainNodeParser(LatexTextSplitter(chunk_size=500, chunk_overlap=100))
    nodes = splitter.get_nodes_from_documents(documents)

    print("Loading embedding model...")
    Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en-v1.5",
        # cache_folder="cache"  # if you set HF_HOME to cache/
    )

    print("Building the index...")
    index = VectorStoreIndex(nodes)

    class MLCLLM(CustomLLM):
        context_window: int = engine.max_input_sequence_length
        num_output: int = engine.engine_config.max_num_sequence
        model_name: str = model

        @property
        def metadata(self) -> LLMMetadata:
            """Get LLM metadata."""
            return LLMMetadata(
                context_window=self.context_window,
                num_output=self.num_output,
                model_name=self.model_name,
            )

        @llm_completion_callback()
        def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
            response = engine.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=model,
                stream=False,
            )
            text = response.choices[0].message.content
            return CompletionResponse(text=text)

        @llm_completion_callback()
        def stream_complete(
            self, prompt: str, **kwargs: Any
        ) -> CompletionResponseGen:
            full_response = ""
            for response in engine.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=model,
                stream=True,
            ):
                delta_response = response.choices[0].delta.content
                full_response += delta_response
                yield CompletionResponse(text=full_response, delta=delta_response)

    Settings.llm = MLCLLM()

    # FIXME: Maybe prompt translation to English is needed.

    retriever = VectorIndexRetriever(
        index=index,
        similarity_top_k=3,
    )

    ppedt_text_qa_template = PromptTemplate(
        "Context information is below.\n" +
        "---------------------\n" +
        "{context_str}\n" +
        "---------------------\n" +
        PRE_PROMPT + " " +
        "Answer the query.\n" +
        "Query: {query_str}\n" +
        "Answer: "
    )

    response_synthesizer = get_response_synthesizer(
        response_mode="compact",
        streaming=True,
        text_qa_template=ppedt_text_qa_template,
    )

    query_engine = RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=response_synthesizer,
        node_postprocessors=[SimilarityPostprocessor(similarity_cutoff=0.75)],
    )
    
    def llm_hook(code, prompt):
        yield from code_filter(query_engine.query(prompt + "\n" + code).response_gen)
    
    ppedt_server.llm_hook = llm_hook


if __name__ == '__main__':
    # Clean up the tmpdir and create a new one.
    if os.path.isdir(ppedt_server.tmpdir):
        shutil.rmtree(ppedt_server.tmpdir)
    os.mkdir(ppedt_server.tmpdir)

    print("Loading LLM model...")
    engine = MLCEngine(model)

    if not rag:
        print("RAG is disabled.")
        basic_load()
    else:
        doc_path = get_doc_path()
        if doc_path is None:
            print("The documentation of pgfplots is not found. RAG is disabled. Please install the package and make sure the documentation is available on your TeX distribution.")
            basic_load()
        else:
            # Unzip the documentation
            print("Loading RAG...")
            rag_load(doc_path)

    ver = write_version_info(os.path.join(ppedt_server.rootdir, "res"))
    print("PGFPlotsEdt {} with Llama 3".format(ver))

    ppedt_server.app.run(host="127.0.0.1", port=5678)

print("\nPress CTRL+C again to exit.")
