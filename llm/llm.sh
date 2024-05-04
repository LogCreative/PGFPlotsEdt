#!/bin/bash

# detect anaconda
if ! command -v conda &> /dev/null
then
    echo "Anaconda could not be found, please install anaconda first."
    exit
fi

# create conda environment
conda env update -n ppedt -f llm.yml
conda activate ppedt

# run the script
python server_llm.py
