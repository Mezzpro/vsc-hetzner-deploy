#!/bin/bash

# Gemini CLI Installation Script for Cradle Systems Admin Workspace
# This script installs Gemini CLI globally so all workspaces can access it

echo "🚀 Gemini CLI Installation Script"
echo "=================================="
echo "This will install Gemini CLI globally for all workspaces"
echo ""

# Function to ask for confirmation
ask_confirmation() {
    local step="$1"
    local default="$2"
    
    while true; do
        if [ "$default" = "y" ]; then
            read -p "$step [Y/n/s(kip)]: " choice
            choice=${choice:-y}
        else
            read -p "$step [y/N/s(kip)]: " choice
            choice=${choice:-n}
        fi
        
        case $choice in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            [Ss]* ) echo "⏭️  Skipped: $step"; return 2;;
            * ) echo "Please answer yes (y), no (n), or skip (s)";;
        esac
    done
}

# Step 1: Clean existing installations
if ask_confirmation "🧹 Clean existing Gemini CLI installations?" "y"; then
    echo "🧹 Cleaning existing installations..."
    unset NVM_DIR
    sed -i '/NVM_DIR/d' ~/.bashrc 2>/dev/null || true
    sudo rm -rf /root/.nvm 2>/dev/null || true
    npm uninstall -g @google/gemini-cli 2>/dev/null || true
    sudo rm -f /usr/local/bin/gemini 2>/dev/null || true
    echo "✅ Cleanup completed"
elif [ $? -eq 2 ]; then
    echo "⏭️  Skipped cleanup"
else
    echo "❌ Cleanup cancelled by user"
fi

echo ""

# Step 2: Install NVM
if ask_confirmation "📦 Install NVM (Node Version Manager)?" "y"; then
    echo "📦 Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    echo "✅ NVM installation completed"
elif [ $? -eq 2 ]; then
    echo "⏭️  Skipped NVM installation"
else
    echo "❌ NVM installation cancelled"
    exit 1
fi

echo ""

# Step 3: Load NVM and install Node.js
if ask_confirmation "🟢 Load NVM and install Node.js 20?" "y"; then
    echo "🟢 Loading NVM and installing Node.js 20..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    nvm install 20
    nvm use 20
    
    echo "✅ Node.js 20 installed and activated"
    node --version
    npm --version
elif [ $? -eq 2 ]; then
    echo "⏭️  Skipped Node.js installation"
else
    echo "❌ Node.js installation cancelled"
    exit 1
fi

echo ""

# Step 4: Install Gemini CLI
if ask_confirmation "🤖 Install Gemini CLI globally?" "y"; then
    echo "🤖 Installing Gemini CLI..."
    npm install -g @google/gemini-cli@latest
    echo "✅ Gemini CLI installed"
elif [ $? -eq 2 ]; then
    echo "⏭️  Skipped Gemini CLI installation"
else
    echo "❌ Gemini CLI installation cancelled"
    exit 1
fi

echo ""

# Step 5: Configure PATH
if ask_confirmation "🛣️  Configure PATH for persistent access?" "y"; then
    echo "🛣️  Configuring PATH..."
    
    # Add to current user's bashrc
    echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
    echo 'export PATH=/home/coder/.nvm/versions/node/v20.19.4/bin:$PATH' >> ~/.bashrc
    
    # Source for current session
    source ~/.bashrc
    
    echo "✅ PATH configured"
    echo "Current PATH includes: $(echo $PATH | grep -o '/home/coder/.nvm[^:]*')"
elif [ $? -eq 2 ]; then
    echo "⏭️  Skipped PATH configuration"
else
    echo "❌ PATH configuration cancelled"
fi

echo ""

# Step 6: Verify installation
if ask_confirmation "✅ Verify Gemini CLI installation?" "y"; then
    echo "✅ Verifying installation..."
    
    # Source bashrc to ensure PATH is loaded
    source ~/.bashrc
    
    echo "📍 Gemini location: $(which gemini 2>/dev/null || echo 'Not found in PATH')"
    echo "📦 Gemini version: $(gemini --version 2>/dev/null || echo 'Unable to get version')"
    
    if command -v gemini &> /dev/null; then
        echo "✅ Gemini CLI is properly installed and accessible"
    else
        echo "❌ Gemini CLI installation verification failed"
        echo "💡 You may need to restart your terminal or run: source ~/.bashrc"
    fi
elif [ $? -eq 2 ]; then
    echo "⏭️  Skipped verification"
fi

echo ""

# Step 7: Test Gemini CLI
if ask_confirmation "🧪 Test Gemini CLI with authentication?" "n"; then
    echo "🧪 Testing Gemini CLI..."
    echo "⚠️  This will start Gemini CLI - you may need to authenticate"
    echo "Press Ctrl+C to exit if needed"
    sleep 3
    gemini --help
elif [ $? -eq 2 ]; then
    echo "⏭️  Skipped Gemini CLI test"
else
    echo "❌ Gemini CLI test cancelled"
fi

echo ""
echo "🎉 Installation script completed!"
echo ""
echo "📝 Summary:"
echo "  • Gemini CLI should now be available globally"
echo "  • All workspaces can use 'gemini' command"
echo "  • Authentication may be needed on first use"
echo ""
echo "🚀 Next steps:"
echo "  1. Test: run 'gemini --version'"
echo "  2. Authenticate: run 'gemini' and follow OAuth flow"
echo "  3. Use in any workspace terminal"
echo ""
echo "💡 If gemini command not found, run: source ~/.bashrc"