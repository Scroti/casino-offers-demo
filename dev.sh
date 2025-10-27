#!/bin/bash

# Casino Offers - Parallel Development Script
# This script runs both frontend and backend simultaneously

echo "🚀 Starting Casino Offers Development Environment..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

if [ ! -d "server" ]; then
    echo "❌ Error: server directory not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && npm install && cd ..
fi

echo "🎯 Starting Frontend (Next.js) on http://localhost:3000..."
npm run dev &
FRONTEND_PID=$!

echo "🎯 Starting Backend (NestJS) on http://localhost:3001..."
cd server && npm run start:dev &
BACKEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
