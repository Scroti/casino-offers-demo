# GCP Setup Guide for GitHub Actions

## 🔐 Required Secrets

Add these secrets to your GitHub repository:

### 1. GCP Service Account Key
- **Secret Name**: `GCP_SA_KEY`
- **Value**: JSON key file content

### 2. GCP Project ID
- **Secret Name**: `GCP_PROJECT_ID`
- **Value**: Your GCP project ID

## 🛠️ Setup Steps

### Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** → **Service Accounts**
3. Click **Create Service Account**
4. Name: `github-actions-deploy`
5. Description: `Service account for GitHub Actions deployment`

### Step 2: Assign Roles

Assign these roles to the service account:
- **Cloud Run Admin** (`roles/run.admin`)
- **Cloud Build Editor** (`roles/cloudbuild.builds.editor`)
- **Service Account User** (`roles/iam.serviceAccountUser`)
- **Storage Admin** (`roles/storage.admin`)

### Step 3: Create and Download Key

1. Click on the service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Download the JSON file

### Step 4: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add both secrets:
   - `GCP_SA_KEY`: Paste the entire JSON file content
   - `GCP_PROJECT_ID`: Your GCP project ID

## 🚀 Enable Required APIs

Run these commands or enable in the GCP Console:

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## ✅ Verification

After setup, push to the `main` branch and check:
1. **GitHub Actions** tab for deployment status
2. **Google Cloud Console** → **Cloud Run** for deployed services

## 🔧 Troubleshooting

### Common Issues:

1. **Permission denied**
   - Check service account roles
   - Verify JSON key is correct

2. **API not enabled**
   - Enable required APIs in GCP Console

3. **Build fails**
   - Check Dockerfile syntax
   - Verify all dependencies are included

### View Logs:
```bash
gcloud run services logs read casino-offers-backend --region us-central1
gcloud run services logs read casino-offers-frontend --region us-central1
```
