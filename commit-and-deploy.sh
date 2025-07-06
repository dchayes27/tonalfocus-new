#!/bin/bash

# commit-and-deploy.sh
# --------------------
# This script automates the process of committing all current changes to Git,
# pushing them to the 'main' branch on GitHub, and then deploying the
# application to Vercel for production.
#
# Note: This script uses a hardcoded commit message. For more flexible use,
# consider parameterizing the commit message or prompting the user for one.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Adding all files to Git..."
git add .

# Commit the changes
# IMPORTANT: The commit message is currently hardcoded.
# You might want to change this for different commits.
COMMIT_MESSAGE="Enhanced featured work section with larger images and better typography"
echo "Committing changes with message: \"$COMMIT_MESSAGE\""
git commit -m "$COMMIT_MESSAGE"

echo "Pushing changes to GitHub (main branch)..."
git push origin main

# Deploy to Vercel
echo "Starting Vercel deployment process..."
# Check if Vercel CLI is installed, and install it globally if not.
if ! [ -x "$(command -v vercel)" ]; then
  echo "Vercel CLI not found. Installing it globally via npm..."
  npm install -g vercel
fi

echo "Deploying to Vercel production environment..."
vercel --prod # The '--prod' flag creates a production deployment.

echo "✅ Changes pushed to GitHub and deployed to Vercel!"
