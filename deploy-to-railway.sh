#!/bin/bash

# Deploy to Railway - Run this in a REAL terminal (not Cursor)

echo "🚀 Deploying to Railway..."
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI not found!"
    echo "Install it first: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null
then
    echo "❌ Not logged in to Railway!"
    echo "Run: railway login"
    exit 1
fi

echo "📦 Uploading code to Railway..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Check status with: railway status"
echo "📝 View logs with: railway logs"
echo ""
echo "🌐 Your site: https://quredge-webpage-production.up.railway.app"
echo ""

