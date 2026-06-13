# 🔄 AWS Deployment with GCP Services

Guide for deploying on AWS while keeping GCP services (MongoDB Atlas, Firestore, Google Sheets) or migrating to AWS alternatives.

## 📊 Service Comparison & Migration

### ✅ Services You Can Keep from GCP

#### 1. **MongoDB** ✅ **RECOMMENDED TO KEEP**

**Your Current Setup:** You're using MongoDB via Mongoose (self-hosted or GCP-managed)

**Option A: MongoDB Atlas** ⭐ **RECOMMENDED**

**Why Keep It:**
- Works perfectly with AWS
- Fully managed and database-agnostic
- Excellent global performance
- Free tier available (512MB)

**Configuration:**
```bash
# Your existing MongoDB connection string works as-is
MONGO_DB_SERVER=your-cluster.mongodb.net
MONGO_DB_USER=your-atlas-user
MONGO_DB_PASSWORD=your-atlas-password
MONGO_DB_NAME=casino_offers
```

**Security:**
1. Add AWS ECS Fargate IPs to Atlas Network Access
2. Or use **AWS PrivateLink** for private connection (advanced)
3. Enable SSL/TLS (already in your connection string)

**Cost:** 
- Free tier: $0/month (512MB)
- M10: ~$57/month (10GB)
- M30: ~$270/month (80GB)

**Recommendation:** ✅ **Keep MongoDB Atlas** - No need to migrate

---

#### 2. **Google Sheets Integration** ✅ **CAN KEEP**

**Why Keep It:**
- Works across any cloud provider
- Uses Google's API (not GCP-specific)
- Perfect for admin dashboards

**Configuration:**
```bash
# Keep these environment variables
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-base64-private-key
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME=Sheet1
GOOGLE_SHEETS_SYNC_ENABLED=true
```

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create Service Account
3. Download JSON key
4. Share Google Sheet with service account email
5. Add credentials to AWS Parameter Store

**Recommendation:** ✅ **Keep Google Sheets** - Works great with AWS

---

### 🔄 Services That Need Migration

#### 3. **Firestore → AWS Alternatives**

Firestore is GCP-specific, but AWS has excellent alternatives:

##### Option A: **DynamoDB** (Most Similar)

**Perfect For:**
- User sessions
- Real-time data
- NoSQL documents
- High-scale apps

**Advantages:**
- Native AWS integration
- Auto-scaling
- On-demand pricing
- Serverless

**Migration Steps:**

1. **Install AWS SDK**
```bash
cd server
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

2. **Create DynamoDB Tables**

```bash
# User sessions table
aws dynamodb create-table \
  --table-name user-sessions \
  --attribute-definitions \
    AttributeName=sessionId,AttributeType=S \
  --key-schema \
    AttributeName=sessionId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Activity logs table
aws dynamodb create-table \
  --table-name activity-logs \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=id,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

3. **Update NestJS Code**

Create `server/src/shared/commons/src/services/dynamodb.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
  private client: DynamoDBDocumentClient;

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async put(tableName: string, item: any) {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });
    return this.client.send(command);
  }

  async get(tableName: string, key: any) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
    const result = await this.client.send(command);
    return result.Item;
  }

  async query(tableName: string, keyConditionExpression: string, expressionAttributeValues: any) {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const result = await this.client.send(command);
    return result.Items;
  }
}
```

4. **Add IAM Permissions**

Update task role to access DynamoDB:

```bash
# Attach DynamoDB policy
aws iam attach-role-policy \
  --role-name CasinoTaskRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
```

**Cost Comparison:**
- Firestore: ~$0.18/GB stored, $0.36/100k reads
- DynamoDB: ~$1.25/million writes, $0.25/million reads
- **DynamoDB is cheaper at scale**

---

##### Option B: **DocumentDB** (MongoDB-Compatible)

**If you prefer MongoDB syntax**, use AWS DocumentDB:

```bash
# Create DocumentDB cluster
aws docdb create-db-cluster \
  --db-cluster-identifier casino-docdb \
  --engine docdb \
  --master-username admin \
  --master-user-password SecurePassword123! \
  --db-cluster-parameter-group-name default.docdb5.0
```

**Connection:**
```bash
MONGO_DB_SERVER=casino-docdb.cluster-xxxxx.us-east-1.docdb.amazonaws.com
MONGO_DB_USER=admin
MONGO_DB_PASSWORD=SecurePassword123!
```

**Cost:** ~$200-500/month (expensive, but fully managed)

---

##### Option C: **PostgreSQL with JSONB** (Relational + Document)

**Best for:** Mixed data types, complex queries

```bash
# Create RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier casino-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password SecurePassword123! \
  --allocated-storage 20
```

