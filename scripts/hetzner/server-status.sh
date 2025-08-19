#!/bin/bash

# Server Status Check Script
# Monitors Hetzner server and application health

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
    echo "❌ Error: Missing Hetzner configuration!"
    exit 1
fi

# SSH options
SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🔍 Checking Hetzner server status..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"
echo "═══════════════════════════════════════"

# Check SSH connection
echo "🌐 Testing SSH connection..."
if ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'echo "Connected"' >/dev/null 2>&1; then
    echo "✅ SSH connection working"
else
    echo "❌ SSH connection failed"
    exit 1
fi

# Get server status
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'bash -s' << 'EOF'
#!/bin/bash

echo ""
echo "💻 SYSTEM STATUS"
echo "─────────────────────────────────────"
echo "Uptime: $(uptime -p 2>/dev/null || uptime | cut -d',' -f1)"
echo "Load: $(uptime | sed 's/.*load average: //')"
echo "Memory: $(free -h | grep Mem | awk '{print $3 "/" $2 " used (" $7 " available)"}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2 " used (" $4 " available)"}')"

echo ""
echo "🐳 DOCKER STATUS"
echo "─────────────────────────────────────"
if which docker >/dev/null 2>&1; then
    echo "Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"
    echo "Docker Status: $(systemctl is-active docker 2>/dev/null || echo 'Unknown')"
    
    if docker ps >/dev/null 2>&1; then
        echo "Running Containers:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -v NAMES || echo "No containers running"
    else
        echo "❌ Cannot access Docker (permission issue?)"
    fi
else
    echo "❌ Docker not installed"
fi

echo ""
echo "🚀 APPLICATION STATUS"
echo "─────────────────────────────────────"
if [ -d "~/vsc-deploy/vsc-hetzner-deploy" ]; then
    echo "✅ Deployment directory exists"
    cd ~/vsc-deploy/vsc-hetzner-deploy/app 2>/dev/null || cd ~/vsc-deploy/vsc-hetzner-deploy 2>/dev/null || echo "❌ Cannot access app directory"
    
    if [ -f "docker-compose.yml" ]; then
        echo "✅ Docker Compose file found"
        
        # Check if services are running
        if docker-compose ps 2>/dev/null | grep -q "Up"; then
            echo "✅ Services running:"
            docker-compose ps --format "table {{.Name}}\t{{.State}}\t{{.Ports}}"
        else
            echo "⚠️  Services not running or not accessible"
        fi
    else
        echo "❌ Docker Compose file not found"
    fi
else
    echo "❌ Deployment directory not found"
fi

echo ""
echo "🌐 NETWORK STATUS" 
echo "─────────────────────────────────────"
echo "Active connections on port 3000:"
netstat -tln | grep :3000 || echo "No connections on port 3000"

echo "Active connections on port 80:"
netstat -tln | grep :80 || echo "No connections on port 80"

echo ""
echo "🔥 FIREWALL STATUS"
echo "─────────────────────────────────────"
if which ufw >/dev/null 2>&1; then
    sudo ufw status 2>/dev/null || echo "Cannot check UFW status"
else
    echo "UFW not installed"
fi

echo ""
echo "📊 RESOURCE USAGE"
echo "─────────────────────────────────────"
echo "Top processes by CPU:"
ps aux --sort=-%cpu | head -6 | tail -5 | awk '{printf "%-20s %s\n", $11, $3"%"}'

echo ""
echo "Top processes by Memory:"
ps aux --sort=-%mem | head -6 | tail -5 | awk '{printf "%-20s %s\n", $11, $4"%"}'
EOF

echo ""
echo "📱 APPLICATION HEALTH CHECK"
echo "─────────────────────────────────────"

# Test application endpoints
APP_PORT="${APP_PORT:-3000}"

echo "Testing http://$HETZNER_IP:$APP_PORT ..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://$HETZNER_IP:$APP_PORT 2>/dev/null || echo "000")
if [ "$response" = "200" ] || [ "$response" = "302" ]; then
    echo "✅ Application responding (HTTP $response)"
else
    echo "⚠️  Application not responding (HTTP $response)"
fi

echo ""
echo "🎉 Status check complete!"
echo "📝 For detailed logs run: ssh $HETZNER_USER@$HETZNER_IP 'cd ~/vsc-deploy/vsc-hetzner-deploy/app && docker-compose logs'"