#!/bin/bash
# Extension Installation Script for VS Code Server

echo "🔌 Installing venture extensions..."

SHARED_EXTENSIONS="/home/coder/extensions"
VSIX_DIR="/tmp/vsix-packages"

# Create temp directory for VSIX packages
mkdir -p "$VSIX_DIR"

# Function to manually copy and install extension
install_extension_manual() {
    local extension_path="$1"
    local extension_name="$2"
    local package_name="$3"
    
    if [ -d "$extension_path" ]; then
        echo "📦 Installing $extension_name..."
        
        # Direct copy to VS Code extensions directory
        local target_dir="/home/coder/.local/share/code-server/extensions/$package_name"
        
        echo "📁 Copying extension to: $target_dir"
        mkdir -p "$target_dir"
        cp -r "$extension_path"/* "$target_dir/"
        
        # Set proper ownership
        chown -R coder:coder "$target_dir"
        chmod -R 755 "$target_dir"
        
        # Ensure the out directory has executable permissions
        if [ -d "$target_dir/out" ]; then
            chmod -R 755 "$target_dir/out"
        fi
        
        echo "✅ Installed $extension_name at $target_dir"
    else
        echo "⚠️  Extension not found: $extension_path"
    fi
}

# Clean up old extensions first
echo "🧹 Cleaning up old extensions..."
rm -rf /home/coder/.local/share/code-server/extensions/*business-extension*
rm -rf /home/coder/.local/share/code-server/extensions/*blockchain-extension*
rm -f /home/coder/.local/share/code-server/extensions/.obsolete

# Install venture extensions from shared volume
if [ -d "$SHARED_EXTENSIONS" ]; then
    echo "🔍 Checking for venture extensions..."
    
    # Install Cradle Downloads Extension
    install_extension_manual "$SHARED_EXTENSIONS/vsc-system-cradle" "CradleSystem Downloads" "cradlesystem.cradle-downloads-extension-1.0.0"
    
    # Install MezzPro Downloads Extension  
    install_extension_manual "$SHARED_EXTENSIONS/vsc-venture-mezzpro" "MezzPro Downloads" "mezzpro.mezzpro-downloads-extension-1.0.0"
    
    # Install Bizcradle Downloads Extension
    install_extension_manual "$SHARED_EXTENSIONS/vsc-venture-bizcradle" "Bizcradle Downloads" "bizcradle.bizcradle-downloads-extension-1.0.0"
    
else
    echo "⚠️  Shared extensions directory not found: $SHARED_EXTENSIONS"
fi

# Create empty extensions.json for VS Code
echo "📋 Creating extensions.json..."
echo "[]" > /home/coder/.local/share/code-server/extensions/extensions.json
chown coder:coder /home/coder/.local/share/code-server/extensions/extensions.json

# Clean up temp directory
rm -rf "$VSIX_DIR"

echo "🎉 Extension installation completed!"