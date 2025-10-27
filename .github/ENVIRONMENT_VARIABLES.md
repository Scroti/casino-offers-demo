# 🔐 Environment Variables Guide

## Backend Environment Variables

### Required Variables

| Variable | Value | Description | Example |
|----------|-------|-------------|---------|
| `NODE_ENV` | `production` | Environment mode | `production` |
| `JWT_SECRET` | Random string | JWT signing secret | `super-secret-key-change-this` |
| `JWT_EXPIRES` | Time string | JWT token expiration | `15m` |
| `MONGODB_URI` | Connection string | MongoDB connection | `mongodb+srv://user:pass@cluster...` |

### Optional Variables (Set if needed)

| Variable | Value | Description | Default |
|----------|-------|-------------|---------|
| `PORT` | Number | Server port | `3003` |
| `CORS_ORIGIN` | URL | Allowed CORS origins | `*` |
| `LOG_LEVEL` | String | Logging level | `info` |

## Frontend Environment Variables

### Required Variables

| Variable | Value | Description | Example |
|----------|-------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL | Backend API URL | `https://casino-demo-be.xxx.run.app/api/v1` |

### Optional Variables (Set if needed)

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_ENVIRONMENT` | String | `production` / `staging` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Boolean | `true` / `false` |

## 📋 How to Set Environment Variables

### Method 1: Via GitHub Actions (Recommended for CI/CD)

Add these in **GitHub Secrets** (Settings → Secrets and variables → Actions):

```bash
# Backend Secrets
JWT_SECRET=<generate-a-secure-random-string>
JWT_EXPIRES=15m
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# Infrastructure Secrets
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GCP_SA_KEY=<base64-encoded-service-account-key>
```

The workflows will automatically set:
- `NODE_ENV=production` for backend
- `NEXT_PUBLIC_API_URL` for frontend (auto-detected)

### Method 2: Via Cloud Run Console

1. Go to **Cloud Run** in Google Cloud Console
2. Click on your service (e.g., `casino-demo-be`)
3. Click **Edit & Deploy New Revision**
4. Go to **Variables & Secrets** tab
5. Add environment variables
6. Click **Deploy**

### Method 3: Via gcloud CLI

```bash
# Update backend environment variables
gcloud run services update casino-demo-be \
  --set-env-vars="
    NODE_ENV=production,
    JWT_SECRET=your-secret,
    JWT_EXPIRES=15m,
    MONGODB_URI=mongodb+srv://...
  " \
  --region us-central1

# Update frontend environment variables
gcloud run services update casino-demo-fe \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://casino-demo-be-xxx.run.app/api/v1" \
  --region us-central1
```

## 🔐 Generate Secure JWT Secret

### Option 1: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Option 2: Using OpenSSL
```bash
openssl rand -hex 64
```

### Option 3: Using Online Generator
Visit: https://randomkeygen.com/ (use "Fort Knox Passwords")

**Important**: Use at least 32 characters, store securely, and never commit to git.

## 🗄️ MongoDB Connection String Format

```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

### Get MongoDB URI from Atlas

1. Go to **MongoDB Atlas** → Your Cluster
2. Click **Connect**
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password

### MongoDB Settings Required

```bash
# Network Access - Add IP
IP Address: 0.0.0.0/0  # Allow all (for Cloud Run)

# Database Access - Create user
Username: your-username
Password: your-password
Database User Privileges: Atlas admin / Read and write to any database
```

## 📝 Environment-Specific Configurations

### Production

```bash
NODE_ENV=production
LOG_LEVEL=warn
CORS_ORIGIN=https://your-domain.com
```

### Staging

```bash
NODE_ENV=staging
LOG_LEVEL=debug
CORS_ORIGIN=https://staging.your-domain.com
```

## 🔍 Verify Environment Variables

### Check Backend Variables

```bash
gcloud run services describe casino-demo-be \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

### Check Frontend Variables

```bash
gcloud run services describe casino-demo-fe \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

### View Logs (to debug env issues)

```bash
# Backend logs
gcloud run services logs read casino-demo-be --region us-central1 --tail=50

# Frontend logs
gcloud run services logs read casino-demo-fe --region us-central1 --tail=50
```

## ⚠️ Security Best Practices

### ✅ DO:
- Use strong, random JWT secrets
- Never commit secrets to git
- Use GitHub Secrets for CI/CD
- Rotate secrets periodically
- Use different secrets for dev/staging/prod

### ❌ DON'T:
- Use default or weak secrets
- Commit `.env` files to git
- Share secrets in plain text
- Use production secrets in development

## 🔄 Update Environment Variables

### Quick Update Script

```bash
#!/bin/bash
# update-env.sh

# Update backend
gcloud run services update casino-demo-be \
  --update-env-vars="NODE_ENV=production,JWT_SECRET=new-secret" \
  --region us-central1

# Get backend URL and update frontend
BACKEND_URL=$(gcloud run services describe casino-demo-be --region us-central1 --format 'value(status.url)')
gcloud run services update casino-demo-fe \
  --update-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1" \
  --region us-central1

echo "Environment variables updated!"
echo "Backend URL: $BACKEND_URL"
```

## 📊 Monitoring Environment Variables

### Check Variable Usage in Code

```bash
# Grep for environment variables
grep -r "process.env" src/

# Common patterns
grep -r "NEXT_PUBLIC_" .
```

### Common Issues

1. **Variables not updating**: Redeploy the service
2. **Wrong format**: Check for quotes, commas, spaces
3. **Missing variables**: Check Cloud Run logs for errors

## 🎯 Checklist

- [ ] JWT_SECRET is set and secure (64+ characters)
- [ ] MONGODB_URI is valid and accessible
- [ ] CORS_ORIGIN matches your frontend domain
- [ ] NEXT_PUBLIC_API_URL points to correct backend
- [ ] All secrets are in GitHub Secrets (not hardcoded)
- [ ] Environment variables tested in production

## 📞 Need Help?

- Check Cloud Run logs for errors
- Verify MongoDB Atlas network settings
- Test API endpoints with curl
- Check GitHub Actions logs

