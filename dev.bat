@echo off
REM Casino Offers - Parallel Development Script (Windows)
REM This script runs both frontend and backend simultaneously

echo 🚀 Starting Casino Offers Development Environment...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

if not exist "server" (
    echo ❌ Error: server directory not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

if not exist "server\node_modules" (
    echo 📦 Installing backend dependencies...
    cd server
    npm install
    cd ..
)

echo 🎯 Starting Frontend (Next.js) on http://localhost:3000...
start "Frontend" cmd /k "npm run dev"

echo 🎯 Starting Backend (NestJS) on http://localhost:3001...
start "Backend" cmd /k "cd server && npm run start:dev"

echo.
echo ✅ Both servers are starting up!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001
echo.
echo Press any key to close this window (servers will continue running)
pause > nul
