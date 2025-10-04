"""PGFPlotsEdt Deployment Server Configuration
"""

# Host name: default is '0.0.0.0' for public access
HOST = '0.0.0.0'

# Port number: default is '5678'.
# Change docker-compose.yml as well if you change the port number.
PORT = '5678'

# Number of workers: default is 'auto' which will use the number of CPU cores + 1 (redundency).
# You can also set it to a fixed number.
WORKERS = 'auto'

# Cache LRU size:
# The deployment server will remove the least recent used (LRU) files
# for both the header fmt cache and the pdf cache.
CACHE_SIZE = 50

# Timeout for each compilation (in seconds):
# If the compilation takes longer than this time, 
# the server will return a timeout error.
TIMEOUT = 30

# Limit for the length of the input:
# If the input length is longer than this limit,
# the server will return an error.
LENGTH_LIMIT = 8196

# LLM Settings
# Whether to enable LLM, finish the configuration below then set it to True
LLM_ENABLED = False

# LLM API Settings: OpenAI Compatible API
LLM_MODEL_NAME = "gpt-4o"
LLM_API_BASE = "https://hostname.com/v1"
LLM_API_KEY = "sk-..."

# RAG Settings
# Whether to enable RAG, finish the configuration below then set it to True
RAG_ENABLED = False

# PG Vector URI
# create a database of "ppedt", and create extension vector; first.
POSTGRES_URI = "postgresql://username:password@localhost:5432"

# Embedding Model Settings
# Deploy your embedding model in OpenAI Embedding Compatible API
EMBED_MODEL_NAME = "/data/bge-small-en-v1.5"
EMBED_API_BASE = "http://hostname.com"
