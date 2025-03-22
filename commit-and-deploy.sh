#!/bin/bash

# Add all files
git add .

# Commit the changes
git commit -m "Enhanced featured work section with larger images and better typography"

# Push the changes to GitHub
git push origin main

# Deploy to Vercel
echo 'Deploying to Vercel...'
if ! [ -x "$(command -v vercel)" ]; then
  echo 'Installing Vercel CLI...'
  npm install -g vercel
fi
vercel --prod

echo "Changes pushed to GitHub and deployed to Vercel!"
