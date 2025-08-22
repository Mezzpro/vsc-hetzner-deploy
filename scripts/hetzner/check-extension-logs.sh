#!/bin/bash

# Check Extension Activation Logs Script
# Checks extension host logs and activation status

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

echo "🔍 Checking Extension Activation Status..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Check extension logs and status
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Extension Files Check:"
docker exec vsc-hetzner-app ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/

echo ""
echo "📋 Package.json Content:"
docker exec vsc-hetzner-app cat /home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json

echo ""
echo "🚀 Extension Host Logs (last 50 lines):"
docker exec vsc-hetzner-app bash -c "
find /tmp -name '*vscode*' -type f -exec grep -l 'cradle' {} \; 2>/dev/null | head -5
find /home/coder -name '*log*' -type f 2>/dev/null | head -5
"

echo ""
echo "💻 Code-Server Logs (looking for extension activation):"
docker logs vsc-hetzner-app 2>&1 | grep -i -E 'cradle|extension|activate' | tail -20 || echo "No extension activation logs found"

echo ""
echo "🔍 Manual Extension Activation Test:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Testing extension activation manually...'
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/out/
echo 'Checking if extension.js exists and is executable:'
file /home/coder/.local/share/code-server/extensions/cradle-business-suite/out/extension.js
echo 'Extension manifest check:'
node -e 'console.log(JSON.stringify(require(\"/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json\"), null, 2))' | head -30
"

EOF

echo "✅ Extension log check completed!"