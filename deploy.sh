#!/bin/bash

# Simple deployment script for hackathon demo
# Run this on your server after CI/CD builds images

echo "Pulling latest images..."
docker pull yourusername/user-service:latest
docker pull yourusername/post-service:latest
docker pull yourusername/notification-service:latest

echo "Stopping existing containers..."
docker-compose down

echo "Starting services with new images..."
docker-compose up -d

echo "Deployment complete! Check http://your-server-ip"