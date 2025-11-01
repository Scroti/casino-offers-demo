# 🚀 Deployment Guide - GCP Cloud Run

This guide covers deploying the Casino Offers application to Google Cloud Platform using Docker containers.

## 📋 Prerequisites

1. **Google Cloud SDK (gcloud)** installed and configured
2. **Docker** installed locally (for testing)
3. **GCP Project** created with billing enabled
4. **MongoDB Atlas** account (or self-hosted MongoDB)
5. **GCP APIs enabled**:
   - Cloud Run API
   - Container Registry API
   - Cloud Build API

```bash
# Install Google Cloud SDK
# Visit: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## 🐳 Docker Images Overview

The application uses **multi-stage builds** for optimized production images:

### Frontend (Next.js)
- **Base**: Node.js 20 Alpine
- **Stages**: Dependencies → Builder → Production Runner
- **Output**: Standalone Next.js build
- **Security**: Non-root user (nextjs:nodejs)
- **Size**: ~150MB (optimized)

### Backend (NestJS)
- **Base**: Node.js 20 Alpine
- **Stages**: Dependencies → Builder → Production Runner
- **Security**: Non-root user (nestjs:nodejs)
- **Health Check**: Built-in health endpoint
- **Size**: ~120MB (optimized)

## 🔧 Environment Variables

### Backend Required Variables

```bash
# App Configuration
NODE_ENV=production
PORT=3000
APP_VERSIONING_DEFAULT_VERSION=1

# MongoDB Atlas Configuration
MONGO_DB_USER=your_mongodb_user
MONGO_DB_PASSWORD=your_mongodb_password
MONGO_DB_SERVER=your-cluster.mongodb.net
MONGO_DB_NAME=casino_offers

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-minimum-32-chars
JWT_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# CORS Configuration
CORS_ORIGINS=https://your-frontend-domain.com

# Optional: Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-base64-private-key
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME=Sheet1
GOOGLE_SHEETS_SYNC_ENABLED=true

# Swagger/API Documentation
APP_NAME=Casino Offers API
APP_ENVIRONMENT=production
APP_SWAGGER_TAG=Casino Offers API
APP_SWAGGER_VERSION=1.0.0
APP_SWAGGER_SERVER=https://your-backend-url.com
```

### Frontend Required Variables

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
NEXT_PUBLIC_USE_MOCK_CASINOS=false
```

## 🏗️ Step-by-Step Deployment

### Step 1: Build and Push Docker Images

#### Build Frontend Image

```bash
# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/casino-frontend:latest .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/casino-frontend:latest
```

#### Build Backend Image

```bash
# Navigate to server directory
cd server

# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/casino-backend:latest .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/casino-backend:latest

# Return to root
cd ..
```

### Step 2: Deploy Backend to Cloud Run

```bash
gcloud run deploy casino-backend \
  --image gcr.io/YOUR_PROJECT_ID/casino-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars="NODE_ENV=production,PORT=3000" \
  --set-env-vars="MONGO_DB_USER=YOUR_MONGO_USER,MONGO_DB_PASSWORD=YOUR_MONGO_PASSWORD,MONGO_DB_SERVER=YOUR_MONGO_CLUSTER.mongodb.net,MONGO_DB_NAME=casino_offers" \
  --set-env-vars="JWT_SECRET=YOUR_JWT_SECRET,JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET,JWT_EXPIRES=15m,JWT_REFRESH_EXPIRES=7d" \
  --set-env-vars="CORS_ORIGINS=https://your-frontend-url.com" \
  --set-env-vars="APP_NAME=Casino Offers API,APP_ENVIRONMENT=production,APP_SWAGGER_TAG=Casino Offers API,APP_SWAGGER_VERSION=1.0.0"
```

**Note**: Get the backend URL from the output, you'll need it for the frontend deployment.

### Step 3: Update Backend URL and Deploy Frontend

```bash
# Get backend URL
BACKEND_URL=$(gcloud run services describe casino-backend --region us-central1 --format 'value(status.url)')

# Deploy frontend
gcloud run deploy casino-frontend \
  --image gcr.io/YOUR_PROJECT_ID/casino-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars="NODE_ENV=production,PORT=3000,NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1,NEXT_PUBLIC_USE_MOCK_CASINOS=false"
```

### Step 4: Get Service URLs

```bash
# Get frontend URL
gcloud run services describe casino-frontend --region us-central1 --format 'value(status.url)'

# Get backend URL
gcloud run services describe casino-backend --region us-central1 --format 'value(status.url)'
```

## 🔄 Alternative: Using Cloud Build

Create a `cloudbuild.yaml` for automated builds:

### Backend Cloud Build Config

```yaml
# cloudbuild.backend.yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/casino-backend:$COMMIT_SHA', './server']

  # Push the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/casino-backend:$COMMIT_SHA']

  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'casino-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/casino-backend:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'

images:
  - 'gcr.io/$PROJECT_ID/casino-backend:$COMMIT_SHA'
```

### Frontend Cloud Build Config

```yaml
# cloudbuild.frontend.yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/casino-frontend:$COMMIT_SHA'
      - '--build-arg'
      - 'NEXT_PUBLIC_API_URL=https://casino-backend-XXXXX-uc.a.run.app/api/v1'
      - '.'

  # Push the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/casino-frontend:$COMMIT_SHA']

  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'casino-frontend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/casino-frontend:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'

images:
  - 'gcr.io/$PROJECT_ID/casino-frontend:$COMMIT_SHA'
```

