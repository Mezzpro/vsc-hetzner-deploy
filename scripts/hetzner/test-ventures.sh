#!/bin/bash

# VSCode Venture Isolation Testing Script
# Tests that each venture container operates independently

set -e

echo "🧪 VSCode Venture Isolation Testing"
echo "==================================="

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🔍 Testing venture container isolation on: $HETZNER_IP"
echo ""

# Test venture isolation
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "📊 Container Health Status:"
echo "=========================="

CONTAINERS=("vsc-codeserver-base" "vsc-system-cradle" "vsc-venture-mezzpro" "vsc-venture-bizcradle" "vsc-proxy-gateway")

for container in "${CONTAINERS[@]}"; do
    if docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null | grep -q "healthy"; then
        echo "✅ $container: healthy"
    else
        echo "❌ $container: unhealthy"
    fi
done

echo ""
echo "🌐 Testing Venture Endpoints:"
echo "============================"

# Test Cradle endpoint
echo -n "🏢 Cradle System: "
if curl -s -f http://vsc-system-cradle:3001/health > /dev/null 2>&1; then
    echo "✅ responding"
else
    echo "❌ not responding"
fi

# Test MezzPro endpoint  
echo -n "⛓️  MezzPro: "
if curl -s -f http://vsc-venture-mezzpro:3002/health > /dev/null 2>&1; then
    echo "✅ responding"
else
    echo "❌ not responding"
fi

# Test Bizcradle endpoint
echo -n "🚀 Bizcradle: "
if curl -s -f http://vsc-venture-bizcradle:3003/health > /dev/null 2>&1; then
    echo "✅ responding"
else
    echo "❌ not responding"
fi

# Test Proxy Gateway
echo -n "🌐 Proxy Gateway: "
if curl -s -f http://vsc-proxy-gateway:3000/health > /dev/null 2>&1; then
    echo "✅ responding"
else
    echo "❌ not responding"
fi

echo ""
echo "📊 Resource Usage:"
echo "=================="
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "🔍 Extension Isolation Test:"
echo "==========================="

# Check that each venture only has its own extension
echo "Cradle extensions:"
docker exec vsc-system-cradle find /app/extensions -name "*.js" 2>/dev/null | head -3 || echo "  No extensions found"

echo "MezzPro extensions:"  
docker exec vsc-venture-mezzpro find /app/extensions -name "*.js" 2>/dev/null | head -3 || echo "  No extensions found"

echo "Bizcradle extensions:"
docker exec vsc-venture-bizcradle find /app/extensions -name "*.js" 2>/dev/null | head -3 || echo "  No extensions found"

echo ""
echo "✅ Venture isolation test completed!"
EOF

echo ""
echo "🎯 Test Results Summary:"
echo "======================="
echo "✅ All venture containers should be healthy"
echo "✅ Each venture should respond to its own endpoint"  
echo "✅ Extensions should be isolated per container"
echo "✅ Resource usage should be distributed across containers"
echo ""
echo "🔗 Access venture-specific interfaces:"
echo "   • Cradle: http://${DOMAIN_CRADLE:-cradlesystems.xyz}"
echo "   • MezzPro: http://${DOMAIN_MEZZPRO:-mezzpro.xyz}"
echo "   • Bizcradle: http://${DOMAIN_BIZCRADLE:-bizcradle.xyz}"