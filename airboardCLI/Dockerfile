# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the application files
COPY . /app
COPY ./src/* /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variable (can be overridden at runtime)
ENV USER=myork
ENV LAUNCHDARKLY_SDK_KEY=

# Set the entrypoint to run the script interactively
ENTRYPOINT ["python", "cli.py"]

