"""
Initialize Knowledge Base of PGFPlots docs
"""

import sys

sys.path.append('..')
import ppedt_server_llm

from config import *


def basic_load_noop():
    print("No documents found.")


def get_vector_store():
    from llama_index.vector_stores.postgres import PGVectorStore  # llama-index-vector-stores-postgres
    from sqlalchemy import make_url
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
    return vector_store


def get_embedding_model():
    from llama_index.embeddings.openai_like import OpenAILikeEmbedding
    return OpenAILikeEmbedding(
        model_name=EMBED_MODEL_NAME,
        api_base=EMBED_API_BASE,
    )


def rag_store(doc_path):
    from llama_index.core import StorageContext, Settings, VectorStoreIndex
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding

    # Get document nodes
    nodes = ppedt_server_llm.get_documents_nodes(doc_path)

    # Get vector store
    vector_store = get_vector_store()

    # load storage context
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    print("Loading embedding model...")
    Settings.embed_model = get_embedding_model()

    print("Building the index...")
    index = VectorStoreIndex(nodes, show_progress=True, storage_context=storage_context)

if __name__ == '__main__':
    ppedt_server_llm.basic_load = basic_load_noop
    ppedt_server_llm.rag_load = rag_store
    ppedt_server_llm.setup_rag()
    print("Knowledge base initialized.")
