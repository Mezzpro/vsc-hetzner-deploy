#!/bin/bash

# Fix Extension Installation - Proper VS Code Extension Format
# Ensures extension is installed in the correct format for VS Code recognition

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

echo "🔧 Fixing Extension Installation Format..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Fix extension installation
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Checking Current Extension Status:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Current extensions directory:'
ls -la /home/coder/.local/share/code-server/extensions/

echo 'Extension manifest check:'
cat /home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json | head -20

echo 'Extension files structure:'
find /home/coder/.local/share/code-server/extensions/cradle-business-suite -type f | head -20
"

echo ""
echo "🚀 Installing Extension Properly:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Stopping all VS Code processes...'
pkill -f code-server || true
pkill -f extensionHost || true
sleep 3

echo 'Removing old extension installation...'
rm -rf /home/coder/.local/share/code-server/extensions/cradle-business-suite

echo 'Creating proper extension directory structure...'
mkdir -p /home/coder/.local/share/code-server/extensions/cradle-business-suite-1.0.0

echo 'Copying extension with version folder name...'
cp -r /home/coder/extensions/cradle-business-suite/* /home/coder/.local/share/code-server/extensions/cradle-business-suite-1.0.0/

echo 'Setting proper permissions...'
chmod -R 755 /home/coder/.local/share/code-server/extensions/cradle-business-suite-1.0.0/
chown -R coder:coder /home/coder/.local/share/code-server/extensions/cradle-business-suite-1.0.0/

echo 'Extension installed, checking result:'
ls -la /home/coder/.local/share/code-server/extensions/
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite-1.0.0/

echo 'Starting code-server...'
nohup code-server --bind-addr '0.0.0.0:8080' --auth password --disable-telemetry --disable-update-check /home/coder > /tmp/code-server.log 2>&1 &

echo 'Waiting for startup...'
sleep 10

echo 'Checking if code-server started:'
ps aux | grep code-server | grep -v grep || echo 'Code-server not found'

echo 'Checking extension host:'
ps aux | grep extensionHost | grep -v grep || echo 'Extension host not started yet'
"

echo ""
echo "🔍 Verification:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Final extension directory:'
ls -la /home/coder/.local/share/code-server/extensions/

echo 'Code-server processes:'
ps aux | grep -E 'code-server|extensionHost' | head -10
"

EOF

echo "✅ Extension installation fix completed!"
echo "🌐 Try accessing https://cradlesystems.xyz now"
echo "⏳ Wait 30 seconds for extension host to fully start"