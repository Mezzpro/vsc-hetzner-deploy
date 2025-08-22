#!/bin/bash

# Check Extension Console Logs and Status
# Specifically looks for extension activation and error logs

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

echo "🔍 Checking Extension Console Logs..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Check extension logs and activation
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Extension Host Console Output:"
docker exec vsc-hetzner-app bash -c "
echo 'Looking for extension logs in log directory...'
find /home/coder/.local/share/code-server/logs -name '*ext*' -type f | head -10
echo 'Latest logs:'
find /home/coder/.local/share/code-server/logs -name '*exthost*' -exec cat {} \; 2>/dev/null | tail -50 || echo 'No extension host logs found'
"

echo ""
echo "🚀 Test Manual Extension Activation:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Testing extension.js syntax:'
node -c /home/coder/.local/share/code-server/extensions/cradle-business-suite/out/extension.js && echo 'Syntax OK' || echo 'Syntax Error'

echo 'Testing package.json validity:'
node -e 'console.log(\"Package OK:\", JSON.parse(require(\"fs\").readFileSync(\"/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json\", \"utf8\")).name)' 2>/dev/null || echo 'Package.json Error'

echo 'Extension directory permissions:'
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/

echo 'Code-server extension scanning test:'
ls -la /home/coder/.local/share/code-server/extensions/ | grep -E 'cradle|total'
"

echo ""
echo "📝 Check VS Code Extension Activation Logs:"
docker exec vsc-hetzner-app bash -c "
echo 'Searching for cradle activation logs...'
find /home/coder -name '*.log' -exec grep -l -i 'cradle\|extension' {} \; 2>/dev/null | head -5
echo 'Recent extension errors:'
find /home/coder/.local/share/code-server/logs -name '*.log' -exec grep -i 'error\|failed\|cradle' {} \; 2>/dev/null | tail -20 || echo 'No error logs found'
"

echo ""
echo "🔄 Force Extension Reload Test:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Checking current extension list...'
ls -la /home/coder/.local/share/code-server/extensions/
echo 'Trying to trigger extension host restart...'
pkill -f extensionHost || echo 'Extension host not found or already stopped'
sleep 2
echo 'Extension host should restart automatically...'
ps aux | grep extensionHost | head -5
"

EOF

echo "✅ Extension console check completed!"