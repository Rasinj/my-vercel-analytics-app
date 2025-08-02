#!/bin/bash

echo "Vercel Deployment Script"
echo "========================"
echo ""
echo "Prerequisites:"
echo "1. Make sure you're logged in to Vercel CLI"
echo "   If not, run: vercel login"
echo ""
echo "2. Your GitHub repo is at:"
echo "   https://github.com/Rasinj/my-vercel-analytics-app"
echo ""
echo "Press Enter to continue with deployment..."
read

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "Deployment complete!"
echo "Your app should now be live on Vercel."