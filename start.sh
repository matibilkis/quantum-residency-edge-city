#!/bin/bash

# Quredge Landing Page - Quick Start Script

echo "🚀 Starting Quredge Landing Page..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "✨ Starting server on http://localhost:3000"
echo ""
echo "📋 Access points:"
echo "   • Landing Page: http://localhost:3000"
echo "   • Admin Dashboard: http://localhost:3000/admin.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