### Trigger Builds

```bash
# Build and deploy backend
gcloud builds submit --config cloudbuild.backend.yaml

# Build and deploy frontend (after backend is deployed)
gcloud builds submit --config cloudbuild.frontend.yaml
```

## 🧪 Local Testing with Docker

Test your Docker containers locally before deploying:

```bash
# Start all services
docker-compose up --build

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Access:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3003
- **MongoDB**: mongodb://localhost:27017

## 🔍 Monitoring and Troubleshooting

### View Logs

```bash
# Backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=casino-backend" --limit 50

# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=casino-frontend" --limit 50
```

### Check Service Status

```bash
# Backend
gcloud run services describe casino-backend --region us-central1

# Frontend
gcloud run services describe casino-frontend --region us-central1
```

### Test Health Endpoints

```bash
# Backend health check
curl https://YOUR_BACKEND_URL/api/v1/health

# Should return: {"status":"ok"}
```

## 🔒 Security Best Practices

1. **Use Secret Manager** for sensitive environment variables:
```bash
# Create secrets
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-

# Reference in Cloud Run
gcloud run services update casino-backend \
  --update-secrets=JWT_SECRET=jwt-secret:latest
```

2. **Enable VPC Connector** for MongoDB Atlas:
```bash
# Create VPC connector
gcloud compute networks vpc-access connectors create mongodb-connector \
  --region us-central1 \
  --subnet-project YOUR_PROJECT_ID \
  --subnet default

# Attach to service
gcloud run services update casino-backend \
  --vpc-connector mongodb-connector
```

3. **Use IAM Authentication** for internal services
4. **Enable HTTPS only**
5. **Set up CORS properly**
6. **Use Cloud Armor** for DDoS protection

## 📊 Performance Optimization

### Recommended Settings

**Backend**:
- Memory: 1Gi - 2Gi
- CPU: 2-4 cores
- Min Instances: 1 (to avoid cold starts)
- Max Instances: 20+
- Timeout: 300s

**Frontend**:
- Memory: 1Gi
- CPU: 2 cores
- Min Instances: 1
- Max Instances: 20+
- Timeout: 300s

### Update Scaling

```bash
gcloud run services update casino-backend \
  --min-instances 1 \
  --max-instances 20 \
  --memory 2Gi \
  --cpu 4
```

## 💰 Cost Estimation

Approximate monthly costs (with light traffic):
- Cloud Run: $10-50/month
- Container Registry: $1-5/month
- MongoDB Atlas (Shared): $0-57/month
- **Total**: $11-112/month

With higher traffic, costs scale automatically.

## 🎯 Quick Deployment Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

PROJECT_ID="YOUR_PROJECT_ID"
REGION="us-central1"

echo "🚀 Deploying Casino Offers to GCP Cloud Run..."

# Build and push backend
echo "📦 Building backend..."
cd server
docker build -t gcr.io/${PROJECT_ID}/casino-backend:latest .
docker push gcr.io/${PROJECT_ID}/casino-backend:latest
cd ..

# Deploy backend
echo "🚢 Deploying backend..."
gcloud run deploy casino-backend \
  --image gcr.io/${PROJECT_ID}/casino-backend:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated

# Get backend URL
BACKEND_URL=$(gcloud run services describe casino-backend --region ${REGION} --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# Build and push frontend
echo "📦 Building frontend..."
docker build -t gcr.io/${PROJECT_ID}/casino-frontend:latest --build-arg NEXT_PUBLIC_API_URL=${BACKEND_URL}/api/v1 .
docker push gcr.io/${PROJECT_ID}/casino-frontend:latest

# Deploy frontend
echo "🚢 Deploying frontend..."
gcloud run deploy casino-frontend \
  --image gcr.io/${PROJECT_ID}/casino-frontend:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated

FRONTEND_URL=$(gcloud run services describe casino-frontend --region ${REGION} --format 'value(status.url)')
echo "✅ Frontend deployed at: $FRONTEND_URL"

echo "🎉 Deployment complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📚 Additional Resources

- [GCP Cloud Run Documentation](https://cloud.google.com/run/docs)
- [NestJS Deployment Guide](https://docs.nestjs.com/recipes/deployment)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🐛 Common Issues

**Issue**: Container fails to start
- Check logs: `gcloud logging read "resource.type=cloud_run_revision"`
- Verify environment variables
- Ensure health check endpoint works

**Issue**: MongoDB connection timeout
- Whitelist Cloud Run IPs in MongoDB Atlas
- Use VPC connector for private IP
- Check MongoDB credentials

**Issue**: CORS errors
- Verify CORS_ORIGINS includes frontend URL
- Check browser console for exact error
- Ensure credentials are passed correctly

**Issue**: Cold start too slow
- Increase min-instances to 1
- Optimize bundle size
- Use Cloud Run for Anthos for faster instances

## 🎓 Next Steps

1. Set up custom domains
2. Configure CDN with Cloud CDN
3. Set up CI/CD with Cloud Build
4. Implement monitoring with Cloud Monitoring
5. Set up alerts with Cloud Alerting


