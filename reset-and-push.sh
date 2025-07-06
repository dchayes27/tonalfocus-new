#!/bin/bash

# reset-and-push.sh
# -----------------
# WARNING: This is a potentially destructive script.
# It completely removes the existing Git history (.git directory),
# reinitializes the repository, commits all current files as a new
# initial commit, and force pushes to the 'main' branch of the
# specified remote repository.
#
# USE WITH EXTREME CAUTION. This is typically used for starting a project
# over with a clean Git history while preserving the current file state.
#
# Ensure the remote repository URL is correct before running.

# Exit immediately if a command exits with a non-zero status.
set -e

# Configuration
REMOTE_URL="https://github.com/dchayes27/tonalfocus-new.git"
COMMIT_MESSAGE="Clean start: TonalFocus with proper Next.js image optimization" # Or a more generic initial commit message

# Confirmation prompt
read -p "WARNING: This will delete the existing .git history and force push. Are you sure? (yes/no): " confirmation
if [ "$confirmation" != "yes" ]; then
  echo "Operation cancelled by user."
  exit 0
fi

echo "Removing current .git directory..."
rm -rf .git

echo "Initializing a new Git repository..."
git init

echo "Adding all files to the new repository..."
git add .

echo "Committing changes with message: \"$COMMIT_MESSAGE\""
git commit -m "$COMMIT_MESSAGE"

echo "Adding remote repository: $REMOTE_URL"
# Check if remote 'origin' already exists, remove it if it does (though unlikely after rm -rf .git)
if git remote | grep -q "origin"; then
  git remote rm origin
fi
git remote add origin "$REMOTE_URL"

echo "Force pushing changes to GitHub (main branch)..."
# The '-f' or '--force' flag overwrites the remote history.
git push -f origin main

echo "✅ Repository reset and force pushed to GitHub!"
echo "Local repository is now based on a new commit history."
