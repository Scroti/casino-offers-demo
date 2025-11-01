# 🚀 AWS Deployment Guide

Complete guide to deploy Casino Offers application on AWS using ECS (Elastic Container Service) with Fargate.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Detailed Setup](#detailed-setup)
5. [Alternative: EC2 Deployment](#alternative-ec2-deployment)
6. [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Application Load Balancer (ALB)             │  │
│  │              HTTPS (443) / HTTP (80)                 │  │
│  └────────────────┬─────────────────────────────────┬──┘  │
│                   │                                 │      │
│    ┌──────────────▼──────────┐    ┌────────────────▼───┐  │
│    │   ECS Service:          │    │   ECS Service:      │  │
│    │   Frontend (Fargate)    │    │   Backend (Fargate) │  │
│    │   Container: Next.js    │    │   Container: NestJS │  │
│    └──────────────┬──────────┘    └────────────────┬──┘  │
│                   │                                 │      │
│    ┌──────────────▼────────────────────────────────▼───┐  │
│    │              MongoDB Atlas                         │  │
│    │         (or DocumentDB / Mongo EC2)               │  │
│    └───────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CloudWatch Logs & Monitoring            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Services Used

- **ECS (Fargate)**: Container orchestration
- **ECR**: Container registry
- **ALB**: Load balancer
- **VPC**: Network isolation
- **CloudWatch**: Logging & monitoring
- **ACM**: SSL certificates
- **Parameter Store**: Secrets management
- **Route 53**: DNS (optional)

## ✅ Prerequisites

### 1. AWS Account Setup

```bash
# Install AWS CLI
# macOS
brew install awscli

# Ubuntu/Debian
sudo apt-get install awscli

# Windows
# Download from: https://aws.amazon.com/cli/

# Configure AWS CLI
aws configure

# You'll need:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

### 2. Required AWS Tools

```bash
# Check AWS CLI version
aws --version

# Install Docker (required for building images)
# Visit: https://docs.docker.com/get-docker/

# Verify Docker
docker --version
```

### 3. IAM Permissions

Ensure your IAM user/role has these permissions:
- ECS Full Access
- ECR Full Access
- EC2 (for VPC, ALB, Security Groups)
- IAM (for task execution roles)
- CloudWatch Logs
- ACM (for SSL certificates)
- Parameter Store

Or use: `arn:aws:iam::aws:policy/AdministratorAccess` for testing

## 🚀 Quick Start

### Option 1: Using AWS Console (Beginner-Friendly)

Follow the detailed manual setup below.

### Option 2: Using AWS CLI (Recommended)

See [Detailed Setup](#detailed-setup) section.

### Option 3: Using Terraform (Infrastructure as Code)

See `terraform/main.tf` configuration.

## 📝 Detailed Setup

### Step 1: Create ECR Repositories

```bash
# Set variables
REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create repositories
aws ecr create-repository \
  --repository-name casino-frontend \
  --region $REGION

aws ecr create-repository \
  --repository-name casino-backend \
  --region $REGION

# Get login command
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
```

### Step 2: Build and Push Docker Images

#### Backend Image

```bash
# Navigate to server directory
cd server

# Build image
docker build -t casino-backend:latest .

# Tag for ECR
docker tag casino-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-backend:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-backend:latest

cd ..
```

#### Frontend Image

```bash
# Build image (we'll set NEXT_PUBLIC_API_URL after backend is deployed)
docker build -t casino-frontend:latest .

# Tag for ECR
docker tag casino-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-frontend:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-frontend:latest
```

### Step 3: Create VPC and Networking

```bash
# Create VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
echo "VPC ID: $VPC_ID"

# Tag VPC with name
aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=casino-offers-vpc

# Enable DNS
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames

# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID

# Create public subnets (2 for high availability)
SUBNET_1=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone ${REGION}a --query 'Subnet.SubnetId' --output text)
SUBNET_2=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone ${REGION}b --query 'Subnet.SubnetId' --output text)

# Create Route Table
ROUTE_TABLE_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)

# Add route to Internet Gateway
aws ec2 create-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID

