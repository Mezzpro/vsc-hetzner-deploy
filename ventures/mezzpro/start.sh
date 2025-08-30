#!/bin/sh

echo "⛓️ Starting MezzPro Venture Container..."

# Copy workspace to shared volume
echo "📁 Copying MezzPro workspace..."
if [ -d "/app/workspace" ] && [ -d "/app/workspaces" ]; then
    cp -r /app/workspace /app/workspaces/mezzpro
    echo "✅ MezzPro workspace copied to /app/workspaces/mezzpro"
else
    echo "⚠️  Workspace directories not found"
fi

# Copy extensions to shared volume
echo "🔌 Copying MezzPro extensions..."
if [ -d "/app/extensions/vsc-venture-mezzpro" ] && [ -d "/app/extensions" ]; then
    mkdir -p /app/extensions/vsc-venture-mezzpro
    cp -r /app/extension/* /app/extensions/vsc-venture-mezzpro/
    echo "✅ MezzPro extensions copied to /app/extensions/vsc-venture-mezzpro"
else
    echo "⚠️  Extension directories not found"
fi

# Start venture service
node server.js &

# Keep container running
wait