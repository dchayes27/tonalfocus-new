#!/bin/bash

# Remove the current .git directory
rm -rf .git

# Initialize a new git repository
git init

# Add all files
git add .

# Commit the changes
git commit -m "Clean start: TonalFocus with proper Next.js image optimization"

# Add the remote repository (assuming it exists)
git remote add origin https://github.com/dchayes27/tonalfocus-new.git

# Push the changes to GitHub, forcing a clean start
git push -f origin main

echo "Repository reset and pushed to GitHub!"
