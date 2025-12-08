#!/bin/bash

# Simple deployment script for hackathon demo
# Run this on your server after CI/CD builds images

echo "Logging into GitHub Container Registry..."
echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin

echo "Pulling latest images..."
docker pull ghcr.io/mdmostafizurrahaman/stack-over-flow-user-service:latest
docker pull ghcr.io/mdmostafizurrahaman/stack-over-flow-post-service:latest
docker pull ghcr.io/mdmostafizurrahaman/stack-over-flow-notification-service:latest

echo "Stopping existing containers..."
docker-compose down

echo "Starting services with new images..."
docker-compose up -d

echo "Deployment complete! Check http://your-server-ip"