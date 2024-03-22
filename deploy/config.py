"""PGFPlotsEdt Deployment Server Configuration
"""

# Host name: default is '0.0.0.0' for public access
HOST = '0.0.0.0'

# Port number: default is '5678'.
# Change docker-compose.yml as well if you change the port number.
PORT = '5678'

# Number of workers: default is 'auto' which will use the number of CPU cores.
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

