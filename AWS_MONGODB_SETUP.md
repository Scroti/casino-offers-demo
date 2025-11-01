# 🗄️ MongoDB Setup on AWS

Guide for using MongoDB with AWS ECS deployment.

## 📊 Your Current Setup

Based on your code analysis:
- ✅ **MongoDB** (via Mongoose) - Primary database
- ✅ **Google Sheets API** - Admin dashboard sync
- ❌ **NO Firestore** - Not used in your code

## 🔧 MongoDB Options for AWS

You have 3 choices:

### **Option 1: MongoDB Atlas (Cloud-Agnostic)** ⭐ RECOMMENDED

**Best For:** Most developers, easiest setup, works from anywhere

**Advantages:**
- Fully managed
- Cloud-agnostic (works with AWS, GCP, Azure)
- Free tier available
- Global clusters
- Automatic backups
- Built-in security

**Setup:**

1. Create account: https://www.mongodb.com/cloud/atlas/register

2. Create cluster (FREE tier):
   - Choose: AWS (or any provider)
   - Region: Closest to your AWS region
   - Tier: M0 (Free) - 512MB storage

3. Configure Network Access:
```bash
# In MongoDB Atlas Dashboard → Network Access → Add IP Address
# Add your AWS VPC CIDR or use 0.0.0.0/0 for testing
```

4. Create Database User:
```bash
# In Atlas Dashboard → Database Access → Add New User
# Username: admin
# Password: Generate secure password
# Roles: Atlas admin
```

5. Get Connection String:
```bash
# Atlas Dashboard → Clusters → Connect → Connect your application
# Copy the connection string
```

6. Store in AWS Parameter Store:
```bash
# Example MongoDB Atlas connection string:
# mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/casino_offers?retryWrites=true&w=majority

aws ssm put-parameter --name "/casino/mongodb/server" --value "cluster0.xxxxx.mongodb.net" --type "String"
aws ssm put-parameter --name "/casino/mongodb/user" --value "admin" --type "String"
aws ssm put-parameter --name "/casino/mongodb/password" --value "YOUR_PASSWORD" --type "SecureString"
aws ssm put-parameter --name "/casino/mongodb/name" --value "casino_offers" --type "String"
```

7. Update MongoDB connection in code:
```typescript
// server/src/app.module.ts
uri: `mongodb+srv://${configService.get<string>('MONGO_DB_USER')}:${configService.get<string>('MONGO_DB_PASSWORD')}@${configService.get<string>('MONGO_DB_SERVER')}/${configService.get<string>('MONGO_DB_NAME')}?retryWrites=true&w=majority`
```

**Cost:** 
- Free: $0/month (512MB)
- M10: ~$57/month (10GB)
- M30: ~$270/month (80GB)

---

### **Option 2: Self-Hosted MongoDB on EC2**

**Best For:** Full control, cost optimization at scale

**Advantages:**
- Full control
- Lower cost at high scale
- No vendor lock-in

**Disadvantages:**
- You manage backups
- You manage security
- Requires DevOps knowledge

**Setup:**

1. Launch EC2 Instance:
```bash
# Launch MongoDB-optimized EC2
aws ec2 run-instances \
  --image-id ami-xxxxx \
  --instance-type t3.medium \
  --key-name your-key \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx \
  --user-data file://mongodb-setup.sh
```

2. Create `mongodb-setup.sh`:
```bash
#!/bin/bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Configure MongoDB
sudo mongosh <<EOF
use admin
db.createUser({
  user: "admin",
  pwd: "securepassword",
  roles: [ { role: "root", db: "admin" } ]
})
use casino_offers
EOF

# Configure MongoDB to listen on all interfaces
sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mongod.conf
sudo systemctl restart mongod
```

3. Update Security Group:
```bash
# Allow MongoDB port from ECS security group
aws ec2 authorize-security-group-ingress \
  --group-id sg-mongodb \
  --protocol tcp \
  --port 27017 \
  --source-group sg-ecs
```

4. Store credentials:
```bash
aws ssm put-parameter --name "/casino/mongodb/server" --value "YOUR_EC2_PRIVATE_IP" --type "String"
aws ssm put-parameter --name "/casino/mongodb/user" --value "admin" --type "String"
aws ssm put-parameter --name "/casino/mongodb/password" --value "securepassword" --type "SecureString"
```

**Cost:** ~$30-50/month (t3.medium instance)

---

### **Option 3: AWS DocumentDB (MongoDB-Compatible)**

**Best For:** AWS-native, enterprise needs, MongoDB compatibility

**Advantages:**
- Fully managed by AWS
- MongoDB 4.0 compatible
- Auto backups
- Multi-AZ
- Security integrated

**Disadvantages:**
- Expensive
- AWS only (vendor lock-in)
- Some MongoDB features not supported

**Setup:**

1. Create DocumentDB Cluster:
```bash
# Create subnet group
aws docdb create-db-subnet-group \
  --db-subnet-group-name casino-docdb-subnet \
  --db-subnet-group-description "DocumentDB subnet group" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create cluster
aws docdb create-db-cluster \
  --db-cluster-identifier casino-docdb-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password SecurePassword123! \
  --db-cluster-parameter-group-name default.docdb5.0 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name casino-docdb-subnet

