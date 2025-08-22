#!/bin/bash

# Check Cradle Business Extension Logs Script
# Checks extension host logs and activation status for cradle-business-extension

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

echo "🔍 Checking Cradle Business Extension Activation Status..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Check extension logs and status
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Extension Files Check:"
docker exec vsc-hetzner-app ls -la /home/coder/.local/share/code-server/extensions/cradle-business-extension/

echo ""
echo "📋 Package.json Content:"
docker exec vsc-hetzner-app cat /home/coder/.local/share/code-server/extensions/cradle-business-extension/package.json

echo ""
echo "🚀 Extension Build Output Check:"
docker exec vsc-hetzner-app ls -la /home/coder/.local/share/code-server/extensions/cradle-business-extension/out/

echo ""
echo "🔍 Extension Host Logs (VS Code logs):"
docker exec vsc-hetzner-app bash -c "
echo 'Finding VS Code log files...'
find /home/coder/.local/share/code-server/logs -name '*log' -type f 2>/dev/null | head -10
echo ''
echo 'Checking extension host logs for activation messages...'
find /home/coder/.local/share/code-server/logs -name '*log' -type f -exec grep -l -i 'cradle\|extension' {} \; 2>/dev/null | head -5 | xargs -I {} sh -c 'echo \"=== {} ===\" && tail -20 \"{}\"'
"

echo ""
echo "💻 Code-Server Container Logs (looking for extension activation):"
docker logs vsc-hetzner-app 2>&1 | grep -i -E 'cradle|extension|activate|venture|mezzpro' | tail -30 || echo "No extension activation logs found"

echo ""
echo "🔍 Manual Extension Test:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Testing extension files...'
echo 'Extension directory:'
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-extension/
echo ''
echo 'Compiled output:'
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-extension/out/ 2>/dev/null || echo 'No out directory found'
echo ''
echo 'Extension manifest check:'
node -e 'console.log(JSON.stringify(require(\"/home/coder/.local/share/code-server/extensions/cradle-business-extension/package.json\"), null, 2))' 2>/dev/null | head -50 || echo 'Could not read package.json'
echo ''
echo 'Extension main file check:'
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-extension/out/extension.js 2>/dev/null || echo 'Extension.js not found'
"

echo ""
echo "🧭 Current Workspace Check:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Checking workspace folders:'
ls -la /home/coder/workspace-* 2>/dev/null || echo 'No workspace folders found'
echo ''
echo 'Current working directory:'
pwd
"

echo ""
echo "🎯 Debug: Extension Activation Simulation:"
docker exec -u coder vsc-hetzner-app bash -c "
echo 'Trying to manually load extension...'
node -e 'try { console.log(\"Extension file exists:\", require(\"fs\").existsSync(\"/home/coder/.local/share/code-server/extensions/cradle-business-extension/out/extension.js\")); } catch(e) { console.log(\"Error:\", e.message); }'
"

EOF

echo "✅ Cradle Extension log check completed!"