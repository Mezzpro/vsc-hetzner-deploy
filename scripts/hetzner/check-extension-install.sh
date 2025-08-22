#!/bin/bash

# Check Extension Installation Details Script
# Diagnoses why the extension isn't properly installed

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

echo "🔍 Diagnosing Extension Installation..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Detailed extension check
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Source Extension Location:"
ls -la /home/coder/extensions/cradle-business-suite/

echo ""
echo "📁 Target Extensions Directory:"
ls -la /home/coder/.local/share/code-server/extensions/

echo ""
echo "🏗️ Manual Copy Test:"
docker exec vsc-hetzner-app bash -c "
echo 'Testing manual copy...'
mkdir -p /home/coder/.local/share/code-server/extensions/
cp -r /home/coder/extensions/cradle-business-suite /home/coder/.local/share/code-server/extensions/
echo 'Copy completed, checking result:'
ls -la /home/coder/.local/share/code-server/extensions/
echo 'Extension files:'
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/
"

echo ""
echo "🔄 Restart Code-Server to Load Extension:"
docker exec vsc-hetzner-app bash -c "
echo 'Killing code-server processes...'
pkill -f code-server || true
echo 'Waiting 5 seconds...'
sleep 5
echo 'Starting code-server...'
nohup code-server --bind-addr '0.0.0.0:8080' --auth password --disable-telemetry --disable-update-check /home/coder > /dev/null 2>&1 &
echo 'Code-server restarted'
"

echo ""
echo "⏳ Waiting for code-server to start..."
sleep 10

echo ""
echo "🔍 Extension Host Process Check:"
docker exec vsc-hetzner-app ps aux | grep -E 'extensionHost|code-server' | head -10

EOF

echo "✅ Extension installation fix attempted!"
echo "🌐 Try accessing https://cradlesystems.xyz now"