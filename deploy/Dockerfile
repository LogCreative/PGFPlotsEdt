# Use the official base image
FROM texlive/texlive:latest

# Set the working directory inside the container
WORKDIR /PGFPlotsEdt

# Replace debian update to a local mirror if necessary
# RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources &&  \
#     sed -i 's/security.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources

# Update apt-get
RUN apt-get update

# Install Flask and Gunicorn
RUN apt-get install python3-flask -y
RUN apt-get install python3-gunicorn -y

# Copy the previous directory into the container
COPY . /PGFPlotsEdt

# Set the working directory to the deploy folder
WORKDIR /PGFPlotsEdt/deploy

# Expose the port 5678
EXPOSE 5678

# Set the entrypoint command to start the Flask app using Gunicorn
CMD ["python", "gunicorn-deploy.py"]
