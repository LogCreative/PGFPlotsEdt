# Use the official Ubuntu base image
FROM texlive/texlive:latest-medium

# Set the working directory inside the container
WORKDIR /PGFPlotsEdt

# Install Flask and Gunicorn
RUN pip3 install flask gunicorn

# Copy the project folder to the container
COPY .. /PGFPlotsEdt

# Set the working directory to the deploy folder
WORKDIR /PGFPlotsEdt/deploy

# Expose the port on which the Flask app will run
EXPOSE 5678

# Set the entrypoint command to start the Flask app using Gunicorn
CMD ["python", "gunicorn-deploy.py"]
