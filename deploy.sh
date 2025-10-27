#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment process...${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${RED}❌ Not logged in to gcloud. Please run: gcloud auth login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ gcloud is installed and authenticated${NC}\n"

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No project ID set. Please run: gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Project ID: $PROJECT_ID${NC}\n"

# Set region
REGION="${REGION:-us-central1}"
echo -e "${BLUE}📍 Region: $REGION${NC}\n"

# Ask for confirmation
read -p "Do you want to proceed with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
fi

# Deploy Backend
echo -e "${BLUE}🔧 Deploying Backend...${NC}"
cd ../casino-demo-be

gcloud run deploy casino-demo-be \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3003 \
  --set-env-vars="NODE_ENV=production"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend deployment failed${NC}"
    exit 1
fi

# Get Backend URL
echo -e "${BLUE}📡 Getting Backend URL...${NC}"
BACKEND_URL=$(gcloud run services describe casino-demo-be --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✅ Backend URL: $BACKEND_URL${NC}\n"

# Deploy Frontend
echo -e "${BLUE}🎨 Deploying Frontend...${NC}"
cd ../casino-demo

gcloud run deploy casino-demo-fe \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend deployment failed${NC}"
    exit 1
fi

# Get Frontend URL
echo -e "${BLUE}📡 Getting Frontend URL...${NC}"
FRONTEND_URL=$(gcloud run services describe casino-demo-fe --region $REGION --format 'value(status.url)')
echo -e "${GREEN}✅ Frontend URL: $FRONTEND_URL${NC}\n"

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Frontend: $FRONTEND_URL${NC}"
echo -e "${BLUE}Backend: $BACKEND_URL${NC}"
echo -e "${BLUE}========================================${NC}\n"

