# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the application files
COPY . /app
COPY ./src/* /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set LaunchDarkly environment variables (can be overridden at runtime)
ENV LD_USER=
ENV LAUNCHDARKLY_SDK_KEY=
ENV LD_LOCATION=
ENV LD_DEBUG=

# Set the entrypoint to run the script interactively
ENTRYPOINT ["python", "cli.py"]

