#!/bin/bash
# BestReads Frontend Startup Script for macOS/Linux

echo "========================================"
echo "   BestReads Frontend Server"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "[1/3] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18 or higher"
    echo "Download from: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found"

# Check if node_modules exists, if not, install dependencies
echo "[2/3] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies... This may take a few minutes."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
else
    echo "✓ Dependencies already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "WARNING: .env.local file not found"
    echo "Creating .env.local from example..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo "✓ Created .env.local"
    else
        echo "Please create .env.local with:"
        echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api"
    fi
    echo ""
fi

# Start the frontend development server
echo "[3/3] Starting Frontend Development Server..."
echo ""
echo "Frontend will start on: http://localhost:3000"
echo ""
echo "Make sure the Backend is running on: http://localhost:8080/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm run dev
