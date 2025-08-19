#!/bin/bash

# Push to Feature Branch Script
# Creates or switches to a feature branch and pushes changes

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
fi

# Get branch name from user
BRANCH_NAME="$1"
COMMIT_MESSAGE="${2:-"Feature update: $(date '+%Y-%m-%d %H:%M:%S')"}"

if [ -z "$BRANCH_NAME" ]; then
    echo "❌ Error: Branch name required!"
    echo "📝 Usage: ./push-to-feature.sh <branch-name> [commit-message]"
    echo "📝 Example: ./push-to-feature.sh new-themes 'Add new workspace themes'"
    exit 1
fi

echo "🌿 Preparing to push to feature branch: $BRANCH_NAME"
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

# Check if branch exists locally
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    echo "🔄 Switching to existing branch: $BRANCH_NAME"
    git checkout $BRANCH_NAME
else
    echo "🆕 Creating new branch: $BRANCH_NAME"
    git checkout -b $BRANCH_NAME
fi

echo "📋 Current status:"
git status --short

# Add all changes
echo "➕ Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

# Push to feature branch
echo "🚀 Pushing to feature branch..."
git push origin $BRANCH_NAME

echo "✅ Successfully pushed to feature branch!"
echo "🔗 Create pull request: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME/compare/$BRANCH_NAME"