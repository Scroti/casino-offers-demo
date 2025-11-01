# 🚀 Quick Start: Deploy to AWS

Quick reference guide for deploying Casino Offers to AWS.

## 📋 Prerequisites

```bash
# Install AWS CLI
# macOS: brew install awscli
# Ubuntu: sudo apt-get install awscli
# Windows: Download from aws.amazon.com/cli/

# Configure AWS
aws configure

# Install Docker
# Visit: https://docs.docker.com/get-docker/

# Verify installations
aws --version
docker --version
```

## ⚡ Quick Deploy (3 Steps)

### Step 1: Build & Push Images

```bash
# Make script executable (already done)
chmod +x deploy-aws.sh

# Build and push Docker images
./deploy-aws.sh --build-only
```

### Step 2: Create Infrastructure

```bash
# Follow AWS_DEPLOYMENT.md Step 3-12 for manual setup
# OR use Terraform if you have it configured

# Store secrets in Parameter Store
aws ssm put-parameter --name "/casino/mongodb/user" --value "your-mongo-user" --type "SecureString"
aws ssm put-parameter --name "/casino/mongodb/password" --value "your-mongo-password" --type "SecureString"
aws ssm put-parameter --name "/casino/mongodb/server" --value "your-cluster.mongodb.net" --type "String"
aws ssm put-parameter --name "/casino/mongodb/name" --value "casino_offers" --type "String"
aws ssm put-parameter --name "/casino/jwt/secret" --value "your-jwt-secret-32-chars" --type "SecureString"
```

### Step 3: Deploy Services

```bash
# Deploy ECS services
./deploy-aws.sh --deploy-only
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) | Complete AWS deployment guide (800+ lines) |
| [AWS_GCP_SERVICES_MIGRATION.md](AWS_GCP_SERVICES_MIGRATION.md) | Using GCP services with AWS |
| [DEPLOYMENT.md](DEPLOYMENT.md) | GCP Cloud Run deployment (alternative) |
| [README.md](README.md) | Main project README |

## 🎯 Architecture

```
AWS ECS Fargate
├── Frontend (Next.js)
│   ├── Port: 3000
│   └── Image: casino-frontend
│
└── Backend (NestJS)
    ├── Port: 3000
    ├── Image: casino-backend
    ├── MongoDB Atlas (external)
    ├── Google Sheets API (external)
    └── Health: /api/v1/health

Application Load Balancer (ALB)
├── Route / → Frontend
└── Route /api/* → Backend
```

## 🔑 Key Services

### ✅ Keep from GCP
- **MongoDB Atlas** - Works perfectly with AWS
- **Google Sheets API** - Not tied to GCP infrastructure

### ☁️ Use AWS Native
- **ECS Fargate** - Container hosting
- **ECR** - Container registry
- **ALB** - Load balancing
- **Parameter Store** - Secrets management
- **CloudWatch** - Logging & monitoring
- **VPC** - Network isolation

### ⚠️ Migrate from GCP
- **Firestore** → **DynamoDB**
- **Cloud Storage** → **S3**
- **Cloud Functions** → **Lambda**

## 💰 Estimated Costs

**Monthly (light traffic):**
- ECS Fargate: $50-100
- ALB: $20
- ECR + CloudWatch: $10-20
- MongoDB Atlas: $0-57 (free tier available)
- **Total: $80-197/month**

## 🔧 Common Commands

```bash
# View logs
aws logs tail /ecs/casino-backend --follow
aws logs tail /ecs/casino-frontend --follow

# Check service status
aws ecs describe-services --cluster casino-offers-cluster --services casino-backend-service casino-frontend-service

# Get ALB URL
aws elbv2 describe-load-balancers --query "LoadBalancers[?LoadBalancerName=='casino-offers-alb'].DNSName" --output text

# Update service
./deploy-aws.sh --deploy-only

# Full deployment
./deploy-aws.sh
```

## 🆘 Troubleshooting

**Issue:** Can't pull images from ECR
```bash
# Re-login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

**Issue:** Tasks failing to start
```bash
# Check logs
aws logs tail /ecs/casino-backend --follow

# Check task definition
aws ecs describe-task-definition --task-definition casino-backend
```

**Issue:** Health checks failing
```bash
# Check target group health
BACKEND_TG=$(aws elbv2 describe-target-groups --names casino-backend-tg --query 'TargetGroups[0].TargetGroupArn' --output text)
aws elbv2 describe-target-health --target-group-arn $BACKEND_TG
```

## 📖 Next Steps

1. ✅ Read [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) for detailed setup
2. ✅ Check [AWS_GCP_SERVICES_MIGRATION.md](AWS_GCP_SERVICES_MIGRATION.md) for service compatibility
3. ✅ Follow step-by-step instructions
4. ✅ Deploy and test

## 🤝 Support

Need help? Check these resources:
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS Fargate Pricing](https://aws.amazon.com/fargate/pricing/)
- [MongoDB Atlas + AWS](https://www.mongodb.com/docs/atlas/security/integration-aws/)



