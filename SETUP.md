# Setup Guide - How to Run the Project

## ✅ Everything is Working!

The project structure has been cleaned up. Here's how to run it:

## 🚀 Quick Start - Run Both Together

**Option 1: Using npm script (Recommended)**
```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend together
npm run dev:all
```

**Option 2: Using scripts**
```bash
# Linux/Mac
./dev.sh

# Windows
dev.bat
```

## Frontend Only (Next.js)

**From the root directory** (CASINOS-OFFERS):

```bash
# Install dependencies (if not already installed)
npm install

# Run development server
npm run dev

# The app will be available at:
# http://localhost:3000
```

## Backend Only (NestJS)

**From the root directory**, navigate to the server folder:

```bash
# Install dependencies (if not already installed)
cd server
npm install

# Run development server
npm run start:dev

# The API will be available at:
# http://localhost:3000 (or the port configured in your server)
```

## Running Both Manually

You need two terminal windows:

**Terminal 1 - Frontend:**
```bash
# From CASINOS-OFFERS directory
npm run dev
```

**Terminal 2 - Backend:**
```bash
# From CASINOS-OFFERS/server directory
cd server
npm run start:dev
```

## Available Scripts

### Root Directory:
- `npm run dev` - Start frontend only
- `npm run dev:all` - Start both frontend and backend together
- `npm run dev:backend` - Start backend only
- `npm run install:all` - Install dependencies for both projects
- `npm run build:all` - Build both projects
- `npm run build` - Build frontend
- `npm run start` - Start production frontend
- `npm run lint` - Run linter

### Backend (server/):
- `npm run start:dev` - Start development server with watch
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run linter
- `npm run test` - Run tests

## What Changed?

✅ Frontend files moved from `casino-demo/` to root  
✅ Backend files moved from `casino-demo-be/` to `server/`  
✅ All imports and configurations remain intact  
✅ GitHub Actions workflows configured  
✅ Everything pushed to GitHub  
✅ Added parallel development scripts

## Troubleshooting

If you encounter any issues:

1. **Node modules**: Run `npm run install:all` to install dependencies for both projects
2. **Port conflicts**: Adjust ports in `.env` files if needed
3. **Git**: Everything is already committed and pushed to GitHub
4. **Scripts**: Make sure scripts are executable (`chmod +x dev.sh` on Linux/Mac)

Everything should work exactly as before! 🚀

