# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

COPY . .
# Clean up unnecessary node_modules and dist
RUN rm -rf node_modules dist

# Install app dependencies with --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy all files from the current directory to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the production command
CMD ["npm", "run", "start"]
