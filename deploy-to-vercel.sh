#!/bin/bash

# deploy-to-vercel.sh
# -------------------
# This script handles the deployment of the current project to Vercel's
# production environment. It first checks if the Vercel CLI is installed
# and installs it globally via npm if it's missing.

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if Vercel CLI is installed.
if ! [ -x "$(command -v vercel)" ]; then
  echo "Vercel CLI not found. Installing it globally via npm..."
  # Install Vercel CLI globally. Requires npm and appropriate permissions.
  npm install -g vercel
else
  echo "Vercel CLI is already installed."
fi

# Deploy to Vercel's production environment.
echo "Deploying to Vercel (production)..."
# The '--prod' flag ensures this deployment is aliased to the production domain.
vercel --prod

echo "✅ Vercel deployment process initiated!"
echo "Monitor the deployment status in your Vercel dashboard."