# Associate subnets with route table
aws ec2 associate-route-table --subnet-id $SUBNET_1 --route-table-id $ROUTE_TABLE_ID
aws ec2 associate-route-table --subnet-id $SUBNET_2 --route-table-id $ROUTE_TABLE_ID

echo "VPC Setup Complete:"
echo "VPC ID: $VPC_ID"
echo "Subnet 1: $SUBNET_1"
echo "Subnet 2: $SUBNET_2"
```

### Step 4: Create Security Groups

```bash
# Security group for ALB
ALB_SG=$(aws ec2 create-security-group --group-name casino-alb-sg --description "Security group for ALB" --vpc-id $VPC_ID --query 'GroupId' --output text)

# Allow HTTP and HTTPS
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0

# Security group for ECS tasks
ECS_SG=$(aws ec2 create-security-group --group-name casino-ecs-sg --description "Security group for ECS tasks" --vpc-id $VPC_ID --query 'GroupId' --output text)

# Allow traffic from ALB only
aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 3000 --source-group $ALB_SG

echo "Security Groups:"
echo "ALB SG: $ALB_SG"
echo "ECS SG: $ECS_SG"
```

### Step 5: Create IAM Roles

#### Task Execution Role

```bash
# Create trust policy
cat > task-execution-trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ecs-tasks.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Create role
aws iam create-role \
  --role-name CasinoTaskExecutionRole \
  --assume-role-policy-document file://task-execution-trust-policy.json

# Attach managed policy
aws iam attach-role-policy \
  --role-name CasinoTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Allow pulling from ECR
cat > ecr-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ],
    "Resource": "*"
  }]
}
EOF

aws iam put-role-policy \
  --role-name CasinoTaskExecutionRole \
  --policy-name ECRAccessPolicy \
  --policy-document file://ecr-policy.json

# Allow CloudWatch Logs
cat > cloudwatch-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ],
    "Resource": "arn:aws:logs:*:*:*"
  }]
}
EOF

aws iam put-role-policy \
  --role-name CasinoTaskExecutionRole \
  --policy-name CloudWatchLogsPolicy \
  --policy-document file://cloudwatch-policy.json

TASK_EXEC_ROLE_ARN=$(aws iam get-role --role-name CasinoTaskExecutionRole --query 'Role.Arn' --output text)
echo "Task Execution Role: $TASK_EXEC_ROLE_ARN"
```

#### Task Role (for application permissions)

```bash
aws iam create-role \
  --role-name CasinoTaskRole \
  --assume-role-policy-document file://task-execution-trust-policy.json

TASK_ROLE_ARN=$(aws iam get-role --role-name CasinoTaskRole --query 'Role.Arn' --output text)
echo "Task Role: $TASK_ROLE_ARN"
```

### Step 6: Create CloudWatch Log Groups

```bash
aws logs create-log-group --log-group-name /ecs/casino-backend
aws logs create-log-group --log-group-name /ecs/casino-frontend
```

### Step 7: Store Secrets in Parameter Store

```bash
# Store MongoDB credentials (be careful with real values!)
aws ssm put-parameter --name "/casino/mongodb/user" --value "your-mongo-user" --type "SecureString"
aws ssm put-parameter --name "/casino/mongodb/password" --value "your-mongo-password" --type "SecureString"
aws ssm put-parameter --name "/casino/mongodb/server" --value "your-cluster.mongodb.net" --type "String"
aws ssm put-parameter --name "/casino/mongodb/name" --value "casino_offers" --type "String"

