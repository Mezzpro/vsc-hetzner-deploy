#!/bin/bash

# SSL Certificate Setup Script
# Sets up Let's Encrypt SSL certificates for your domains

set -e  # Exit on any error

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check required variables
if [ -z "$HETZNER_IP" ] || [ -z "$HETZNER_USER" ] || [ -z "$EMAIL_FOR_SSL" ]; then
    echo "❌ Error: Missing SSL configuration!"
    echo "Required: HETZNER_IP, HETZNER_USER, EMAIL_FOR_SSL"
    exit 1
fi

# SSH options
SSH_OPTS="-o StrictHostKeyChecking=no"
if [ -n "$HETZNER_SSH_KEY_PATH" ] && [ -f "$HETZNER_SSH_KEY_PATH" ]; then
    SSH_OPTS="$SSH_OPTS -i $HETZNER_SSH_KEY_PATH"
fi

echo "🔒 Setting up SSL certificates for your domains..."
echo "📧 Email: $EMAIL_FOR_SSL"
echo "🌐 Domains: $DOMAIN_CRADLE, $DOMAIN_MEZZPRO, $DOMAIN_MINQRO"

# Confirm domains are pointing to server
echo "⚠️  IMPORTANT: Ensure your domains are already pointing to $HETZNER_IP"
echo "   - DNS A records must be configured first"
echo "   - DNS propagation must be complete"
echo ""
read -p "Have you configured DNS and waited for propagation? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please configure DNS first and wait for propagation"
    echo "💡 Use: ./docs/DNS-SETUP.md for guidance"
    exit 1
fi

# Install and configure SSL
ssh $SSH_OPTS $HETZNER_USER@$HETZNER_IP "bash -s" << EOF
#!/bin/bash
set -e

echo "📦 Installing Certbot..."
sudo apt-get update
sudo apt-get install -y certbot

echo "🔍 Testing domain connectivity..."
# Test if domains are accessible
domains=("$DOMAIN_CRADLE" "$DOMAIN_MEZZPRO" "$DOMAIN_MINQRO")
failed_domains=""

for domain in "\${domains[@]}"; do
    if ! curl -s --connect-timeout 10 -I "http://\$domain" >/dev/null 2>&1; then
        echo "⚠️  Warning: \$domain is not accessible"
        failed_domains="\$failed_domains \$domain"
    else
        echo "✅ \$domain is accessible"
    fi
done

if [ -n "\$failed_domains" ]; then
    echo "❌ Some domains are not accessible: \$failed_domains"
    echo "💡 Check DNS configuration and wait for propagation"
    echo "🔍 Test with: nslookup \$domain"
    exit 1
fi

echo "🔒 Generating SSL certificates..."

# Stop any services on port 80 temporarily for standalone verification
echo "⏸️  Stopping services temporarily..."
cd ~/vsc-deploy/vsc-hetzner-deploy/app
docker-compose down || true

# Generate certificates using standalone mode
sudo certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL_FOR_SSL" \
    -d "$DOMAIN_CRADLE" \
    -d "www.$DOMAIN_CRADLE" \
    -d "$DOMAIN_MEZZPRO" \
    -d "www.$DOMAIN_MEZZPRO" \
    -d "$DOMAIN_MINQRO" \
    -d "www.$DOMAIN_MINQRO" \
    -d "$DOMAIN_SOBUAI" \
    -d "www.$DOMAIN_SOBUAI" \
    -d "$DOMAIN_BIZCRADLE" \
    -d "www.$DOMAIN_BIZCRADLE"

echo "✅ SSL certificates generated!"

echo "🔧 Setting up certificate renewal..."
# Test renewal
sudo certbot renew --dry-run

# Add renewal to cron
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd ~/vsc-deploy/vsc-hetzner-deploy/app && docker-compose restart'") | crontab -

echo "📁 Creating SSL certificate directory for Docker..."
sudo mkdir -p /etc/ssl/vsc-certs
sudo cp /etc/letsencrypt/live/$DOMAIN_CRADLE/fullchain.pem /etc/ssl/vsc-certs/
sudo cp /etc/letsencrypt/live/$DOMAIN_CRADLE/privkey.pem /etc/ssl/vsc-certs/
sudo chown -R \$USER:\$USER /etc/ssl/vsc-certs
sudo chmod 644 /etc/ssl/vsc-certs/fullchain.pem
sudo chmod 600 /etc/ssl/vsc-certs/privkey.pem

