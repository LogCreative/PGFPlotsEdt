# Use the official base image
FROM texlive/texlive:latest

# Set the working directory inside the container
WORKDIR /PGFPlotsEdt

# Labels
LABEL org.opencontainers.image.title="PGFPlotsEdt"
LABEL org.opencontainers.image.authors="LogCreative"
LABEL org.opencontainers.image.licenses="AGPL-3.0"
LABEL org.opencontainers.image.source="https://github.com/LogCreative/PGFPlotsEdt"

# Replace debian update to a local mirror if necessary
# RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources &&  \
#     sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources

# Update apt-get
RUN apt-get update

# Install requirements
RUN apt-get install python3-venv -y --no-install-recommends
COPY ./deploy/requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install -r requirements.txt
RUN rm requirements.txt
RUN rm -rf /var/lib/apt/lists/*

# Copy the previous directory into the container
COPY . /PGFPlotsEdt

# Set the working directory to the deploy folder
WORKDIR /PGFPlotsEdt/deploy

# Expose the port 5678
EXPOSE 5678

# Set the entrypoint command to start the Flask app using Gunicorn
CMD ["python", "gunicorn-deploy.py"]
