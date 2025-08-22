#!/bin/bash

# Check Hetzner Container Logs Script
# Connects to Hetzner server and displays container logs

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check required variables
if [ -z "$HETZNER_IP" ] || [ -z "$HETZNER_USER" ]; then
    echo "❌ Error: Missing required configuration!"
    echo "Required: HETZNER_IP, HETZNER_USER"
    exit 1
fi

# SSH options
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "📋 Checking logs on Hetzner server..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Check container logs
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔍 Container Status:"
cd ~/vsc-deploy/vsc-hetzner-deploy/app
docker-compose ps

echo ""
echo "📋 Application Logs (last 100 lines):"
docker-compose logs --tail=100

echo ""
echo "🔧 Extension Installation Check:"
docker exec vsc-hetzner-app ls -la /home/coder/.local/share/code-server/extensions/ 2>/dev/null || echo "Extensions directory not found"

echo ""
echo "📁 Extension Files Check:"
docker exec vsc-hetzner-app ls -la /home/coder/extensions/ 2>/dev/null || echo "Source extensions directory not found"

echo ""
echo "⚙️ Extension Build Check:"
docker exec vsc-hetzner-app ls -la /home/coder/extensions/cradle-business-suite/out/ 2>/dev/null || echo "Extension build output not found"

echo ""
echo "🚀 Code-Server Process Check:"
docker exec vsc-hetzner-app ps aux | grep code-server | head -5

echo ""
echo "🌐 Port Status:"
docker exec vsc-hetzner-app netstat -tlnp | grep -E ':3000|:8080'

EOF

echo "✅ Log check completed!"