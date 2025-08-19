#!/bin/bash

# Create GitHub Repository Script
# Creates a new GitHub repository using GitHub API

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    echo "📝 Copy .env.example to .env and configure your settings"
    exit 1
fi

# Check required variables
if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_REPO_NAME" ]; then
    echo "❌ Error: Missing required GitHub configuration!"
    echo "Required: GITHUB_TOKEN, GITHUB_USERNAME, GITHUB_REPO_NAME"
    exit 1
fi

echo "🚀 Creating GitHub repository: $GITHUB_REPO_NAME"

# Create repository using GitHub API
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$GITHUB_REPO_NAME\",
    \"description\": \"VSC Coder Ventures - Hetzner Deployment with Multi-Domain Workspaces\",
    \"private\": false,
    \"auto_init\": true,
    \"gitignore_template\": \"Node\",
    \"license_template\": \"mit\"
  }")

if [ "$response" = "201" ]; then
    echo "✅ Repository created successfully!"
    echo "🔗 https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME"
    
    # Initialize local git repository if not already done
    if [ ! -d ".git" ]; then
        echo "📦 Initializing local git repository..."
        git init
        git remote add origin https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME.git
        echo "✅ Git repository initialized and remote added"
    fi
    
elif [ "$response" = "422" ]; then
    echo "⚠️  Repository already exists!"
    echo "🔗 https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME"
else
    echo "❌ Failed to create repository. HTTP status: $response"
    echo "💡 Check your GITHUB_TOKEN permissions"
    exit 1
fi

echo "🎉 Repository setup complete!"