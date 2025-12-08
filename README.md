# Stack Overflow Microservices Project

## Project Overview
This is a microservices-based application consisting of user management, post management, and notification services, with a React frontend. The project demonstrates DevOps best practices including CI/CD, service communication via API Gateway, and observability with Prometheus and Grafana.

## Technology Stack
- **Backend Services**: Node.js with Express.js
- **Database**: MongoDB
- **Frontend**: React with Vite
- **Containerization**: Docker & Docker Compose
- **API Gateway**: Nginx
- **CI/CD**: GitHub Actions
- **Observability**: Prometheus & Grafana
- **Storage**: MinIO

## Architecture
The application follows a microservices architecture:
- **User Service**: Handles user authentication and management (Port 3001)
- **Post Service**: Manages posts and media uploads (Port 3003)
- **Notification Service**: Handles notifications (Port 3002)
- **Frontend**: React app served via Vite
- **Nginx**: API Gateway routing requests to services
- **Databases**: Separate MongoDB instances for each service
- **MinIO**: Object storage for media files

## DevOps Implementation

### CI/CD Pipeline
- **Tool**: GitHub Actions
- **Triggers**: Push and PR to main branch
- **Steps**:
  1. Build Docker images for all services
  2. Push images to Docker Hub
  3. Deploy to server (manual for hackathon)

### Service Communication
- **API Gateway**: Nginx routes requests to appropriate services
- **Internal DNS**: Services communicate via Docker network names
- **Security**: CORS enabled, JWT authentication

### Observability
- **Prometheus**: Scrapes metrics from all services
- **Grafana**: Visualizes metrics and dashboards
- **Metrics**: HTTP request duration, default Node.js metrics

## Running Locally

### Prerequisites
- Docker & Docker Compose
- Node.js (for frontend development)

### Steps
1. Clone the repository
2. Navigate to `be` directory
3. Run `docker-compose up --build`
4. For frontend development:
   - Navigate to `fe` directory
   - Run `npm install`
   - Run `npm run dev`

### Accessing Services
- Frontend: http://localhost
- User Service: http://localhost/user
- Post Service: http://localhost/post
- Notification Service: http://localhost/notification
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

## Deployment
The application is containerized and can be deployed to any cloud platform supporting Docker containers (e.g., Azure Container Apps, AWS ECS, Google Cloud Run).

### Local Deployment
1. Ensure Docker & Docker Compose are installed
2. Run `cd be && docker-compose up --build`
3. Access at http://localhost

### Cloud Deployment (Example)
1. Push images to GitHub Container Registry (ghcr.io) via CI/CD
   - Images: `ghcr.io/mdmostafizurrahaman/stack-over-flow-user-service:latest` etc.
2. Use `deploy.sh` script on your server
3. Or deploy to cloud platforms with Docker support

### Live Demo for Hackathon
- Push code changes to trigger GitHub Actions
- Actions build and push images to ghcr.io
- Run deploy script to update running services
- Show Grafana dashboards updating in real-time

## Environment Variables
Each service has a `.env` file with necessary configurations (database URLs, JWT secrets, etc.).

## Why These Implementations?
- **CI/CD**: Automates building and deployment, ensuring fast and reliable releases (high Deployment Frequency, low Lead Time).
- **API Gateway**: Provides secure, centralized communication between services, enabling proper decoupling and scalability.
- **Observability**: Allows real-time monitoring of performance and quick incident response (low MTTR), following the CALMS model for DevOps.