# Use the official Ubuntu base image
FROM ghcr.io/xu-cheng/texlive-full:latest

# Set the working directory inside the container
WORKDIR /app

# Install Flask and Gunicorn
RUN pip3 install flask gunicorn

# Copy the project folder to the container
COPY .. /app

# Set the working directory to the deploy folder
WORKDIR /app/deploy

# Expose the port on which the Flask app will run
EXPOSE 5678

# Set the entrypoint command to start the Flask app using Gunicorn
CMD ["python", "gunicorn-deploy.py"]
