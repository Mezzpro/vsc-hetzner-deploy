#!/bin/sh

echo "🚀 Starting Bizcradle Venture Container..."

# Copy workspace to shared volume
echo "📁 Copying Bizcradle workspace..."
if [ -d "/app/workspace" ] && [ -d "/app/workspaces" ]; then
    cp -r /app/workspace /app/workspaces/bizcradle
    echo "✅ Bizcradle workspace copied to /app/workspaces/bizcradle"
else
    echo "⚠️  Workspace directories not found"
fi

# Copy extensions to shared volume
echo "🔌 Copying Bizcradle extensions..."
if [ -d "/app/extensions/vsc-venture-bizcradle" ] && [ -d "/app/extensions" ]; then
    mkdir -p /app/extensions/vsc-venture-bizcradle
    cp -r /app/extension/* /app/extensions/vsc-venture-bizcradle/
    echo "✅ Bizcradle extensions copied to /app/extensions/vsc-venture-bizcradle"
else
    echo "⚠️  Extension directories not found"
fi

# Start venture service
node server.js &

# Keep container running
wait