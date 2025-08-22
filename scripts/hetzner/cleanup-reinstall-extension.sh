#!/bin/bash

# Cleanup and Reinstall Cradle Business Suite Extension
# Removes cached extension and installs updated source version

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

echo "🧹 Cleaning up and reinstalling Cradle Business Suite Extension..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Cleanup and reinstall extension
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Extension Cleanup and Reinstall Process:"
docker exec -u coder vsc-hetzner-app bash -c "
echo '=== BEFORE CLEANUP ==='
echo 'Current installed extension info:'
if [ -f '/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json' ]; then
    echo 'Installed version timestamp:'
    ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/out/extension.js
    echo 'Installed activation events:'
    grep -A3 'activationEvents' /home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json
else
    echo 'Extension not currently installed'
fi

echo ''
echo 'Source extension info:'
if [ -f '/home/coder/extensions/cradle-business-suite/package.json' ]; then
    echo 'Source version timestamp:'
    ls -la /home/coder/extensions/cradle-business-suite/out/extension.js
    echo 'Source activation events:'
    grep -A3 'activationEvents' /home/coder/extensions/cradle-business-suite/package.json
else
    echo 'Source extension not found!'
    exit 1
fi

echo ''
echo '=== STOPPING CODE-SERVER ==='
echo 'Stopping all VS Code processes...'
pkill -f code-server || echo 'Code-server not running'
pkill -f extensionHost || echo 'Extension host not running'
sleep 3

echo ''
echo '=== CLEANING UP OLD EXTENSION ==='
echo 'Removing old extension installation...'
rm -rf /home/coder/.local/share/code-server/extensions/cradle-business-suite
echo 'Old extension removed successfully'

echo ''
echo '=== INSTALLING UPDATED EXTENSION ==='
echo 'Copying updated source extension...'
cp -r /home/coder/extensions/cradle-business-suite /home/coder/.local/share/code-server/extensions/
echo 'Extension copied successfully'

echo 'Setting proper permissions...'
chmod -R 755 /home/coder/.local/share/code-server/extensions/cradle-business-suite/
chown -R coder:coder /home/coder/.local/share/code-server/extensions/cradle-business-suite/
echo 'Permissions set successfully'

echo ''
echo '=== VERIFICATION ==='
echo 'Verifying installation:'
if [ -f '/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json' ]; then
    echo 'New installed version timestamp:'
    ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/out/extension.js
    echo 'New installed activation events:'
    grep -A3 'activationEvents' /home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json
    echo '✅ Extension installed successfully with updated configuration!'
else
    echo '❌ Extension installation failed!'
    exit 1
fi

echo ''
echo '=== STARTING CODE-SERVER ==='
echo 'Starting code-server with extension reload...'
nohup code-server --bind-addr '0.0.0.0:8080' --auth password --disable-telemetry --disable-update-check /home/coder > /tmp/code-server.log 2>&1 &

echo 'Waiting for startup...'
sleep 10

echo 'Checking if code-server started:'
ps aux | grep code-server | grep -v grep || echo 'Code-server not found - checking logs...'

echo ''
echo 'Recent startup logs:'
tail -20 /tmp/code-server.log 2>/dev/null || echo 'No logs found'
"

echo ""
echo "🔍 Final Verification:"
docker exec vsc-hetzner-app bash -c "
echo 'Extension installation status:'
ls -la /home/coder/.local/share/code-server/extensions/ | grep cradle || echo 'Cradle extension not found'

echo ''
echo 'Extension validation:'
if [ -f '/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json' ]; then
    node -e \"
    const pkg = JSON.parse(require('fs').readFileSync('/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json', 'utf8'));
    console.log('✅ Extension Name:', pkg.name);
    console.log('✅ Extension Version:', pkg.version);
    console.log('✅ Activation Events:', pkg.activationEvents);
    console.log('✅ Main File Exists:', require('fs').existsSync('/home/coder/.local/share/code-server/extensions/cradle-business-suite/' + pkg.main));
    console.log('✅ Commands Count:', pkg.contributes?.commands?.length || 0);
    \" 2>/dev/null || echo 'Validation failed'
else
    echo '❌ Extension package.json not found'
fi

echo ''
echo 'Code-server process status:'
ps aux | grep -E 'code-server|extensionHost' | head -3
"

EOF

echo "✅ Extension cleanup and reinstall completed!"
echo "🌐 Try accessing https://cradlesystems.xyz now"
echo "🔍 Look for extension activation notifications and Business Navigation in sidebar"
echo "⏳ Wait 30 seconds for extension host to fully initialize"