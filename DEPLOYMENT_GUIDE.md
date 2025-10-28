# GCP Cloud Run Deployment Guide

This guide explains how to deploy your Casino Offers application to Google Cloud Platform using Cloud Run with proper backend/frontend coordination.

## 🚀 Quick Start

### 1. Prerequisites
- Google Cloud Platform account
- GitHub repository with the code
- MongoDB Atlas database (or any MongoDB instance)

### 2. Setup GCP Service Account
1. Go to [GCP Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Cloud Run API
4. Create a service account with these roles:
   - Cloud Run Admin
   - Service Account User
   - Storage Admin
   - Cloud Build Editor
5. Download the service account key (JSON file)
6. Base64 encode the key file:
   ```bash
   base64 -i service-account-key.json
   ```

### 3. Configure GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `GCP_SA_KEY`: Your base64-encoded service account key
- `GCP_PROJECT_ID`: Your GCP project ID
- `JWT_SECRET`: A strong secret key (32+ characters)
- `JWT_EXPIRES`: JWT expiration time (e.g., "15m")
- `MONGO_DB_USER`: MongoDB username
- `MONGO_DB_PASSWORD`: MongoDB password
- `MONGO_DB_SERVER`: MongoDB server address
- `MONGO_DB_NAME`: MongoDB database name

### 4. Deploy
1. Push to `main` branch or manually trigger the workflow
2. Go to Actions tab to monitor deployment
3. Get your service URLs from the deployment logs

## 📋 Available Workflows

### 1. Complete Deployment (`deploy-gcp.yml`)
Deploys both backend and frontend with proper coordination:
- Backend deploys first
- Waits for backend to be healthy
- Frontend deploys with backend URL
- Includes health checks and testing

### 2. Backend Only (`deploy-backend-only.yml`)
Deploys only the backend service:
- Triggered by changes in `server/` directory
- Includes health checks
- Returns backend URL for frontend use

### 3. Frontend Only (`deploy-frontend-only.yml`)
Deploys only the frontend service:
- Gets backend URL from existing service
- Updates frontend with correct API URL
- Includes health checks

### 4. CI/CD Pipeline (`ci-cd.yml`)
Complete CI/CD pipeline:
- Runs tests and linting
- Deploys backend first
- Deploys frontend after backend is ready
- Includes comprehensive testing

## 🔧 Configuration Details

### Backend Configuration
- **Port**: 3000 (Cloud Run default)
- **Memory**: 1Gi
- **CPU**: 1
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10
- **Timeout**: 900 seconds

### Frontend Configuration
- **Port**: 3000 (Cloud Run default)
- **Memory**: 512Mi
- **CPU**: 1
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10
- **Timeout**: 900 seconds

### Environment Variables
The workflows automatically set these environment variables:

**Backend:**
- `NODE_ENV=production`
- `APP_PORT=3000`
- `APP_ENVIRONMENT=production`
- `JWT_SECRET` (from secrets)
- `MONGO_DB_*` (from secrets)

**Frontend:**
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL` (automatically set to backend URL)

## 🏥 Health Checks

Both services include health check endpoints:
- **Backend**: `{backend-url}/health`
- **Frontend**: `{frontend-url}/` (main page)

The deployment process waits for these endpoints to respond before considering deployment successful.

## 🔄 Deployment Flow

1. **Backend Deployment**:
   - Builds Docker image
   - Deploys to Cloud Run
   - Waits for health check
   - Returns backend URL

2. **Frontend Deployment**:
   - Gets backend URL from previous step
   - Builds Docker image with backend URL
   - Deploys to Cloud Run
   - Waits for health check
   - Returns frontend URL

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**:
   - Check MongoDB connection string
   - Verify JWT_SECRET is set
   - Check Cloud Run logs

2. **Frontend can't connect to backend**:
   - Verify backend URL is correct
   - Check CORS settings
   - Ensure backend is healthy

3. **Deployment fails**:
   - Check GCP service account permissions
   - Verify all secrets are set
   - Check Cloud Run API is enabled

### Debugging Steps

1. Check Cloud Run logs:
   ```bash
   gcloud logs read --service=casino-offers-backend
   gcloud logs read --service=casino-offers-frontend
   ```

2. Test endpoints manually:
   ```bash
   curl https://your-backend-url/health
   curl https://your-frontend-url/
   ```

3. Check service status:
   ```bash
   gcloud run services list
   gcloud run services describe casino-offers-backend --region us-central1
   ```

## 📊 Monitoring

After deployment, you can monitor your services:
- **Cloud Run Console**: View metrics and logs
- **Health Endpoints**: Monitor service health
- **GitHub Actions**: View deployment history

## 🔐 Security Notes

- All secrets are stored in GitHub Secrets
- Service account has minimal required permissions
- Services run with non-root users
- Health checks don't expose sensitive information

## 📈 Scaling

Cloud Run automatically scales based on traffic:
- Scales to zero when no traffic
- Scales up to max instances under load
- Handles concurrent requests efficiently

## 🔄 Updates

To update your application:
1. Push changes to `main` branch
2. Workflows automatically detect changes
3. Only affected services are redeployed
4. Health checks ensure successful deployment
