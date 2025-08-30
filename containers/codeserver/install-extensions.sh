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
    
    echo "🔍 DEBUG: Installing $extension_name"
    echo "   Source: $extension_path"
    echo "   Package: $package_name"
    
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
        
        # DEBUG: Verify package.json exists and check content
        if [ -f "$target_dir/package.json" ]; then
            echo "✅ package.json found"
            echo "📋 Extension info from package.json:"
            cat "$target_dir/package.json" | jq -r '.name, .displayName, .publisher, .version' 2>/dev/null || echo "   (jq not available for JSON parsing)"
        else
            echo "❌ package.json NOT found in $target_dir"
            ls -la "$target_dir/"
        fi
        
        # DEBUG: Check if out/extension.js exists
        if [ -f "$target_dir/out/extension.js" ]; then
            echo "✅ Compiled extension.js found"
        else
            echo "⚠️  extension.js not found - checking if src/extension.ts exists"
            if [ -f "$target_dir/src/extension.ts" ]; then
                echo "📝 TypeScript source found, compiling..."
                cd "$target_dir" && npm run compile 2>/dev/null || echo "⚠️  Compilation failed or npm not available"
                cd - > /dev/null
            fi
        fi
        
        echo "✅ Installed $extension_name at $target_dir"
    else
        echo "⚠️  Extension not found: $extension_path"
        echo "📂 Available directories in $(dirname "$extension_path"):"
        ls -la "$(dirname "$extension_path")" 2>/dev/null || echo "   Parent directory not accessible"
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

# Create comprehensive extensions.json for VS Code
echo "📋 Creating extensions.json with proper registry entries..."
cat > /home/coder/.local/share/code-server/extensions/extensions.json << 'EOF'
[
  {
    "identifier": {
      "id": "cradlesystem.cradle-downloads-extension"
    },
    "version": "1.0.0",
    "location": {
      "$mid": 1,
      "fsPath": "/home/coder/.local/share/code-server/extensions/cradlesystem.cradle-downloads-extension-1.0.0"
    },
    "metadata": {
      "id": "cradlesystem.cradle-downloads-extension",
      "publisherId": "cradlesystem",
      "source": "user",
      "isBuiltin": false,
      "preRelease": false,
      "installedTimestamp": 1693420800000
    }
  },
  {
    "identifier": {
      "id": "mezzpro.mezzpro-downloads-extension"
    },
    "version": "1.0.0",
    "location": {
      "$mid": 1,
      "fsPath": "/home/coder/.local/share/code-server/extensions/mezzpro.mezzpro-downloads-extension-1.0.0"
    },
    "metadata": {
      "id": "mezzpro.mezzpro-downloads-extension",
      "publisherId": "mezzpro",
      "source": "user",
      "isBuiltin": false,
      "preRelease": false,
      "installedTimestamp": 1693420800000
    }
  },
  {
    "identifier": {
      "id": "bizcradle.bizcradle-downloads-extension"
    },
    "version": "1.0.0",
    "location": {
      "$mid": 1,
      "fsPath": "/home/coder/.local/share/code-server/extensions/bizcradle.bizcradle-downloads-extension-1.0.0"
    },
    "metadata": {
      "id": "bizcradle.bizcradle-downloads-extension",
      "publisherId": "bizcradle",
      "source": "user",
      "isBuiltin": false,
      "preRelease": false,
      "installedTimestamp": 1693420800000
    }
  }
]
EOF

chown coder:coder /home/coder/.local/share/code-server/extensions/extensions.json
chmod 644 /home/coder/.local/share/code-server/extensions/extensions.json

echo "✅ extensions.json created with registry entries"
echo "📋 Registry content:"
cat /home/coder/.local/share/code-server/extensions/extensions.json | head -10

# Clean up old extension cache to force regeneration
echo "🧹 Cleaning extension cache files..."
rm -f /home/coder/.local/share/code-server/User/workspaceStorage/*/extensions.*.cache
rm -f /home/coder/.local/share/code-server/logs/*/exthost*/output.log

# DEBUG: Final verification
echo "🔍 FINAL DEBUG - Extension installation summary:"
echo "📁 Installed extensions:"
ls -la /home/coder/.local/share/code-server/extensions/ | grep -E "(cradle|mezzpro|bizcradle)"
echo "📄 Registry entries count:"
cat /home/coder/.local/share/code-server/extensions/extensions.json | grep -c "identifier" || echo "0"

# Clean up temp directory
rm -rf "$VSIX_DIR"

echo "🎉 Extension installation completed!"