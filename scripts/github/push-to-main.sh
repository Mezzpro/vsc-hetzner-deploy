#!/bin/bash

# Push to Main Branch Script
# Commits all changes and pushes to main branch

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Get commit message from user or use default
COMMIT_MESSAGE="${1:-"Update: $(date '+%Y-%m-%d %H:%M:%S')"}"

echo "📦 Preparing to push to main branch..."
echo "💬 Commit message: $COMMIT_MESSAGE"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository!"
    echo "💡 Run './scripts/github/create-repository.sh' first"
    exit 1
fi

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo "⚠️  No changes to commit"
    exit 0
fi

echo "📋 Current status:"
git status --short

# Add all changes
echo "➕ Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

# Push to main branch
echo "🚀 Pushing to main branch..."
git push origin main

echo "✅ Successfully pushed to main!"
echo "🔗 Check your repository: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME"