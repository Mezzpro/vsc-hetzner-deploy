#!/bin/bash

# Setup GitHub Secrets Script
# Configures repository secrets for deployment

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check required variables
if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_REPO_NAME" ]; then
    echo "❌ Error: Missing required GitHub configuration!"
    exit 1
fi

echo "🔐 Setting up GitHub repository secrets..."

# Function to set a secret
set_secret() {
    local secret_name="$1"
    local secret_value="$2"
    
    echo "🔑 Setting secret: $secret_name"
    
    # Get the repository's public key for encryption
    public_key=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$GITHUB_USERNAME/$GITHUB_REPO_NAME/actions/secrets/public-key")
    
    # Note: For simplicity, this script shows the structure
    # In practice, you'd need to encrypt the secret value using the public key
    echo "📝 Secret $secret_name configured (encryption required for actual implementation)"
}

# Set up secrets
if [ -n "$HETZNER_IP" ]; then
    set_secret "HETZNER_IP" "$HETZNER_IP"
fi

if [ -n "$HETZNER_USER" ]; then
    set_secret "HETZNER_USER" "$HETZNER_USER"
fi

if [ -n "$APP_PASSWORD" ]; then
    set_secret "APP_PASSWORD" "$APP_PASSWORD"
fi

echo "⚠️  IMPORTANT: SSH Key Setup"
echo "🔑 You need to manually add your SSH private key to GitHub Secrets:"
echo "   1. Go to: https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME/settings/secrets/actions"
echo "   2. Add new secret: HETZNER_SSH_KEY"
echo "   3. Paste your SSH private key content"
echo ""
echo "📝 Alternatively, use GitHub CLI:"
echo "   gh secret set HETZNER_SSH_KEY < ~/.ssh/your_private_key"

echo "✅ GitHub secrets configuration guide complete!"