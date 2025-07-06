#!/bin/bash

# sync-github.sh
# --------------
# This script stages all current changes, commits them with a (currently hardcoded)
# message, and then force pushes the 'main' branch to the GitHub remote 'origin'.
#
# WARNING: This script uses 'git push -f' (force push).
# Force pushing overwrites the remote history and should be used with caution,
# especially in collaborative environments. It's used here to ensure the remote
# strictly mirrors the local 'main' branch after this operation.
#
# Note: The commit message is hardcoded. For more general use, consider
# parameterizing it or prompting the user.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Syncing all local changes to GitHub (origin/main)..."

echo "Staging all changes..."
git add .

# Commit with a descriptive message.
# IMPORTANT: This commit message is hardcoded. You may want to change this.
COMMIT_MESSAGE="Enhanced featured work section with larger images and improved typography"
echo "Committing changes with message: \"$COMMIT_MESSAGE\""
git commit -m "$COMMIT_MESSAGE"

echo "Force pushing to origin main..."
# The '-f' or '--force' flag overwrites the remote history of the main branch.
# This ensures that the remote 'main' branch exactly matches the local 'main' branch.
git push -f origin main

echo "✅ GitHub repository (origin/main) has been updated with all local changes!"
echo "If needed, you can now deploy to Vercel, for example using: ./deploy-to-vercel.sh"
