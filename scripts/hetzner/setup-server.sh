#!/bin/bash

# Hetzner Server Setup Script
# Initial server configuration for VSC deployment

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
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🚀 Setting up Hetzner server: $HETZNER_IP"
echo "⚠️  This will install Docker, configure firewall, and prepare deployment environment"

read -p "Continue with server setup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

# Execute setup commands on remote server
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'bash -s' << 'EOF'
#!/bin/bash
set -e

echo "📦 Updating system packages..."
sudo apt-get update

echo "🔧 Installing essential packages..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    htop \
    vim \
    ufw

echo "🐳 Installing Docker..."
# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "👤 Adding user to Docker group..."
sudo usermod -aG docker $USER

echo "🔥 Configuring firewall..."
# Reset UFW to defaults
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (current connection)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow custom app port
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw --force enable

echo "📁 Creating deployment directories..."
mkdir -p ~/vsc-deploy
mkdir -p ~/backups

echo "🔍 Verifying installations..."
docker --version
docker-compose --version

echo "✅ Server setup completed!"
echo "⚠️  Please logout and login again for Docker group changes to take effect"
EOF

echo "🎉 Hetzner server setup complete!"
echo "📝 Next steps:"
echo "   1. Test connection: ./scripts/hetzner/check-connection.sh"
echo "   2. Deploy application: ./scripts/hetzner/deploy-app.sh"