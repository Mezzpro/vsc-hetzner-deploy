#!/bin/bash

# Deploy Application to Hetzner Script
# Deploys the VSC application to your Hetzner server

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check required variables
if [ -z "$HETZNER_IP" ] || [ -z "$HETZNER_USER" ] || [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_REPO_NAME" ]; then
    echo "❌ Error: Missing required configuration!"
    echo "Required: HETZNER_IP, HETZNER_USER, GITHUB_USERNAME, GITHUB_REPO_NAME"
    exit 1
fi

# SSH options
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🚀 Deploying VSC application to Hetzner server..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"
echo "📦 Repository: $GITHUB_USERNAME/$GITHUB_REPO_NAME"

# Deploy application
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << EOF
#!/bin/bash
set -e

echo "📁 Preparing deployment directory..."
cd ~/vsc-deploy

# Backup existing deployment if it exists
if [ -d "vsc-hetzner-deploy" ]; then
    echo "💾 Backing up existing deployment..."
    cp -r vsc-hetzner-deploy ~/backups/vsc-backup-\$(date +%Y%m%d_%H%M%S) || true
    rm -rf vsc-hetzner-deploy
fi

echo "📥 Cloning repository..."
git clone https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME.git
cd vsc-hetzner-deploy

echo "⚙️  Setting up environment..."
# Create .env file from environment variables passed from local
cat > .env << 'ENVEOF'
HETZNER_IP=$HETZNER_IP
HETZNER_USER=$HETZNER_USER
APP_PASSWORD=${APP_PASSWORD:-vscode123}
APP_PORT=${APP_PORT:-3000}
DOMAIN_CRADLE=${DOMAIN_CRADLE:-cradlesystems.xyz}
DOMAIN_MEZZPRO=${DOMAIN_MEZZPRO:-mezzpro.xyz}
DOMAIN_MINQRO=${DOMAIN_MINQRO:-minqro.xyz}
GEMINI_API_KEY=${GEMINI_API_KEY:-}
ENVEOF

echo "🐳 Starting Docker containers..."
cd app
docker-compose down || true
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    docker-compose ps
else
    echo "❌ Services failed to start!"
    docker-compose logs
    exit 1
fi

echo "🌐 Testing application..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|302"; then
    echo "✅ Application is responding!"
else
    echo "⚠️  Application may not be responding on port 3000"
    echo "📋 Check logs: docker-compose logs"
fi

echo "🎉 Deployment completed successfully!"
echo "🔗 Access your application:"
echo "   http://$HETZNER_IP:3000"
echo "   http://${DOMAIN_CRADLE:-cradlesystems.xyz}:3000"
echo "   http://${DOMAIN_MEZZPRO:-mezzpro.xyz}:3000"
echo "   http://${DOMAIN_MINQRO:-minqro.xyz}:3000"
EOF

echo "✅ Deployment script completed!"
echo "📝 Next steps:"
echo "   1. Check server status: ./scripts/hetzner/server-status.sh"
echo "   2. Configure DNS to point your domains to: $HETZNER_IP"
echo "   3. Test domain access after DNS propagation"