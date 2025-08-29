#!/bin/bash
# VS Code Server Startup Script with Extension Management

echo "🚀 Starting VS Code Server with venture extensions..."

# Clear any existing config that might interfere
echo "🧹 Clearing VS Code config..."
rm -rf /home/coder/.config/code-server/config.yaml

# Fix workspace permissions (from Docker build root ownership to coder ownership)
echo "🔧 Fixing workspace permissions..."
if [ -d "/home/coder/workspaces" ]; then
    sudo chown -R coder:coder /home/coder/workspaces/
    sudo chmod -R 755 /home/coder/workspaces/
    echo "✅ Workspace permissions fixed"
else
    echo "⚠️  Workspaces directory not found"
fi

# Fix extension permissions
echo "🔧 Fixing extension permissions..."
if [ -d "/home/coder/extensions" ]; then
    sudo chown -R coder:coder /home/coder/extensions/
    sudo chmod -R 755 /home/coder/extensions/
    echo "✅ Extension permissions fixed"
fi

# Fix VS Code data permissions
echo "🔧 Fixing VS Code data permissions..."
sudo mkdir -p /home/coder/.local/share/code-server
sudo chown -R coder:coder /home/coder/.local/
sudo chmod -R 755 /home/coder/.local/

# Install/update venture extensions  
echo "🔧 Installing venture extensions..."
/home/coder/install-extensions.sh

# Fix extensions.json format for VS Code
echo "🔧 Fixing extensions.json format..."
echo "[]" > /home/coder/.local/share/code-server/extensions/extensions.json

# Wait a moment for extensions to be ready
echo "⏳ Waiting for extensions to initialize..."
sleep 5

# Start VS Code Server with explicit config
echo "🌐 Starting VS Code Server..."
exec code-server \
  --bind-addr "0.0.0.0:8080" \
  --auth "password" \
  --password "${PASSWORD}" \
  --disable-telemetry \
  --disable-update-check