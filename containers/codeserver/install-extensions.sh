#!/bin/bash
# Extension Installation Script for VS Code Server

echo "🔌 Installing venture extensions..."

SHARED_EXTENSIONS="/home/coder/extensions"
VSIX_DIR="/tmp/vsix-packages"

# Create temp directory for VSIX packages
mkdir -p "$VSIX_DIR"

# Function to create and install VSIX package
install_extension_vsix() {
    local extension_path="$1"
    local extension_name="$2"
    local package_name="$3"
    
    if [ -d "$extension_path" ]; then
        echo "📦 Creating VSIX for $extension_name..."
        
        cd "$extension_path"
        
        # Compile TypeScript if needed
        if [ -f "package.json" ] && [ -d "src" ]; then
            echo "🔧 Compiling TypeScript..."
            npm install --silent 2>/dev/null || echo "⚠️  npm install skipped"
            npx tsc -p ./ 2>/dev/null || echo "⚠️  TypeScript compilation skipped"
        fi
        
        # Install using code-server CLI with local path
        echo "⚙️  Installing $extension_name via code-server..."
        
        # Try installing the extension directory directly
        if code-server --install-extension "$extension_path" 2>/dev/null; then
            echo "✅ Installed $extension_name via CLI"
        else
            # Fallback to manual copy method
            echo "🔄 Fallback: Manual installation for $extension_name..."
            local target_dir="/home/coder/.local/share/code-server/extensions/$package_name"
            mkdir -p "$target_dir"
            cp -r "$extension_path"/* "$target_dir/"
            chown -R coder:coder "$target_dir"
            echo "✅ Installed $extension_name manually"
        fi
    else
        echo "⚠️  Extension not found: $extension_path"
    fi
}

# Install venture extensions from shared volume
if [ -d "$SHARED_EXTENSIONS" ]; then
    echo "🔍 Checking for venture extensions..."
    
    # Install Cradle Downloads Extension
    install_extension_vsix "$SHARED_EXTENSIONS/vsc-system-cradle" "CradleSystem Downloads" "cradlesystem.cradle-downloads-extension-1.0.0"
    
    # Install MezzPro Downloads Extension  
    install_extension_vsix "$SHARED_EXTENSIONS/vsc-venture-mezzpro" "MezzPro Downloads" "mezzpro.mezzpro-downloads-extension-1.0.0"
    
    # Install Bizcradle Downloads Extension
    install_extension_vsix "$SHARED_EXTENSIONS/vsc-venture-bizcradle" "Bizcradle Downloads" "bizcradle.bizcradle-downloads-extension-1.0.0"
    
else
    echo "⚠️  Shared extensions directory not found: $SHARED_EXTENSIONS"
fi

# Clean up temp directory
rm -rf "$VSIX_DIR"

echo "🎉 Extension installation completed!"