**Use JSONB columns** for flexible schema:
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID,
  data JSONB,
  created_at TIMESTAMP
);
```

**Cost:** ~$15-50/month

---

#### 4. **Cloud Storage → S3**

**GCP Cloud Storage** → **AWS S3**

Already covered in your deployment! Your images/files can be stored in S3.

---

#### 5. **Cloud Functions → Lambda**

If you have Google Cloud Functions, migrate to AWS Lambda:

```python
# Example: AWS Lambda function
import json
import boto3

def lambda_handler(event, context):
    # Your function logic
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
```

---

## 🏗️ Recommended Architecture

### **Hybrid Approach** (Best Value)

```
┌─────────────────────────────────────────────────────┐
│                   AWS Cloud                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │         ECS Fargate Services                │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  │  │
│  │  │   Frontend      │  │   Backend       │  │  │
│  │  └────────┬────────┘  └────────┬────────┘  │  │
│  └───────────┼────────────────────┼────────────┘  │
│              │                    │                │
│       ┌──────▼────────────────────▼──────┐        │
│       │     AWS S3 (File Storage)        │        │
│       └──────────────────────────────────┘        │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │      DynamoDB (Real-time Data)              │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              Google Cloud Platform                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │       MongoDB Atlas                         │  │
│  │  (Primary Database - Works from anywhere)   │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │       Google Sheets API                     │  │
│  │  (Admin Dashboard Integration)              │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Services:**
- ✅ **MongoDB Atlas** - Keep (Primary DB)
- ✅ **Google Sheets** - Keep (Admin sync)
- ✅ **DynamoDB** - Use for sessions/logs
- ✅ **S3** - Use for file storage

**Why This Works:**
- MongoDB Atlas is cloud-agnostic (works with any cloud)
- Google Sheets API is not tied to GCP infrastructure
- You get AWS native services for compute
- Lower costs (no vendor lock-in for DB)

---

## 🔐 Security Configuration

### 1. MongoDB Atlas Network Access

Allow AWS ECS Fargate IPs:

1. Go to **MongoDB Atlas Dashboard**
2. **Network Access** → **Add IP Address**
3. Add ECS Subnet CIDRs or use **0.0.0.0/0** (temporary for testing)
4. For production, use **AWS PrivateLink**

### 2. Google Sheets Service Account

```bash
# Store in AWS Parameter Store
aws ssm put-parameter \
  --name "/casino/google/service-account-email" \
  --value "your-service-account@project.iam.gserviceaccount.com" \
  --type "String"

aws ssm put-parameter \
  --name "/casino/google/private-key" \
  --value "$(cat google-credentials.json | jq -r '.private_key')" \
  --type "SecureString"
```

### 3. AWS IAM Roles

```bash
# Add to task definition secrets
"secrets": [
  {
    "name": "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "valueFrom": "/casino/google/service-account-email"
  },
  {
    "name": "GOOGLE_PRIVATE_KEY",
    "valueFrom": "/casino/google/private-key"
  }
]
```

---

## 📝 Environment Variables Summary

### Backend Task Definition (Complete)

```json
{
  "environment": [
    {"name": "NODE_ENV", "value": "production"},
    {"name": "PORT", "value": "3000"},
    {"name": "AWS_REGION", "value": "us-east-1"}
  ],
  "secrets": [
    // MongoDB Atlas (KEEP FROM GCP)
    {"name": "MONGO_DB_USER", "valueFrom": "/casino/mongodb/user"},
    {"name": "MONGO_DB_PASSWORD", "valueFrom": "/casino/mongodb/password"},
    {"name": "MONGO_DB_SERVER", "valueFrom": "/casino/mongodb/server"},
    {"name": "MONGO_DB_NAME", "valueFrom": "/casino/mongodb/name"},
    
    // JWT
    {"name": "JWT_SECRET", "valueFrom": "/casino/jwt/secret"},
    {"name": "JWT_REFRESH_SECRET", "valueFrom": "/casino/jwt/refresh-secret"},
    
    // Google Sheets (KEEP FROM GCP)
    {"name": "GOOGLE_SERVICE_ACCOUNT_EMAIL", "valueFrom": "/casino/google/service-account-email"},
    {"name": "GOOGLE_PRIVATE_KEY", "valueFrom": "/casino/google/private-key"},
    {"name": "GOOGLE_SHEETS_SPREADSHEET_ID", "valueFrom": "/casino/google/spreadsheet-id"},
    {"name": "GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME", "valueFrom": "/casino/google/sheet-name"},
    {"name": "GOOGLE_SHEETS_SYNC_ENABLED", "value": "true"}
  ]
}
```

---

## 💰 Cost Comparison

### **Hybrid Approach**

| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Compute (ECS Fargate) | AWS | $50-100 |
| MongoDB Atlas | GCP/AWS | $0-57 (free tier) |
| Google Sheets API | GCP | FREE |
| DynamoDB | AWS | $5-20 |
| S3 Storage | AWS | $1-5 |
| Load Balancer | AWS | $20 |
| **Total** | **Hybrid** | **$76-202** |

### **Full AWS Migration**

| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Compute (ECS Fargate) | AWS | $50-100 |
| DocumentDB | AWS | $200-500 |
| DynamoDB | AWS | $5-20 |
| S3 Storage | AWS | $1-5 |
| Load Balancer | AWS | $20 |
| **Total** | **AWS** | **$276-625** |

**💡 Recommendation:** Use **Hybrid Approach** - Save $200-400/month

---

## 🎯 Migration Checklist

### ✅ Phase 1: Deploy on AWS (Keep GCP Services)

- [ ] Set up AWS ECS infrastructure
- [ ] Push Docker images to ECR
- [ ] Configure MongoDB Atlas network access
- [ ] Add Google Sheets credentials to Parameter Store
- [ ] Deploy backend service
- [ ] Deploy frontend service
- [ ] Test MongoDB connection
- [ ] Test Google Sheets sync

### ✅ Phase 2: Add AWS Services (Optional)

- [ ] Create DynamoDB tables
- [ ] Update code to use DynamoDB for sessions
- [ ] Configure S3 for file uploads
- [ ] Add CloudWatch alerts
- [ ] Set up auto-scaling

### ✅ Phase 3: Full Migration (Optional, Not Recommended)

- [ ] Migrate from MongoDB Atlas to DocumentDB
- [ ] Migrate from Google Sheets to DynamoDB
- [ ] Update all code references
- [ ] Run data migration scripts
- [ ] Decommission GCP resources

---

## 🚀 Quick Start Commands

### Keep Existing Services

```bash
# 1. Store MongoDB Atlas credentials (already using in GCP)
aws ssm put-parameter --name "/casino/mongodb/server" --value "your-cluster.mongodb.net" --type "String"
aws ssm put-parameter --name "/casino/mongodb/user" --value "your-user" --type "String"
aws ssm put-parameter --name "/casino/mongodb/password" --value "your-password" --type "SecureString"

# 2. Store Google Sheets credentials
aws ssm put-parameter --name "/casino/google/service-account-email" --value "your-sa@project.iam.gserviceaccount.com" --type "String"
aws ssm put-parameter --name "/casino/google/private-key" --value "$(cat credentials.json | jq -r '.private_key')" --type "SecureString"
aws ssm put-parameter --name "/casino/google/spreadsheet-id" --value "your-spreadsheet-id" --type "String"

# 3. Update MongoDB Atlas Network Access
# Go to: https://cloud.mongodb.com
# Add your AWS VPC CIDR blocks: 10.0.0.0/16

# 4. Deploy as usual
bash deploy-aws.sh
```

---

## 📚 Resources

- [MongoDB Atlas + AWS Integration](https://www.mongodb.com/docs/atlas/security/integration-aws/)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [AWS DynamoDB Guide](https://docs.aws.amazon.com/dynamodb/)
- [AWS Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)

---

## 🤔 Decision Matrix

### Should I Migrate or Keep?

| Service | Keep from GCP? | Migrate to AWS? | Recommendation |
|---------|---------------|-----------------|----------------|
| **MongoDB Atlas** | ✅ Yes | ❌ No | Keep - Cloud agnostic, works perfectly |
| **Google Sheets** | ✅ Yes | ❌ No | Keep - API works anywhere |
| **Firestore** | ❌ No | ✅ Yes | Migrate to DynamoDB |
| **Cloud Storage** | ❌ No | ✅ Yes | Migrate to S3 |
| **Cloud Functions** | ❌ No | ✅ Yes | Migrate to Lambda |

### Summary

**🏆 BEST APPROACH: Hybrid Cloud**
- Deploy compute on AWS (ECS Fargate)
- Keep MongoDB Atlas (database-agnostic)
- Keep Google Sheets API (works anywhere)
- Use AWS DynamoDB for real-time data
- Use AWS S3 for file storage

**Result:** Best performance + lower costs + no vendor lock-in

---

## ✨ Conclusion

**YES, you can absolutely use MongoDB Atlas and Google Sheets with AWS!**

They are NOT tied to GCP infrastructure:
- ✅ MongoDB Atlas is cloud-agnostic
- ✅ Google Sheets API works from anywhere
- ✅ Both are API-based services

Only migrate Firestore/Cloud Storage if you want full AWS native services.

**My recommendation:** Start with hybrid approach, migrate gradually if needed.


