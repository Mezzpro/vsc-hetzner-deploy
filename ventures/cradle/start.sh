#!/bin/sh

echo "🏢 Starting Cradle System Container..."

# Copy workspace to shared volume
echo "📁 Copying Cradle workspace..."
if [ -d "/app/workspace" ] && [ -d "/app/workspaces" ]; then
    cp -r /app/workspace /app/workspaces/cradle
    echo "✅ Cradle workspace copied to /app/workspaces/cradle"
else
    echo "⚠️  Workspace directories not found"
fi

# Copy extensions to shared volume
echo "🔌 Copying Cradle extensions..."
if [ -d "/app/extensions/vsc-system-cradle" ] && [ -d "/app/extensions" ]; then
    mkdir -p /app/extensions/vsc-system-cradle
    cp -r /app/extension/* /app/extensions/vsc-system-cradle/
    echo "✅ Cradle extensions copied to /app/extensions/vsc-system-cradle"
else
    echo "⚠️  Extension directories not found"
fi

# Start venture service
node server.js &

# Keep container running
wait