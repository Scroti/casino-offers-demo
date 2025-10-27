# Casino Offers - Full Stack Application

This repository contains the full-stack casino offers application with frontend and backend services.

## Project Structure

- **Root** - Next.js frontend application
- **server/** - NestJS backend API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Quick Start

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend together
npm run dev:all
```

### Individual Services

**Frontend:**
```bash
npm install
npm run dev
# Available at http://localhost:3000
```

**Backend:**
```bash
cd server
npm install
npm run start:dev
# Available at http://localhost:3000
```

## 🚀 Deployment

### GCP Cloud Run (Recommended)

**Quick Deploy:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Manual Deploy:**
```bash
# Backend
cd server
gcloud run deploy casino-offers-backend --source . --region us-central1

# Frontend
BACKEND_URL=$(gcloud run services describe casino-offers-backend --region us-central1 --format 'value(status.url)')
gcloud run deploy casino-offers-frontend --source . --region us-central1 --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api/v1"
```

### GitHub Actions

Automatic deployment on push to `main` branch. See [`.github/GCP_SETUP.md`](.github/GCP_SETUP.md) for setup.

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Deployment Guide](DEPLOYMENT.md) - GCP deployment instructions
- [Environment Variables](.env.example) - Environment configuration

## Available Scripts

### Root Directory:
- `npm run dev` - Start frontend only
- `npm run dev:all` - Start both frontend and backend together
- `npm run dev:backend` - Start backend only
- `npm run install:all` - Install dependencies for both projects
- `npm run build:all` - Build both projects

### Backend (server/):
- `npm run start:dev` - Start development server with watch
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests

## License

Private - UNLICENSED