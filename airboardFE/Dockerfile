# Use the official Nginx base image
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy contents from src/ to the container
COPY src/ .


# Set an environment variable (can be overridden at runtime)
ARG SDK_KEY
ENV SDK_KEY=${SDK_KEY}

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