# Create instance
aws docdb create-db-instance \
  --db-instance-identifier casino-docdb-instance \
  --db-instance-class db.t3.medium \
  --engine docdb \
  --db-cluster-identifier casino-docdb-cluster
```

2. Get endpoint:
```bash
ENDPOINT=$(aws docdb describe-db-clusters --db-cluster-identifier casino-docdb-cluster --query 'DBClusters[0].Endpoint' --output text)
echo $ENDPOINT
```

3. Store credentials:
```bash
aws ssm put-parameter --name "/casino/mongodb/server" --value "$ENDPOINT:27017" --type "String"
aws ssm put-parameter --name "/casino/mongodb/user" --value "admin" --type "String"
aws ssm put-parameter --name "/casino/mongodb/password" --value "SecurePassword123!" --type "SecureString"
```

4. **UPDATE CONNECTION STRING**:
```typescript
// server/src/app.module.ts
// DocumentDB requires different connection string
uri: `mongodb://${configService.get<string>('MONGO_DB_USER')}:${configService.get<string>('MONGO_DB_PASSWORD')}@${configService.get<string>('MONGO_DB_SERVER')}/${configService.get<string>('MONGO_DB_NAME')}?tls=true&tlsCAFile=global-bundle.pem&retryWrites=false`
```

**Cost:** ~$200-500/month (expensive!)

---

## ✅ Recommended: MongoDB Atlas

For your use case, **MongoDB Atlas is the best choice**:

| Factor | MongoDB Atlas | Self-Hosted EC2 | DocumentDB |
|--------|---------------|-----------------|------------|
| **Setup Time** | 5 minutes | 1-2 hours | 30 minutes |
| **Management** | Zero | High | Low |
| **Cost** | $0-57/mo | $30-50/mo | $200-500/mo |
| **Backups** | Automatic | Manual | Automatic |
| **Security** | Built-in | Manual | Built-in |
| **Scalability** | Easy | Complex | Easy |
| **Cloud Lock-in** | None | AWS | AWS |

## 🚀 Quick Start with MongoDB Atlas

```bash
# 1. Sign up for MongoDB Atlas (free)
# Visit: https://www.mongodb.com/cloud/atlas/register

# 2. Create cluster on AWS region (free tier M0)

# 3. Configure network access
# Add: 0.0.0.0/0 (for testing, lock down later)

# 4. Create database user
# Username: casino_admin
# Password: Generate secure password

# 5. Store credentials in AWS
aws ssm put-parameter --name "/casino/mongodb/server" --value "cluster0.xxxxx.mongodb.net" --type "String"
aws ssm put-parameter --name "/casino/mongodb/user" --value "casino_admin" --type "String"
aws ssm put-parameter --name "/casino/mongodb/password" --value "YOUR_PASSWORD" --type "SecureString"
aws ssm put-parameter --name "/casino/mongodb/name" --value "casino_offers" --type "String"

# 6. Deploy your app
./deploy-aws.sh
```

## 🔗 Google Sheets (Unchanged)

Your Google Sheets integration works **exactly the same**:

```bash
# Store Google Sheets credentials
aws ssm put-parameter --name "/casino/google/service-account-email" --value "your-sa@project.iam.gserviceaccount.com" --type "String"
aws ssm put-parameter --name "/casino/google/private-key" --value "$(cat credentials.json | jq -r '.private_key')" --type "SecureString"
aws ssm put-parameter --name "/casino/google/spreadsheet-id" --value "your-spreadsheet-id" --type "String"
aws ssm put-parameter --name "/casino/google/sheet-name" --value "Newsletter" --type "String"

# Enable sync
aws ssm put-parameter --name "/casino/google/sync-enabled" --value "true" --type "String"
```

**No changes needed** - works from any cloud!

## 📝 Complete Task Definition

Your backend task definition with MongoDB Atlas:

```json
{
  "family": "casino-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/CasinoTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/CasinoTaskRole",
  "containerDefinitions": [
    {
      "name": "casino-backend",
      "image": "ACCOUNT.dkr.ecr.REGION.amazonaws.com/casino-backend:latest",
      "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3000"}
      ],
      "secrets": [
        {"name": "MONGO_DB_USER", "valueFrom": "/casino/mongodb/user"},
        {"name": "MONGO_DB_PASSWORD", "valueFrom": "/casino/mongodb/password"},
        {"name": "MONGO_DB_SERVER", "valueFrom": "/casino/mongodb/server"},
        {"name": "MONGO_DB_NAME", "valueFrom": "/casino/mongodb/name"},
        {"name": "JWT_SECRET", "valueFrom": "/casino/jwt/secret"},
        {"name": "GOOGLE_SERVICE_ACCOUNT_EMAIL", "valueFrom": "/casino/google/service-account-email"},
        {"name": "GOOGLE_PRIVATE_KEY", "valueFrom": "/casino/google/private-key"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/casino-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## ✅ Summary

**Your Stack:**
- 🗄️ MongoDB (Mongoose) → Use **MongoDB Atlas** on AWS region
- 📊 Google Sheets API → **Keep as-is** (works anywhere)
- ☁️ Compute → **AWS ECS Fargate**

**Recommendation:** MongoDB Atlas (M0 Free tier) - 5 minutes to set up, zero maintenance, works perfectly with AWS.


