#!/bin/bash

# Check Hetzner Connection Script
# Tests SSH connection to your Hetzner server

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
if [ -z "$HETZNER_IP" ] || [ -z "$HETZNER_USER" ]; then
    echo "❌ Error: Missing Hetzner configuration!"
    echo "Required: HETZNER_IP, HETZNER_USER"
    exit 1
fi

echo "🔍 Testing connection to Hetzner server..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# SSH connection options
SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=no"

# Add SSH key if specified
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "⏳ Connecting..."

# Test basic SSH connection
if ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'echo "SSH connection successful!"'; then
    echo "✅ SSH connection working!"
else
    echo "❌ SSH connection failed!"
    echo "💡 Check your IP, username, and SSH key configuration"
    exit 1
fi

# Test sudo access
echo "🔐 Testing sudo access..."
if ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'sudo -n true 2>/dev/null'; then
    echo "✅ Sudo access confirmed!"
else
    echo "⚠️  Sudo requires password or not available"
    echo "💡 You may need to enter password during deployment"
fi

# Check system info
echo "🖥️  Server information:"
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP '
    echo "OS: $(lsb_release -d 2>/dev/null | cut -f2 || echo "Unknown")"
    echo "Kernel: $(uname -r)"
    echo "Architecture: $(uname -m)"
    echo "Uptime: $(uptime -p 2>/dev/null || uptime)"
    echo "Disk Space: $(df -h / | tail -1 | awk "{print \$4\" available\"}")"
    echo "Memory: $(free -h | grep Mem | awk "{print \$7\" available\"}")"
'

# Check if Docker is installed
echo "🐳 Checking Docker status..."
if ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'which docker >/dev/null 2>&1'; then
    docker_version=$(ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'docker --version 2>/dev/null || echo "Not accessible"')
    echo "✅ Docker found: $docker_version"
else
    echo "⚠️  Docker not found - will be installed during setup"
fi

# Check if Docker Compose is installed
if ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'which docker-compose >/dev/null 2>&1'; then
    compose_version=$(ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'docker-compose --version 2>/dev/null || echo "Not accessible"')
    echo "✅ Docker Compose found: $compose_version"
else
    echo "⚠️  Docker Compose not found - will be installed during setup"
fi

echo "🎉 Connection test complete!"
echo "🚀 Your server is ready for deployment setup"