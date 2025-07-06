#!/bin/bash

# make-commit-script-executable.sh
# --------------------------------
# This script makes the 'commit-and-deploy.sh' script executable.
# This is a one-time setup step often needed on Unix-like systems
# to allow a shell script to be run directly.

# Exit immediately if a command exits with a non-zero status.
set -e

TARGET_SCRIPT="commit-and-deploy.sh"

# Check if the target script exists
if [ ! -f "$TARGET_SCRIPT" ]; then
  echo "Error: Target script '$TARGET_SCRIPT' not found in the current directory."
  exit 1
fi

echo "Making '$TARGET_SCRIPT' executable..."
chmod +x "$TARGET_SCRIPT"

echo "✅ '$TARGET_SCRIPT' is now executable."
echo "You can run it using: ./$TARGET_SCRIPT"
