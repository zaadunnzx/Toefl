#!/bin/bash

echo "======================================="
echo "   WhatsApp Numbers - Vercel Deploy"
echo "======================================="
echo

echo "[1/6] Installing Vercel CLI..."
npm install -g vercel

echo
echo "[2/6] Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo
echo "[3/6] Installing API dependencies..."
npm install @supabase/supabase-js

echo
echo "[4/6] Building frontend..."
cd frontend
npm run build
cd ..

echo
echo "[5/6] Deploying to Vercel..."
vercel --prod

echo
echo "[6/6] Deployment completed!"
echo
echo "======================================="
echo " 🎉 Your app is now live on Vercel!"
echo "======================================="
echo
echo "Next steps:"
echo "1. Set environment variables in Vercel Dashboard"
echo "2. Test your API endpoints"
echo "3. Setup custom domain (optional)"
echo
