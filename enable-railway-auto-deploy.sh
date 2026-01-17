#!/bin/bash

# Enable Railway Auto-Deploy via CLI
# Run this in a real terminal (not Cursor)

echo "🚂 Checking Railway service configuration..."

# Check current service settings
railway service

echo ""
echo "To enable auto-deploy, you need to ensure:"
echo "1. Service is linked to GitHub repo"
echo "2. Branch is set to 'main'"
echo "3. Auto-deploy is enabled"
echo ""
echo "If auto-deploy isn't working, try:"
echo "  1. Disconnect and reconnect GitHub in Railway dashboard"
echo "  2. Check GitHub webhooks are active"
echo "  3. Verify Railway has proper GitHub permissions"
echo ""

# Show current variables to verify setup
echo "Current environment:"
railway variables

echo ""
echo "✅ If you see all your environment variables above, Railway is properly configured."
echo "📌 The issue is likely the auto-deploy setting in Railway dashboard."
echo ""

