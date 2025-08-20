#!/bin/bash

echo "🚀 Starting VSC Hetzner Services..."

# Create workspace directories
echo "📁 Setting up workspaces..."
mkdir -p /home/coder/workspace-admin/.vscode
mkdir -p /home/coder/workspace-mezzpro/.vscode
mkdir -p /home/coder/workspace-minqro/.vscode
mkdir -p /home/coder/workspace-sobuai/.vscode
mkdir -p /home/coder/workspace-bizcradle/.vscode

# Fix permissions for code-server directories
echo "🔧 Fixing permissions..."
sudo mkdir -p /home/coder/.local/share/code-server/User
sudo chown -R coder:coder /home/coder/.local
sudo chmod -R 755 /home/coder/.local

# Apply workspace-specific themes
echo "🎨 Applying workspace themes..."
bash /home/coder/themes/cradle-theme.sh
bash /home/coder/themes/mezzpro-theme.sh
bash /home/coder/themes/minqro-theme.sh
bash /home/coder/themes/apply-sobuai-theme.sh
bash /home/coder/themes/apply-bizcradle-theme.sh

# Hide .vscode folders from user view
chmod 700 /home/coder/workspace-admin/.vscode
chmod 700 /home/coder/workspace-mezzpro/.vscode
chmod 700 /home/coder/workspace-minqro/.vscode
chmod 700 /home/coder/workspace-sobuai/.vscode
chmod 700 /home/coder/workspace-bizcradle/.vscode

echo "✅ Workspaces configured!"

# Install Node.js dependencies
echo "📦 Installing proxy dependencies..."
cd /home/coder
npm install --production

# Start code-server in background
echo "📋 Starting code-server on port 8080..."
unset PORT  # Don't let code-server use PORT env var
code-server \
    --bind-addr "0.0.0.0:8080" \
    --auth password \
    --disable-telemetry \
    --disable-update-check \
    /home/coder &

CODE_SERVER_PID=$!
echo "✅ Code-server started (PID: $CODE_SERVER_PID)"

# Wait for code-server to be ready
echo "⏳ Waiting for code-server to start..."
for i in {1..60}; do
    if curl -s -o /dev/null http://localhost:8080; then
        echo "✅ Code-server is ready!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ Code-server failed to start within 60 seconds"
        exit 1
    fi
    sleep 1
done

# Start proxy server on port 3000
echo "🌐 Starting proxy server on port ${PORT:-3000}..."
echo "🔗 Proxy will route requests to code-server on port 8080"

# Restore PORT for proxy
export PORT=${PORT:-3000}

# Start the proxy server in foreground
exec node /home/coder/proxy-server.js