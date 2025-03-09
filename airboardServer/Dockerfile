# Use an official Python runtime as a parent image
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Copy the application files
COPY . /app
COPY ./src/* /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the application port
EXPOSE 8080

# Set the environment variables
ENV SDK_KEY=""
ENV EXPERIMENTAL_MODE=""

# Run the Flask application
CMD ["python", "airboardServer.py"]
