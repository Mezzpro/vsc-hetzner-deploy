#!/bin/bash
# VS Code Server Startup Script with Extension Management

echo "🚀 Starting VS Code Server with venture extensions..."

# Install/update venture extensions
echo "🔧 Installing venture extensions..."
/home/coder/install-extensions.sh

# Wait a moment for extensions to be ready
echo "⏳ Waiting for extensions to initialize..."
sleep 5

# Start VS Code Server
echo "🌐 Starting VS Code Server..."
exec code-server --bind-addr "0.0.0.0:8080" --auth "none" --disable-telemetry