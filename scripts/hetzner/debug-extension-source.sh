#!/bin/bash

# Debug Extension Source and Installation Path
# Tracks exactly where VS Code is loading the extension from

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check required variables
if [ -z "$HETZNER_IP" ] || [ -z "$$HETZNER_USER" ]; then
    echo "❌ Error: Missing required configuration!"
    echo "Required: HETZNER_IP, HETZNER_USER"
    exit 1
fi

# SSH options
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🔍 Debugging Extension Source and Installation..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Debug extension installation paths
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << 'EOF'
#!/bin/bash

echo "🔧 Extension Installation Path Analysis:"
docker exec vsc-hetzner-app bash -c "
echo '=== EXTENSION DIRECTORIES ==='
echo 'System extensions directory:'
ls -la /usr/lib/code-server/lib/vscode/extensions/ 2>/dev/null || echo 'Not found'

echo ''
echo 'User extensions directory:'
ls -la /home/coder/.local/share/code-server/extensions/

echo ''
echo 'VS Code extensions directory (alternative):'
ls -la /home/coder/.vscode-server/extensions/ 2>/dev/null || echo 'Not found'

echo ''
echo '=== CRADLE EXTENSION LOCATIONS ==='
echo 'Searching for cradle extension in all possible locations:'
find /home/coder -name '*cradle*' -type d 2>/dev/null
find /usr/lib/code-server -name '*cradle*' -type d 2>/dev/null || echo 'No system cradle extensions found'

echo ''
echo '=== SOURCE vs INSTALLED COMPARISON ==='
echo 'Source extension package.json:'
if [ -f '/home/coder/extensions/cradle-business-suite/package.json' ]; then
    echo 'Source activationEvents:'
    grep -A5 'activationEvents' /home/coder/extensions/cradle-business-suite/package.json
else
    echo 'Source extension not found!'
fi

echo ''
echo 'Installed extension package.json:'
if [ -f '/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json' ]; then
    echo 'Installed activationEvents:'
    grep -A5 'activationEvents' /home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json
else
    echo 'Installed extension not found!'
fi

echo ''
echo '=== DOCKER BUILD TIMESTAMP ANALYSIS ==='
echo 'Source extension build time:'
ls -la /home/coder/extensions/cradle-business-suite/out/extension.js 2>/dev/null || echo 'Source compiled extension not found'

echo ''
echo 'Installed extension build time:'
ls -la /home/coder/.local/share/code-server/extensions/cradle-business-suite/out/extension.js 2>/dev/null || echo 'Installed compiled extension not found'

echo ''
echo '=== VS CODE EXTENSION HOST SCANNING ==='
echo 'Code-server extension scanning logs:'
grep -r 'cradle' /home/coder/.local/share/code-server/logs/ 2>/dev/null | head -10 || echo 'No cradle references in logs'

echo ''
echo 'Extension host process check:'
ps aux | grep -E 'extensionHost|code-server' | head -5

echo ''
echo '=== MANUAL EXTENSION VERIFICATION ==='
echo 'Testing manual extension loading:'
node -e \"
const fs = require('fs');
const path = '/home/coder/.local/share/code-server/extensions/cradle-business-suite/package.json';
try {
    const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
    console.log('Extension name:', pkg.name);
    console.log('Extension version:', pkg.version);
    console.log('Activation events:', pkg.activationEvents);
    console.log('Main file:', pkg.main);
    console.log('Commands count:', pkg.contributes?.commands?.length || 0);
} catch(e) {
    console.error('Failed to parse:', e.message);
}
\" 2>/dev/null || echo 'Node.js validation failed'
"

echo ""
echo "🔍 Code-Server Extension Host Debug:"
docker exec vsc-hetzner-app bash -c "
echo 'Checking if extension host is recognizing our extension:'
echo 'Extension directories scanned by VS Code:'
find /home/coder/.local/share/code-server/extensions -maxdepth 1 -type d -name '*' | head -10

echo ''
echo 'Extension manifest validation:'
for ext_dir in /home/coder/.local/share/code-server/extensions/*/; do
    if [ -f \"\${ext_dir}package.json\" ]; then
        ext_name=\$(basename \"\$ext_dir\")
        echo \"Extension: \$ext_name\"
        node -e \"
        try {
            const pkg = JSON.parse(require('fs').readFileSync('\${ext_dir}package.json', 'utf8'));
            console.log('  Valid:', !!pkg.name && !!pkg.main);
            console.log('  Name:', pkg.name);
            console.log('  Main exists:', require('fs').existsSync('\${ext_dir}' + pkg.main));
        } catch(e) {
            console.log('  Invalid:', e.message);
        }
        \" 2>/dev/null || echo \"  Validation failed\"
    fi
done
"

EOF

echo "✅ Extension source debugging completed!"