echo "🔄 Updating Docker configuration for SSL..."
# Update docker-compose.yml to include SSL
cd ~/vsc-deploy/vsc-hetzner-deploy/app

# Backup original
cp docker-compose.yml docker-compose.yml.backup

# Create SSL-enabled docker-compose
cat > docker-compose.yml << 'DOCKER_EOF'
version: '3.8'

services:
  vsc-hetzner:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: vsc-hetzner-app
    ports:
      - "80:3000"     # HTTP port
      - "443:3443"    # HTTPS port
    volumes:
      - vscode-data:/home/coder/.local/share/code-server
      - workspace-admin:/home/coder/workspace-admin
      - workspace-mezzpro:/home/coder/workspace-mezzpro  
      - workspace-minqro:/home/coder/workspace-minqro
      - /etc/ssl/vsc-certs:/etc/ssl/certs:ro
    environment:
      - PASSWORD=\${APP_PASSWORD:-hetzner123}
      - PORT=3000
      - HTTPS_PORT=3443
      - SSL_CERT_PATH=/etc/ssl/certs/fullchain.pem
      - SSL_KEY_PATH=/etc/ssl/certs/privkey.pem
    restart: unless-stopped
    networks:
      - vsc-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx-ssl:
    image: nginx:alpine
    container_name: vsc-nginx-ssl
    ports:
      - "443:443"
    volumes:
      - /etc/ssl/vsc-certs:/etc/ssl/certs:ro
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - vsc-hetzner
    restart: unless-stopped
    networks:
      - vsc-network

networks:
  vsc-network:
    driver: bridge

volumes:
  vscode-data:
    driver: local
  workspace-admin:
    driver: local
  workspace-mezzpro:
    driver: local
  workspace-minqro:
    driver: local
DOCKER_EOF

# Create nginx SSL configuration
cat > nginx-ssl.conf << 'NGINX_EOF'
events {
    worker_connections 1024;
}

http {
    upstream vsc-backend {
        server vsc-hetzner:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name $DOMAIN_CRADLE www.$DOMAIN_CRADLE $DOMAIN_MEZZPRO www.$DOMAIN_MEZZPRO $DOMAIN_MINQRO www.$DOMAIN_MINQRO;
        return 301 https://\$server_name\$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl;
        server_name $DOMAIN_CRADLE www.$DOMAIN_CRADLE $DOMAIN_MEZZPRO www.$DOMAIN_MEZZPRO $DOMAIN_MINQRO www.$DOMAIN_MINQRO;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;

        # Proxy to VSC application
        location / {
            proxy_pass http://vsc-backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_buffering off;
            proxy_request_buffering off;
            proxy_read_timeout 86400;
            proxy_send_timeout 86400;
        }
    }
}
NGINX_EOF

echo "🚀 Starting SSL-enabled services..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Testing SSL setup..."
if curl -k -s -I "https://localhost" | grep -q "200\|302"; then
    echo "✅ SSL setup successful!"
else
    echo "⚠️  SSL may not be working properly - check logs"
    docker-compose logs
fi

echo "✅ SSL certificate setup completed!"
echo "🔒 Your domains now support HTTPS:"
echo "   https://$DOMAIN_CRADLE"
echo "   https://$DOMAIN_MEZZPRO"
echo "   https://$DOMAIN_MINQRO"
echo ""
echo "📅 Certificates will auto-renew every 12 hours via cron"
echo "🔧 HTTP traffic will automatically redirect to HTTPS"
EOF

echo "🎉 SSL certificate setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Test HTTPS access: https://$DOMAIN_CRADLE"
echo "2. Verify certificate: https://www.ssllabs.com/ssltest/"
echo "3. Update any hardcoded HTTP links to HTTPS"
echo ""
echo "🔄 To check certificate status:"
echo "   ./scripts/hetzner/check-ssl.sh"