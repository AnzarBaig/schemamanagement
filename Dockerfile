# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json before running npm install
COPY package.* ./

# Install dependencies
RUN npm install --legacy-peer-deps && npm install ajv --legacy-peer-deps

# Copy environment file first to leverage caching
#COPY .env .env

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
