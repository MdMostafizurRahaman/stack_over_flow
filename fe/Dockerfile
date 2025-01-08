# Use the official Node.js image as the base image
FROM node:20 AS build

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine
COPY --from=build /src/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Define the command to run the app
CMD ["nginx", "-g", "daemon off;"]