# Store JWT secrets
aws ssm put-parameter --name "/casino/jwt/secret" --value "your-super-secret-jwt-key" --type "SecureString"
aws ssm put-parameter --name "/casino/jwt/refresh-secret" --value "your-super-secret-refresh-key" --type "SecureString"
```

### Step 8: Create Task Definitions

#### Backend Task Definition

```bash
cat > task-definition-backend.json <<EOF
{
  "family": "casino-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "$TASK_EXEC_ROLE_ARN",
  "taskRoleArn": "$TASK_ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "casino-backend",
      "image": "$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        },
        {
          "name": "APP_VERSIONING_DEFAULT_VERSION",
          "value": "1"
        }
      ],
      "secrets": [
        {
          "name": "MONGO_DB_USER",
          "valueFrom": "/casino/mongodb/user"
        },
        {
          "name": "MONGO_DB_PASSWORD",
          "valueFrom": "/casino/mongodb/password"
        },
        {
          "name": "MONGO_DB_SERVER",
          "valueFrom": "/casino/mongodb/server"
        },
        {
          "name": "MONGO_DB_NAME",
          "valueFrom": "/casino/mongodb/name"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "/casino/jwt/secret"
        },
        {
          "name": "JWT_REFRESH_SECRET",
          "valueFrom": "/casino/jwt/refresh-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/casino-backend",
          "awslogs-region": "$REGION",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})\""],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition-backend.json
```

#### Frontend Task Definition

```bash
# First, get your backend ALB DNS name
BACKEND_URL="http://your-backend-alb-dns-name-123456789.us-east-1.elb.amazonaws.com"

