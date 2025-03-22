#!/bin/bash

echo "Syncing all changes to GitHub..."

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Enhanced featured work section with larger images and improved typography"

# Force push to ensure GitHub is completely in sync with local
git push -f origin main

echo "✅ GitHub repository has been updated with all local changes!"
echo "Now you can deploy to Vercel with: ./deploy-to-vercel.sh"
