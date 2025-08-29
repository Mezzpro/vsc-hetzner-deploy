#!/bin/bash

# VSCode Microservice Architecture Deployment Script
# Deploys clean containerized VSCode system to Hetzner server

set -e  # Exit on any error

echo "🏗️  VSCode Microservice Architecture Deployment"
echo "================================================"

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

echo "🚀 Deploying to: $HETZNER_USER@$HETZNER_IP"
echo "📦 Repository: $GITHUB_USERNAME/$GITHUB_REPO_NAME"
echo ""

# Deploy application
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << EOF
#!/bin/bash
set -e

echo "📁 Preparing deployment directory..."
cd ~/vsc-deploy

# Backup existing deployment
if [ -d "vsc-hetzner-deploy" ]; then
    echo "💾 Creating backup..."
    cp -r vsc-hetzner-deploy ~/backups/vsc-backup-\$(date +%Y%m%d_%H%M%S) || true
    rm -rf vsc-hetzner-deploy
fi

echo "📥 Cloning repository..."
git clone https://github.com/$GITHUB_USERNAME/$GITHUB_REPO_NAME.git
cd vsc-hetzner-deploy

echo "⚙️  Creating environment configuration..."
cat > .env << 'ENVEOF'
# Server Configuration
HETZNER_IP=$HETZNER_IP
HETZNER_USER=$HETZNER_USER
APP_PASSWORD=${APP_PASSWORD:-vscode123}

# Domain Configuration  
DOMAIN_CRADLE=${DOMAIN_CRADLE:-cradlesystems.xyz}
DOMAIN_MEZZPRO=${DOMAIN_MEZZPRO:-mezzpro.xyz}
DOMAIN_BIZCRADLE=${DOMAIN_BIZCRADLE:-bizcradle.xyz}
ENVEOF

echo "🐳 Starting microservice containers..."
echo "   - vsc-codeserver-base (Core VS Code)"
echo "   - vsc-system-cradle (Business Admin)"  
echo "   - vsc-venture-mezzpro (Blockchain)"
echo "   - vsc-venture-bizcradle (Marketing)"
echo "   - vsc-proxy-gateway (Router)"
echo ""

# Stop existing containers
docker-compose down --remove-orphans || true

# Build and start containers
docker-compose up --build -d

echo "⏳ Waiting for container startup..."
sleep 45

echo "🔍 Validating container health..."
CONTAINERS=("vsc-codeserver-base" "vsc-system-cradle" "vsc-venture-mezzpro" "vsc-venture-bizcradle" "vsc-proxy-gateway")
ALL_HEALTHY=true

for container in "\${CONTAINERS[@]}"; do
    if docker inspect --format='{{.State.Health.Status}}' "\$container" 2>/dev/null | grep -q "healthy"; then
        echo "   ✅ \$container: healthy"
    else
        echo "   ❌ \$container: unhealthy"
        ALL_HEALTHY=false
    fi
done

if [ "\$ALL_HEALTHY" = true ]; then
    echo ""
    echo "✅ All containers are healthy!"
    docker-compose ps
else
    echo ""
    echo "❌ Some containers are unhealthy!"
    docker-compose logs --tail=50
    exit 1
fi

echo ""
echo "🌐 Testing application endpoints..."
sleep 10

# Test proxy gateway
if curl -s -f http://localhost:3000/health > /dev/null; then
    echo "   ✅ Proxy Gateway: responding"
else
    echo "   ❌ Proxy Gateway: not responding"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "🔗 Access Points:"
echo "   • Cradle System: http://${DOMAIN_CRADLE:-cradlesystems.xyz}"
echo "   • MezzPro: http://${DOMAIN_MEZZPRO:-mezzpro.xyz}" 
echo "   • Bizcradle: http://${DOMAIN_BIZCRADLE:-bizcradle.xyz}"
echo ""
echo "🖥️  Direct Access: http://$HETZNER_IP:3000"
echo ""
echo "📊 Container Status:"
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
EOF

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "   1. Configure DNS A records:"
echo "      ${DOMAIN_CRADLE:-cradlesystems.xyz} → $HETZNER_IP"
echo "      ${DOMAIN_MEZZPRO:-mezzpro.xyz} → $HETZNER_IP"
echo "      ${DOMAIN_BIZCRADLE:-bizcradle.xyz} → $HETZNER_IP"
echo ""
echo "   2. Test venture isolation:"
echo "      ./scripts/hetzner/test-ventures.sh"
echo ""
echo "   3. Monitor system health:"
echo "      ./scripts/hetzner/server-status.sh"
echo ""