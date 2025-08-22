#!/bin/bash

# Force Replace Extension with Updated Source
# Aggressively replaces the extension and forces VS Code to reload it

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check required variables
if [ -z "$HETZNER_IP" ] || [ -z "$HETZNER_USER" ]; then
    echo "❌ Error: Missing required configuration!"
    echo "Required: HETZNER_IP, HETZNER_USER"
    exit 1
fi

# SSH options
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🔄 Force replacing Cradle Business Suite Extension..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Force replace extension
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Force Extension Replacement:"
docker exec -u coder vsc-hetzner-app bash -c "
echo '=== STOPPING ALL VS CODE PROCESSES ==='
pkill -9 -f code-server || echo 'Code-server killed'
pkill -9 -f extensionHost || echo 'Extension host killed'
pkill -9 -f node || echo 'Node processes killed'
sleep 5

echo ''
echo '=== AGGRESSIVE CLEANUP ==='
echo 'Removing ALL extension-related files...'
rm -rf /home/coder/.local/share/code-server/extensions/cradle-business-suite*
rm -rf /home/coder/.local/share/code-server/extensions/.obsolete
rm -f /home/coder/.local/share/code-server/extensions/extensions.json
echo 'Extension files completely removed'

echo 'Clearing VS Code cache and logs...'
rm -rf /home/coder/.local/share/code-server/logs/*
rm -rf /home/coder/.local/share/code-server/User/globalStorage/*
rm -rf /home/coder/.local/share/code-server/User/workspaceStorage/*
echo 'VS Code cache cleared'

echo ''
echo '=== RECOMPILING SOURCE EXTENSION ==='
cd /home/coder/extensions/cradle-business-suite
echo 'Current source package.json:'
head -10 package.json
echo 'Recompiling TypeScript...'
npm run compile
echo 'Source extension recompiled'

echo ''
echo '=== FRESH EXTENSION INSTALLATION ==='
mkdir -p /home/coder/.local/share/code-server/extensions
echo 'Copying fresh extension with correct structure...'
cp -r /home/coder/extensions/cradle-business-suite /home/coder/.local/share/code-server/extensions/
chown -R coder:coder /home/coder/.local/share/code-server/extensions/
chmod -R 755 /home/coder/.local/share/code-server/extensions/
echo 'Fresh extension installed'

echo ''
echo '=== VERIFICATION ==='
echo 'Installed extension details:'
if [ -f '/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json' ]; then
    echo 'Publisher:' 
    grep '\"publisher\"' /home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json || echo 'No publisher found'
    echo 'Activation Events:'
    grep -A3 'activationEvents' /home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json
    echo 'File timestamp:'
    ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/out/extension.js
    echo '✅ Extension installed successfully'
else
    echo '❌ Extension installation failed'
    exit 1
fi

echo ''
echo '=== STARTING FRESH CODE-SERVER ==='
export PATH=/root/.nvm/versions/node/v20.19.4/bin:\$PATH
cd /home/coder
nohup code-server --bind-addr '0.0.0.0:8080' --auth password --disable-telemetry --disable-update-check --extensions-dir=/home/coder/.local/share/code-server/extensions /home/coder > /tmp/code-server.log 2>&1 &

echo 'Waiting for VS Code startup...'
sleep 15

echo 'Code-server status:'
ps aux | grep code-server | grep -v grep || echo 'Not running'

echo 'Recent startup logs:'
tail -30 /tmp/code-server.log 2>/dev/null || echo 'No logs found'
"

EOF

echo "✅ Force extension replacement completed!"
echo "🌐 Access https://cradlesystems.xyz to test"
echo "🔍 Look for extension activation messages and TreeView"