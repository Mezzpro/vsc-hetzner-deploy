#!/bin/bash
# Extension Installation Script for VS Code Server

echo "🔌 Installing venture extensions..."

EXTENSIONS_DIR="/home/coder/.local/share/code-server/extensions"
SHARED_EXTENSIONS="/home/coder/extensions"

# Create extensions directory if not exists
mkdir -p "$EXTENSIONS_DIR"

# Function to install extension from directory
install_extension() {
    local extension_path="$1"
    local extension_name="$2"
    
    if [ -d "$extension_path" ]; then
        echo "📦 Installing $extension_name..."
        
        # Copy extension to VS Code extensions directory
        cp -r "$extension_path" "$EXTENSIONS_DIR/$extension_name"
        
        # Set proper ownership
        chown -R coder:coder "$EXTENSIONS_DIR/$extension_name"
        
        echo "✅ Installed $extension_name"
    else
        echo "⚠️  Extension not found: $extension_path"
    fi
}

# Install venture extensions from shared volume
if [ -d "$SHARED_EXTENSIONS" ]; then
    echo "🔍 Checking for venture extensions..."
    
    # Install Cradle Business Extension
    install_extension "$SHARED_EXTENSIONS/vsc-system-cradle" "cradle-business-extension"
    
    # Install MezzPro Blockchain Extension  
    install_extension "$SHARED_EXTENSIONS/vsc-venture-mezzpro" "mezzpro-blockchain-extension"
    
    # Install Bizcradle Business Extension
    install_extension "$SHARED_EXTENSIONS/vsc-venture-bizcradle" "bizcradle-business-extension"
    
else
    echo "⚠️  Shared extensions directory not found: $SHARED_EXTENSIONS"
fi

# Create empty extensions.json (VS Code will populate it automatically)
echo "[]" > "$EXTENSIONS_DIR/extensions.json"
chown coder:coder "$EXTENSIONS_DIR/extensions.json"

echo "🎉 Extension installation completed!"