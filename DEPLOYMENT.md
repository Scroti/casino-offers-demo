# 🚀 GCP Deployment Guide - Google Cloud Run

This guide will help you deploy both the frontend and backend to Google Cloud Run.

## 🎯 Choose Your Deployment Method

### Option 1: Automatic Deployment via GitHub Actions (Recommended)
- ✅ Deploys automatically on push to `main` branch
- ✅ No manual commands needed
- ✅ See [`.github/workflows/`](.github/workflows/) for workflows

### Option 2: Manual Deployment via CLI
- ✅ Full control over deployment
- ✅ See steps below

## 📋 Prerequisites

1. **Install Google Cloud CLI**
   ```bash
   # For macOS
   brew install --cask google-cloud-sdk
   
   # For Linux
   curl https://sdk.cloud.google.com | bash
   
   # For Windows
   # Download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Login to Google Cloud**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable Required APIs**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

## 🎯 Quick Deploy

### Option 1: Using the Deploy Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Option 2: Manual Deploy

#### Deploy Backend

```bash
cd server

gcloud run deploy casino-offers-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars="NODE_ENV=production"
```

#### Deploy Frontend

```bash
# From root directory

# Get backend URL first
BACKEND_URL=$(gcloud run services describe casino-offers-backend --region us-central1 --format 'value(status.url)')

gcloud run deploy casino-offers-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1"
```

## ⚙️ Environment Variables Setup

### Backend Environment Variables

You need to configure these in the Cloud Run console or via CLI:

```bash
gcloud run services update casino-offers-backend \
  --set-env-vars="
    NODE_ENV=production,
    JWT_SECRET=your-super-secret-jwt-key-here,
    JWT_EXPIRES=15m,
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/casino-offers
  "
```

**Important:** Replace with your actual values:
- `JWT_SECRET`: Use a strong secret key
- `MONGODB_URI`: Get from MongoDB Atlas

### Frontend Environment Variables

The frontend URL is automatically set during deployment. If you need to update it:

```bash
gcloud run services update casino-offers-frontend \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://casino-offers-backend-xxxxx-uc.a.run.app/api/v1"
```

## 📊 Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster

2. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Save credentials

3. **Whitelist IP Addresses**
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (for Cloud Run)

4. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update Backend Environment**
   ```bash
   gcloud run services update casino-demo-be \
     --set-env-vars="MONGODB_URI=your-connection-string"
   ```

## 🔍 Verify Deployment

### Check Backend

```bash
# Get backend URL
BACKEND_URL=$(gcloud run services describe casino-demo-be --region us-central1 --format 'value(status.url)')

# Test health endpoint
curl $BACKEND_URL/api/v1/health
```

### Check Frontend

```bash
# Get frontend URL
FRONTEND_URL=$(gcloud run services describe casino-demo-fe --region us-central1 --format 'value(status.url)')

# Open in browser
echo $FRONTEND_URL
```

## 🔄 Update Configuration

### Update Backend URL in Frontend

After deployment, you need to update the API URL in your frontend code:

1. **Update RTK Query configs** to use the production URL
2. Or use environment variables to switch between dev/prod

### Example: Dynamic API URL

In your RTK Query configs, you can make the base URL dynamic:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';
```

## 🎯 Custom Domain (Optional)

### Map Custom Domain

```bash
# Map custom domain to frontend
gcloud run domain-mappings create \
  --service casino-demo-fe \
  --domain your-domain.com \
  --region us-central1

# Verify DNS settings
gcloud run domain-mappings describe \
  --service casino-demo-fe \
  --domain your-domain.com \
  --region us-central1
```

## 💰 Cost Optimization

Cloud Run offers **pay-per-request** pricing:

- **CPU Allocation**: Only during request processing
- **Memory**: Adjust based on your needs (512Mi to 4Gi)
- **Concurrency**: Set based on your app (default is 80)

### Optimize Costs

```bash
# Update backend with optimized settings
gcloud run services update casino-demo-be \
  --cpu=2 \
  --memory=512Mi \
  --max-instances=10 \
  --concurrency=80 \
  --cpu-boost

# Update frontend with optimized settings
gcloud run services update casino-demo-fe \
  --cpu=1 \
  --memory=512Mi \
  --max-instances=5 \
  --concurrency=40
```

## 🔧 Troubleshooting

### Common Issues

1. **Deployment fails with timeout**
   ```bash
   # Increase timeout
   gcloud run services update casino-demo-be --timeout=300
   ```

2. **Build fails**
   - Check Docker logs
   - Verify all dependencies are in package.json
   - Check Dockerfile syntax

3. **Runtime errors**
   - Check Cloud Run logs:
   ```bash
   gcloud run services logs read casino-demo-be
   ```

4. **Cannot connect to database**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Verify credentials

### View Logs

```bash
# Backend logs
gcloud run services logs read casino-demo-be --region us-central1

# Frontend logs
gcloud run services logs read casino-demo-fe --region us-central1

# Stream logs in real-time
gcloud run services logs tail casino-demo-be --region us-central1
```

## 🚀 CI/CD Setup (Optional)

### Create GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      - run: |
          gcloud run deploy casino-demo-be \
            --source . \
            --region us-central1
```

## 📝 Next Steps

1. ✅ Deploy backend and frontend
2. ✅ Set up environment variables
3. ✅ Configure MongoDB Atlas
4. ✅ Test all endpoints
5. ✅ Set up monitoring and alerts
6. ✅ Configure custom domain (optional)
7. ✅ Set up CI/CD pipeline (optional)

## 📞 Need Help?

- **Google Cloud Run Docs**: https://cloud.google.com/run/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **NestJS Deployment**: https://docs.nestjs.com/recipes/hot-reload

