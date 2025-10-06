"""
Initialize Cloudflare vector database.
After initializing the vector database in init_kb.py, run this script to dump the vectorized result to jsonl file for wrangler vector insert.

https://developers.cloudflare.com/vectorize/best-practices/insert-vectors/
Target jsonl line: {id: <node_id>, values: <embedding>, metadata: {text: <text>, ...metadata_}}
"""
from config import config
import psycopg2
import json
import os
import subprocess

print("Clearing existing Cloudflare vector store...")
subprocess.run(["npx", "wrangler", "vectorize", "delete", "ppedt-embed", "--force"], cwd="ppedt-serverless")
print("Creating new Cloudflare vector store, press 'n' if prompted to confirm...")
subprocess.run(["npx", "wrangler", "vectorize", "create", "ppedt-embed", "--preset", "@cf/baai/bge-small-en-v1.5"], cwd="ppedt-serverless", check=True)


print("Dumping vectors from Postgres...")
conn = psycopg2.connect(config.POSTGRES_URI, dbname="ppedt")
conn.autocommit = True

# create table public.data_embed (
#   id bigint primary key not null default nextval('data_embed_id_seq'::regclass),
#   text character varying not null,
#   metadata_ json,
#   node_id character varying,
#   embedding vector(384)
# );
# create index embed_idx_1 on data_embed using btree (((metadata_ ->> 'ref_doc_id'::text)));
# create index data_embed_embedding_idx on data_embed using hnsw (embedding);

with conn.cursor() as c:
    c.execute("SELECT id, text, metadata_ -> 'file_name', node_id, embedding FROM data_embed;")
    with open(os.path.join("ppedt-serverless", "data_embed.jsonl"), "w", encoding="utf-8") as f:
        for row in c.fetchall():
            id, text, file_name, node_id, embedding = row
            embedding_list = eval(embedding)  # convert to list for JSON serialization
            json_line = {
                "id": str(node_id),
                "values": embedding_list,
                "metadata": {
                    "text": text,
                    "file_name": file_name
                }
            }
            f.write(json.dumps(json_line) + "\n")


print("Inserting vectors to Cloudflare vector store...")
subprocess.run(["npx", "wrangler", "vectorize", "insert", "ppedt-embed", "--file", "data_embed.jsonl"], cwd="ppedt-serverless", check=True)
