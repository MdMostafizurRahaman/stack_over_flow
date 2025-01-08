# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /be

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Expose the port the app runs on
EXPOSE 3000


# Define the command to run the app
CMD ["node", "index.js"]