cat > task-definition-frontend.json <<EOF
{
  "family": "casino-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "$TASK_EXEC_ROLE_ARN",
  "taskRoleArn": "$TASK_ROLE_ARN",
  "containerDefinitions": [
    {
      "name": "casino-frontend",
      "image": "$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/casino-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        },
        {
          "name": "NEXT_PUBLIC_API_URL",
          "value": "$BACKEND_URL/api/v1"
        },
        {
          "name": "NEXT_PUBLIC_USE_MOCK_CASINOS",
          "value": "false"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/casino-frontend",
          "awslogs-region": "$REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition-frontend.json
```

### Step 9: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name casino-offers-cluster --capacity-providers FARGATE FARGATE_SPOT
```

### Step 10: Create Application Load Balancer

```bash
# Get your subnets (from Step 3)
SUBNET_1="subnet-xxxxx"
SUBNET_2="subnet-yyyyy"

# Create target groups
BACKEND_TG=$(aws elbv2 create-target-group \
  --name casino-backend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id $VPC_ID \
  --health-check-path /api/v1/health \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

FRONTEND_TG=$(aws elbv2 create-target-group \
  --name casino-frontend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id $VPC_ID \
  --health-check-path / \
  --health-check-interval-seconds 30 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Create ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name casino-offers-alb \
  --subnets $SUBNET_1 $SUBNET_2 \
  --security-groups $ALB_SG \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Wait for ALB to be active
aws elbv2 wait load-balancer-available --load-balancer-arns $ALB_ARN

# Get ALB listener ARN
ALB_LISTENER=$(aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$FRONTEND_TG \
  --query 'Listeners[0].ListenerArn' \
  --output text)

echo "ALB DNS Name:"
aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text
```

### Step 11: Create ECS Services

#### Backend Service

```bash
aws ecs create-service \
  --cluster casino-offers-cluster \
  --service-name casino-backend-service \
  --task-definition casino-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$BACKEND_TG,containerName=casino-backend,containerPort=3000" \
  --health-check-grace-period-seconds 60
```

#### Frontend Service

```bash
aws ecs create-service \
  --cluster casino-offers-cluster \
  --service-name casino-frontend-service \
  --task-definition casino-frontend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_1,$SUBNET_2],securityGroups=[$ECS_SG],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$FRONTEND_TG,containerName=casino-frontend,containerPort=3000" \
  --health-check-grace-period-seconds 60
```

### Step 12: Configure ALB Routing

```bash
# Create a rule to route /api/* to backend
aws elbv2 create-rule \
  --listener-arn $ALB_LISTENER \
  --priority 100 \
  --conditions Field=path-pattern,Values="/api/*" \
  --actions Type=forward,TargetGroupArn=$BACKEND_TG
```

### Step 13: Get Your URLs

```bash
# Get ALB DNS
ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)
echo "Your application is available at:"
echo "Frontend: http://$ALB_DNS"
echo "Backend API: http://$ALB_DNS/api/v1"
echo "Swagger Docs: http://$ALB_DNS/api/v1/swagger"
```

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY_BACKEND: casino-backend
  ECR_REPOSITORY_FRONTEND: casino-frontend
  ECS_SERVICE_BACKEND: casino-backend-service
  ECS_SERVICE_FRONTEND: casino-frontend-service
  ECS_CLUSTER: casino-offers-cluster

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push backend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd server
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster ${{ env.ECS_CLUSTER }} --service ${{ env.ECS_SERVICE_BACKEND }} --force-new-deployment

  deploy-frontend:
    needs: deploy-backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Get Backend URL
        id: backend
        run: |
          BACKEND_URL=$(aws elbv2 describe-load-balancers --query "LoadBalancers[?LoadBalancerName=='casino-offers-alb'].DNSName" --output text)
          echo "url=$BACKEND_URL" >> $GITHUB_OUTPUT

      - name: Build, tag, and push frontend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
          NEXT_PUBLIC_API_URL: http://${{ steps.backend.outputs.url }}/api/v1
        run: |
          docker build --build-arg NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL -t $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster ${{ env.ECS_CLUSTER }} --service ${{ env.ECS_SERVICE_FRONTEND }} --force-new-deployment
```

## 🎯 Alternative: Simplified EC2 Deployment

For a simpler setup without ECS:

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids $ECS_SG \
  --subnet-id $SUBNET_1 \
  --user-data file://user-data.sh
```

Create `user-data.sh`:

```bash
#!/bin/bash
yum update -y
yum install docker -y
service docker start
usermod -a -G docker ec2-user

# Install docker-compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Pull and run containers
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker pull $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/casino-backend:latest
docker pull $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/casino-frontend:latest

# Run with docker-compose (create compose file)
docker-compose up -d
```

## 💰 Cost Estimation

Estimated monthly costs (us-east-1):

- **ECS Fargate**: ~$50-100/month (2 tasks × 1vCPU × 2GB)
- **Application Load Balancer**: ~$20/month
- **ECR Storage**: ~$1-5/month
- **CloudWatch Logs**: ~$5-15/month
- **Data Transfer**: ~$10-50/month
- **Parameter Store**: Free tier

**Total**: ~$86-190/month

With reserved capacity and savings plans, you can reduce costs by 30-50%.

## 🔍 Monitoring

```bash
# View backend logs
aws logs tail /ecs/casino-backend --follow

# View frontend logs
aws logs tail /ecs/casino-frontend --follow

# Check service status
aws ecs describe-services --cluster casino-offers-cluster --services casino-backend-service casino-frontend-service

# Get task IDs
aws ecs list-tasks --cluster casino-offers-cluster

# Describe specific task
aws ecs describe-tasks --cluster casino-offers-cluster --tasks TASK_ARN
```

## 🐛 Troubleshooting

**Issue**: Tasks failing to start
```bash
# Check logs
aws logs tail /ecs/casino-backend --follow

# Check task definition
aws ecs describe-task-definition --task-definition casino-backend

# Check service events
aws ecs describe-services --cluster casino-offers-cluster --services casino-backend-service
```

**Issue**: Cannot pull images
```bash
# Verify IAM roles
aws iam get-role --role-name CasinoTaskExecutionRole

# Check ECR permissions
aws ecr describe-repositories
```

**Issue**: Health checks failing
```bash
# Check target group health
aws elbv2 describe-target-health --target-group-arn $BACKEND_TG

# Test health endpoint from container
aws ecs execute-command --cluster casino-offers-cluster --task TASK_ARN --container casino-backend --interactive --command "/bin/sh"
```

**Issue**: Network connectivity
```bash
# Verify security groups
aws ec2 describe-security-groups --group-ids $ALB_SG $ECS_SG

# Check VPC configuration
aws ec2 describe-vpcs --vpc-ids $VPC_ID
```

## 🎓 Next Steps

1. **Add HTTPS**: Request SSL certificate from ACM
2. **Set up Auto Scaling**: Configure target tracking policies
3. **Custom Domain**: Configure Route 53
4. **Add WAF**: Protect against common attacks
5. **Backup Strategy**: Regular ECR image backups

## 📚 Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS Fargate Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [AWS Pricing Calculator](https://calculator.aws/)

## 🤝 Need Help?

Common commands cheat sheet in `aws-commands.txt`


