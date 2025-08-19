#!/bin/bash

# Check SSL Certificate Status Script
# Monitors SSL certificate health and expiration

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
    echo "❌ Error: Missing Hetzner configuration!"
    exit 1
fi

# SSH options
SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🔒 Checking SSL certificate status..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"
echo "═══════════════════════════════════════"

# Test SSH connection first
if ! ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'echo "Connected"' >/dev/null 2>&1; then
    echo "❌ SSH connection failed"
    exit 1
fi

# Check SSL certificate status on server
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'bash -s' << EOF
#!/bin/bash

echo "🔍 CERTIFICATE STATUS"
echo "─────────────────────────────────────"

# Check if certbot is installed
if which certbot >/dev/null 2>&1; then
    echo "✅ Certbot installed: \$(certbot --version 2>/dev/null | head -1)"
else
    echo "❌ Certbot not installed"
    exit 1
fi

# List certificates
echo ""
echo "📜 INSTALLED CERTIFICATES"
echo "─────────────────────────────────────"
if sudo certbot certificates 2>/dev/null | grep -q "Certificate Name"; then
    sudo certbot certificates 2>/dev/null | grep -E "(Certificate Name|Domains|Expiry Date|Certificate Path)" | sed 's/^/   /'
else
    echo "❌ No certificates found"
fi

# Check certificate files
echo ""
echo "📁 CERTIFICATE FILES"
echo "─────────────────────────────────────"
if [ -d "/etc/ssl/vsc-certs" ]; then
    echo "✅ SSL certificate directory exists"
    ls -la /etc/ssl/vsc-certs | sed 's/^/   /'
    
    # Check certificate validity
    if [ -f "/etc/ssl/vsc-certs/fullchain.pem" ]; then
        echo ""
        echo "🔍 Certificate details:"
        openssl x509 -in /etc/ssl/vsc-certs/fullchain.pem -noout -dates -subject -issuer 2>/dev/null | sed 's/^/   /' || echo "   ❌ Cannot read certificate"
    fi
else
    echo "❌ SSL certificate directory not found"
fi

# Check renewal configuration
echo ""
echo "⏰ RENEWAL CONFIGURATION"
echo "─────────────────────────────────────"
if crontab -l 2>/dev/null | grep -q "certbot renew"; then
    echo "✅ Auto-renewal configured in crontab:"
    crontab -l 2>/dev/null | grep "certbot" | sed 's/^/   /'
else
    echo "❌ Auto-renewal not configured"
fi

# Test renewal (dry run)
echo ""
echo "🧪 RENEWAL TEST"
echo "─────────────────────────────────────"
echo "Running dry-run renewal test..."
if sudo certbot renew --dry-run 2>/dev/null; then
    echo "✅ Renewal test successful"
else
    echo "⚠️  Renewal test failed - certificates may need manual attention"
fi

# Check Docker SSL setup
echo ""
echo "🐳 DOCKER SSL CONFIGURATION"
echo "─────────────────────────────────────"
cd ~/vsc-deploy/vsc-hetzner-deploy/app 2>/dev/null || cd ~/vsc-deploy/vsc-hetzner-deploy 2>/dev/null || echo "❌ Cannot find deployment directory"

if [ -f "docker-compose.yml" ]; then
    if grep -q "nginx-ssl" docker-compose.yml; then
        echo "✅ SSL-enabled Docker configuration found"
        
        # Check if SSL containers are running
        if docker-compose ps 2>/dev/null | grep -q "nginx-ssl.*Up"; then
            echo "✅ SSL nginx container running"
        else
            echo "⚠️  SSL nginx container not running"
            docker-compose ps 2>/dev/null | grep nginx || echo "   No nginx containers found"
        fi
        
        if docker-compose ps 2>/dev/null | grep -q "vsc-hetzner.*Up"; then
            echo "✅ Main application container running"
        else
            echo "⚠️  Main application container not running"
        fi
    else
        echo "⚠️  Standard Docker configuration (no SSL nginx)"
    fi
else
    echo "❌ docker-compose.yml not found"
fi

echo ""
echo "🌐 NETWORK TESTS"
echo "─────────────────────────────────────"

# Test local HTTPS
echo "Testing local HTTPS connection..."
if curl -k -s -I "https://localhost" >/dev/null 2>&1; then
    echo "✅ Local HTTPS responding"
else
    echo "⚠️  Local HTTPS not responding"
fi

# Test HTTP to HTTPS redirect
echo "Testing HTTP to HTTPS redirect..."
redirect_test=\$(curl -s -I "http://localhost" 2>/dev/null | grep -i "location.*https" || echo "no-redirect")
if [[ "\$redirect_test" != "no-redirect" ]]; then
    echo "✅ HTTP redirects to HTTPS"
else
    echo "⚠️  HTTP does not redirect to HTTPS"
fi

# Check firewall
echo ""
echo "🔥 FIREWALL STATUS"
echo "─────────────────────────────────────"
if which ufw >/dev/null 2>&1; then
    echo "UFW status:"
    sudo ufw status 2>/dev/null | grep -E "(443|80|22)" | sed 's/^/   /' || echo "   No relevant rules found"
else
    echo "UFW not installed"
fi

# Check ports
echo ""
echo "🔌 PORT STATUS"
echo "─────────────────────────────────────"
echo "Listening ports:"
netstat -tln | grep -E ":(443|80|3000)" | sed 's/^/   /' || echo "   No SSL/HTTP ports found"
EOF

echo ""
echo "🌍 EXTERNAL SSL TESTS"
echo "─────────────────────────────────────"

# Test external domain SSL (if domains are configured)
domains=("$DOMAIN_CRADLE" "$DOMAIN_MEZZPRO" "$DOMAIN_MINQRO")

for domain in "${domains[@]}"; do
    if [ -n "$domain" ]; then
        echo "Testing $domain..."
        
        # Test SSL certificate
        ssl_info=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -dates -subject 2>/dev/null || echo "failed")
        
        if [[ "$ssl_info" != "failed" ]]; then
            echo "✅ $domain SSL certificate valid"
            echo "$ssl_info" | sed 's/^/   /'
        else
            echo "⚠️  $domain SSL certificate issues or domain not accessible"
        fi
        
        # Test HTTPS response
        if curl -s --connect-timeout 10 -I "https://$domain" >/dev/null 2>&1; then
            echo "✅ $domain HTTPS accessible"
        else
            echo "⚠️  $domain HTTPS not accessible"
        fi
        echo ""
    fi
done

echo "🎯 SUMMARY"
echo "─────────────────────────────────────"
echo "💡 For detailed SSL analysis, visit:"
echo "   https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN_CRADLE"
echo "   https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN_MEZZPRO"
echo "   https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN_MINQRO"
echo ""
echo "🔧 To renew certificates manually:"
echo "   ssh $HETZNER_USER@$HETZNER_IP 'sudo certbot renew'"
echo ""
echo "📊 To check application status:"
echo "   ./scripts/hetzner/server-status.sh"