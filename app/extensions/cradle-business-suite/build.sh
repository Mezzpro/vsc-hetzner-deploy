#!/bin/bash

# Cradle Business Suite Extension Build Script
echo "🔨 Building Cradle Business Suite Extension..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Compile TypeScript
echo "🔧 Compiling TypeScript..."
npm run compile

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "✅ Extension compiled successfully!"
    echo "📍 Extension ready at: $(pwd)"
    echo ""
    echo "📋 Installation Instructions:"
    echo "1. Copy this extension to code-server extensions directory"
    echo "2. Restart code-server"
    echo "3. Extension will auto-activate in workspace-admin"
else
    echo "❌ Compilation failed!"
    exit 1
fi