"""
Initialize Knowledge Base of PGFPlots docs
"""

import sys

sys.path.append('..')
import ppedt_server_llm

from config import *


def basic_load_noop():
    print("No documents found.")
ppedt_server_llm.basic_load = basic_load_noop

def rag_store(doc_path):
    from llama_index.vector_stores.postgres import PGVectorStore # llama-index-vector-stores-postgres
    from llama_index.core import StorageContext, Settings, VectorStoreIndex
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding
    from sqlalchemy import make_url

    # Get document nodes
    nodes = ppedt_server_llm.get_documents_nodes(doc_path)

    # create a Redis client connection
    url = make_url(POSTGRES_URI)
    vector_store = PGVectorStore.from_params(
        database="ppedt",
        host=url.host,
        password=url.password,
        port=url.port,
        user=url.username,
        table_name="embed",
        embed_dim=384,  # openai embedding dimension
        hnsw_kwargs={
            "hnsw_m": 16,
            "hnsw_ef_construction": 64,
            "hnsw_ef_search": 40,
            "hnsw_dist_method": "vector_cosine_ops",
        },
    )

    # load storage context
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    print("Loading embedding model...")
    Settings.embed_model = HuggingFaceEmbedding(
        model_name=ppedt_server_llm.embed_model,
        # cache_folder="cache"  # if you set HF_HOME to cache/
    )

    print("Building the index...")
    index = VectorStoreIndex(nodes, show_progress=True, storage_context=storage_context)
ppedt_server_llm.rag_load = rag_store

if __name__ == '__main__':
    ppedt_server_llm.setup_rag()
    print("Knowledge base initialized.")
