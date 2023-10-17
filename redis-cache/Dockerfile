# Use the official node.js image as our base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json first, to leverage Docker cache
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Specify the command to run when the container starts
CMD ["node", "app.js"]
