# 🚀 GitHub Actions Setup Guide

This guide will help you set up automatic deployment from GitHub to Google Cloud Run.

## 📋 Prerequisites

1. ✅ GitHub repository
2. ✅ Google Cloud Project
3. ✅ Google Cloud Service Account with permissions

## 🔑 Step 1: Create Google Cloud Service Account

### 1.1 Create Service Account

```bash
# Set your project ID
PROJECT_ID="your-project-id"
REGION="us-central1"

# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer" \
  --project=$PROJECT_ID

# Get service account email
SA_EMAIL="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"
```

### 1.2 Grant Permissions

```bash
# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Grant Storage Admin for Cloud Build
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"
```

### 1.3 Create and Download Key

```bash
# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=${SA_EMAIL} \
  --project=$PROJECT_ID

# Encode key to base64 (for GitHub Secrets)
base64 key.json > key-base64.txt

# Copy the content of key-base64.txt
cat key-base64.txt
```

## 🔐 Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

### Required Secrets

1. **GCP_SA_KEY**
   - Value: Base64 encoded service account key (from Step 1.3)
   - Description: Google Cloud service account key

2. **GCP_PROJECT_ID**
   - Value: `your-project-id`
   - Description: Google Cloud project ID

3. **GCP_REGION**
   - Value: `us-central1` (or your preferred region)
   - Description: Cloud Run deployment region

4. **JWT_SECRET**
   - Value: Your JWT secret key
   - Description: Secret key for JWT tokens

5. **JWT_EXPIRES**
   - Value: `15m`
   - Description: JWT token expiration time

6. **MONGODB_URI**
   - Value: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
   - Description: MongoDB connection string

### Example Secrets Values

```
GCP_SA_KEY: eyJ0eXAiOiJKV1QiLCJhbGc...
GCP_PROJECT_ID: casino-demo-prod
GCP_REGION: us-central1
JWT_SECRET: my-super-secret-jwt-key-12345
JWT_EXPIRES: 15m
MONGODB_URI: mongodb+srv://user:pass@cluster.mongodb.net/casino-demo
```

## 🎯 Step 3: Choose Deployment Strategy

You have three workflow options:

### Option A: Deploy Full Stack (Recommended)
- **File**: `.github/workflows/deploy-full.yml`
- **Triggers**: On push to `main` branch
- **Deploys**: Both backend and frontend in sequence
- **Use Case**: Complete deployment from single push

### Option B: Deploy Separately
- **Files**: 
  - `.github/workflows/deploy-backend.yml` (deploys backend only)
  - `.github/workflows/deploy-frontend.yml` (deploys frontend only)
- **Triggers**: 
  - Backend on changes to `../casino-demo-be/**`
  - Frontend on changes to frontend files
- **Use Case**: Selective deployment based on what changed

### Option C: Manual Deployment
- **Workflow Dispatch**: All workflows support manual trigger
- **Usage**: Run from GitHub Actions UI
- **Use Case**: On-demand deployments

## 🚀 Step 4: Enable Cloud Run APIs

```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable servicenetworking.googleapis.com

# Enable APIs in your project
gcloud projects list
gcloud config set project YOUR_PROJECT_ID
```

## 📝 Step 5: Repository Structure

Ensure your repository has this structure:

```
your-repo/
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml
│       ├── deploy-frontend.yml
│       └── deploy-full.yml
├── casino-demo/
│   ├── Dockerfile
│   ├── next.config.ts
│   └── ... (frontend files)
└── casino-demo-be/
    ├── Dockerfile
    └── ... (backend files)
```

## 🎬 Step 6: First Deployment

### Method 1: Push to Main Branch

```bash
# Make sure all changes are committed
git add .
git commit -m "Setup CI/CD"
git push origin main
```

### Method 2: Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Deploy Full Stack to Cloud Run**
3. Click **Run workflow**
4. Select branch: **main**
5. Click **Run workflow**

## ✅ Step 7: Verify Deployment

### Check GitHub Actions

```bash
# View workflow runs
# Go to: https://github.com/your-org/your-repo/actions
```

### Check Cloud Run Services

```bash
# List services
gcloud run services list

# Check backend
gcloud run services describe casino-demo-be --region us-central1

# Check frontend
gcloud run services describe casino-demo-fe --region us-central1
```

### Test Endpoints

```bash
# Get URLs
BACKEND_URL=$(gcloud run services describe casino-demo-be --region us-central1 --format 'value(status.url)')
FRONTEND_URL=$(gcloud run services describe casino-demo-fe --region us-central1 --format 'value(status.url)')

# Test backend health
curl $BACKEND_URL/api/v1/health

# Open frontend
echo "Frontend: $FRONTEND_URL"
```

## 🔧 Troubleshooting

### Issue: Workflow fails with "Permission denied"

**Solution**: Check service account permissions
```bash
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

### Issue: "Service account does not have permission"

**Solution**: Grant additional permissions
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.editor"
```

### Issue: Deployment timeout

**Solution**: Increase timeout in workflow file
```yaml
gcloud run deploy casino-demo-be \
  --timeout=900 \
  ...
```

### Issue: MongoDB connection fails

**Solution**: 
1. Check MongoDB Atlas IP whitelist (should be `0.0.0.0/0`)
2. Verify connection string format
3. Check credentials in GitHub secrets

### View Logs

```bash
# GitHub Actions logs
# Go to: https://github.com/your-org/your-repo/actions

# Cloud Run logs
gcloud run services logs read casino-demo-be --region us-central1
gcloud run services logs read casino-demo-fe --region us-central1
```

## 🎨 Customization

### Change Deploy Branch

Edit the workflow file:
```yaml
on:
  push:
    branches: [main, production]  # Add more branches
```

### Add Deployment Notifications

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment complete!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Environment-Specific Deployments

```yaml
# .github/workflows/deploy-staging.yml
env:
  GCP_REGION: us-central1
  ENVIRONMENT: staging

- name: Deploy to Staging
  run: |
    gcloud run deploy casino-demo-be-staging \
      --set-env-vars="ENVIRONMENT=staging,..."
```

## 📊 Monitoring

### Set up Cloud Monitoring

```bash
# Enable monitoring
gcloud monitoring uptime create --location us-central1 \
  --display-name="Casino Demo Backend" \
  --resource-type=cloud_run_revision \
  --resource-id=casino-demo-be
```

### View Metrics

- Go to Cloud Console → Cloud Run → Metrics
- View requests, latency, errors
- Set up alerts

## 🎯 Next Steps

1. ✅ Set up GitHub secrets
2. ✅ Configure service account
3. ✅ Test first deployment
4. ✅ Verify services are running
5. ✅ Monitor performance
6. ✅ Set up custom domain (optional)
7. ✅ Configure auto-scaling
8. ✅ Set up alerts and notifications

## 📞 Need Help?

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Cloud Run Pricing**: https://cloud.google.com/run/pricing

