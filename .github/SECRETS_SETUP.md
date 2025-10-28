# GitHub Actions Environment Variables Configuration
# Add these secrets to your GitHub repository settings

# ===========================================
# REQUIRED GCP SECRETS
# ===========================================

# GCP Service Account Key (Base64 encoded)
# Generate this by:
# 1. Create a service account in GCP Console
# 2. Download the JSON key file
# 3. Base64 encode it: base64 -i service-account-key.json
GCP_SA_KEY=your-base64-encoded-service-account-key

# GCP Project ID
GCP_PROJECT_ID=your-gcp-project-id

# GCP Region (optional, defaults to us-central1)
GCP_REGION=us-central1

# ===========================================
# REQUIRED APPLICATION SECRETS
# ===========================================

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-32-characters-minimum
JWT_EXPIRES=15m

# MongoDB Configuration
MONGO_DB_USER=your-mongodb-username
MONGO_DB_PASSWORD=your-mongodb-password
MONGO_DB_SERVER=your-mongodb-server.mongodb.net
MONGO_DB_NAME=casino-offers

# Alternative MongoDB URI (if using connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/casino-offers

# ===========================================
# OPTIONAL SECRETS
# ===========================================

# Google Sheets Integration (for newsletter)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SHEETS_SPREADSHEET_SHEET_NAME=Newsletter Subscribers

# ===========================================
# SETUP INSTRUCTIONS
# ===========================================

# 1. Go to your GitHub repository
# 2. Click on Settings > Secrets and variables > Actions
# 3. Click "New repository secret"
# 4. Add each secret with the exact name and value

# ===========================================
# GCP SERVICE ACCOUNT PERMISSIONS
# ===========================================

# Your service account needs these roles:
# - Cloud Run Admin
# - Service Account User
# - Storage Admin (for container registry)
# - Cloud Build Editor (for building images)

# ===========================================
# TESTING YOUR SETUP
# ===========================================

# After adding all secrets, you can test by:
# 1. Going to Actions tab in your repository
# 2. Running the "Deploy to GCP Cloud Run" workflow manually
# 3. Check the logs for any missing secrets or permissions
