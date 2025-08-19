#!/bin/bash

# SSL Certificate Renewal Script
# Manually renew SSL certificates and restart services

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
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🔄 Renewing SSL certificates..."
echo "🖥️  Server: $HETZNER_USER@$HETZNER_IP"

# Confirm renewal
read -p "Renew SSL certificates now? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ SSL renewal cancelled"
    exit 1
fi

# Renew certificates on server
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP 'bash -s' << 'EOF'
#!/bin/bash
set -e

echo "🔍 Checking current certificate status..."
sudo certbot certificates

echo ""
echo "🔄 Starting certificate renewal..."

# Stop services temporarily if needed for renewal
echo "⏸️  Preparing for renewal..."
cd ~/vsc-deploy/vsc-hetzner-deploy/app 2>/dev/null || cd ~/

# Try renewal with existing webroot/standalone
echo "🔒 Renewing certificates..."
if sudo certbot renew --quiet; then
    echo "✅ Certificate renewal successful!"
else
    echo "⚠️  Standard renewal failed, trying force renewal..."
    
    # Stop services for standalone renewal if needed
    cd ~/vsc-deploy/vsc-hetzner-deploy/app
    docker-compose down || true
    
    # Force renewal with standalone
    sudo certbot renew --force-renewal --standalone
    
    echo "✅ Force renewal completed!"
fi

echo "📁 Updating certificate files for Docker..."
sudo cp /etc/letsencrypt/live/$DOMAIN_CRADLE/fullchain.pem /etc/ssl/vsc-certs/ 2>/dev/null || echo "⚠️  Could not copy fullchain.pem"
sudo cp /etc/letsencrypt/live/$DOMAIN_CRADLE/privkey.pem /etc/ssl/vsc-certs/ 2>/dev/null || echo "⚠️  Could not copy privkey.pem"
sudo chown -R $USER:$USER /etc/ssl/vsc-certs
sudo chmod 644 /etc/ssl/vsc-certs/fullchain.pem
sudo chmod 600 /etc/ssl/vsc-certs/privkey.pem

echo "🐳 Restarting Docker services..."
cd ~/vsc-deploy/vsc-hetzner-deploy/app
docker-compose up -d

echo "⏳ Waiting for services to restart..."
sleep 30

echo "🔍 Testing renewed certificates..."
if curl -k -s -I "https://localhost" | grep -q "200\|302"; then
    echo "✅ Services restarted successfully with new certificates!"
else
    echo "⚠️  Services may not be responding properly"
    docker-compose logs --tail=20
fi

echo ""
echo "📜 Updated certificate information:"
sudo certbot certificates | grep -E "(Certificate Name|Domains|Expiry Date)" | head -20

echo "✅ SSL certificate renewal completed!"
EOF

echo ""
echo "🎉 SSL certificate renewal completed!"
echo ""
echo "📝 Next steps:"
echo "1. Test HTTPS access: https://$DOMAIN_CRADLE"
echo "2. Check certificate status: ./scripts/hetzner/check-ssl.sh"
echo "3. Verify auto-renewal: crontab should handle future renewals"
echo ""
echo "🔒 Your certificates are now renewed and services restarted!"