# ⚡ Quick Start: Deploy Casino Offers to AWS

The fastest way to deploy your Casino Offers application to AWS.

## 🎯 Your Stack

Based on code analysis:
- ✅ **MongoDB** (Mongoose) - Primary database
- ✅ **Google Sheets API** - Admin sync
- ❌ **NO Firestore** - Not used in your codebase

## 🚀 5-Minute Setup

### Prerequisites

```bash
# 1. Install AWS CLI
# macOS: brew install awscli
# Ubuntu: sudo apt-get install awscli

# 2. Configure AWS
aws configure
# Enter: Access Key, Secret Key, Region (us-east-1), Format (json)

# 3. Install Docker
# Visit: https://docs.docker.com/get-docker/

# 4. Verify
aws --version
docker --version
```

### Step 1: MongoDB Atlas (2 minutes)

```bash
# 1. Create free MongoDB Atlas account
# Visit: https://www.mongodb.com/cloud/atlas/register

# 2. Create M0 FREE cluster (AWS region)
# Region: Same as your AWS region (us-east-1)

# 3. Create database user
# Username: casino_admin
# Password: [Generate secure password]

# 4. Configure network access
# Add: 0.0.0.0/0 (for testing)

# 5. Get connection string
# Connect → Connect your application → Copy string
```

### Step 2: Store Secrets (1 minute)

```bash
# MongoDB credentials
aws ssm put-parameter --name "/casino/mongodb/user" --value "casino_admin" --type "String"
aws ssm put-parameter --name "/casino/mongodb/password" --value "YOUR_PASSWORD" --type "SecureString"
aws ssm put-parameter --name "/casino/mongodb/server" --value "cluster0.xxxxx.mongodb.net" --type "String"
aws ssm put-parameter --name "/casino/mongodb/name" --value "casino_offers" --type "String"

# JWT secrets
aws ssm put-parameter --name "/casino/jwt/secret" --value "$(openssl rand -hex 32)" --type "SecureString"
aws ssm put-parameter --name "/casino/jwt/refresh-secret" --value "$(openssl rand -hex 32)" --type "SecureString"

# Google Sheets (if you have it)
aws ssm put-parameter --name "/casino/google/service-account-email" --value "your-sa@project.iam.gserviceaccount.com" --type "String"
aws ssm put-parameter --name "/casino/google/private-key" --value "$(cat google-credentials.json | jq -r '.private_key')" --type "SecureString"
aws ssm put-parameter --name "/casino/google/spreadsheet-id" --value "your-id" --type "String"
aws ssm put-parameter --name "/casino/google/sheet-name" --value "Newsletter" --type "String"
```

### Step 3: Deploy (2 minutes)

```bash
# Make script executable
chmod +x deploy-aws.sh

# Deploy everything
./deploy-aws.sh
```

The script will:
1. ✅ Build Docker images
2. ✅ Push to ECR
3. ✅ Create infrastructure (VPC, ALB, ECS)
4. ✅ Deploy services
5. ✅ Show your URLs

## 📚 Need More Details?

| Document | Purpose |
|----------|---------|
| [README_AWS.md](README_AWS.md) | Quick reference |
| [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) | Complete guide (815 lines) |
| [AWS_MONGODB_SETUP.md](AWS_MONGODB_SETUP.md) | MongoDB options |
| [AWS_GCP_SERVICES_MIGRATION.md](AWS_GCP_SERVICES_MIGRATION.md) | Service comparison |

## 🔧 Common Tasks

### View Logs

```bash
# Backend
aws logs tail /ecs/casino-backend --follow

# Frontend
aws logs tail /ecs/casino-frontend --follow
```

### Update Deployment

```bash
# Rebuild and redeploy
./deploy-aws.sh

# Or just redeploy services
./deploy-aws.sh --deploy-only
```

### Get Your URL

```bash
# Get ALB DNS
aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?LoadBalancerName=='casino-offers-alb'].DNSName" \
  --output text
```

### Check Service Status

```bash
aws ecs describe-services \
  --cluster casino-offers-cluster \
  --services casino-backend-service casino-frontend-service \
  --query 'services[*].{Name:serviceName,Status:status,Desired:desiredCount,Running:runningCount}'
```

## ⚠️ Important Notes

### MongoDB Connection String

Update your MongoDB connection for Atlas (if different):

```typescript
// server/src/app.module.ts
uri: `mongodb+srv://${configService.get<string>('MONGO_DB_USER')}:${configService.get<string>('MONGO_DB_PASSWORD')}@${configService.get<string>('MONGO_DB_SERVER')}/${configService.get<string>('MONGO_DB_NAME')}?retryWrites=true&w=majority`
```

### Google Sheets

Your Google Sheets integration **works as-is** - no changes needed!

## 💰 Expected Costs

**Monthly:**
- ECS Fargate: $50-100
- ALB: $20
- MongoDB Atlas: **$0** (free tier)
- ECR/CloudWatch: $10-20
- **Total: $80-140/month**

## 🆘 Troubleshooting

**Issue:** Can't connect to MongoDB
- Check Atlas network access (add 0.0.0.0/0 for testing)
- Verify credentials in Parameter Store
- Check logs: `aws logs tail /ecs/casino-backend`

**Issue:** Container failing to start
- View logs: `aws logs tail /ecs/casino-backend --follow`
- Check task definition: `aws ecs describe-task-definition --task-definition casino-backend`
- Verify secrets: `aws ssm get-parameters --names /casino/mongodb/user /casino/mongodb/password --with-decryption`

**Issue:** Health checks failing
```bash
# Check target group
aws elbv2 describe-target-health \
  --target-group-arn $(aws elbv2 describe-target-groups --names casino-backend-tg --query 'TargetGroups[0].TargetGroupArn' --output text)
```

## ✅ You're Done!

After deployment, you'll get:
- 🌐 Frontend: http://your-alb-dns-name
- 🔧 Backend API: http://your-alb-dns-name/api/v1
- 📚 Swagger Docs: http://your-alb-dns-name/api/v1/swagger
- 🗄️ MongoDB Atlas: Managed by MongoDB
- 📊 Google Sheets: Syncing automatically

## 🎓 Next Steps

1. Set up custom domain (Route 53)
2. Add SSL certificate (ACM)
3. Configure auto-scaling
4. Set up CloudWatch alerts
5. Add monitoring dashboards

Happy deploying! 🚀


