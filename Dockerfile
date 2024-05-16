# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Install netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script
COPY entrypoint.sh ./

# Make the entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Expose the application port
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Use the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
