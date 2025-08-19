# SSL Certificate Setup Guide

Complete guide to setting up Let's Encrypt SSL certificates for your VSC Hetzner deployment.

## Prerequisites

### Before Setting Up SSL:
- ✅ **Server deployed** and running successfully
- ✅ **DNS configured** and fully propagated (24-48 hours)
- ✅ **Domains accessible** via HTTP (test first)
- ✅ **Email configured** in `.env` file for certificate notifications

### Test Prerequisites:
```bash
# 1. Test server is running
./scripts/hetzner/server-status.sh

# 2. Test domains are accessible via HTTP
curl -I http://cradlesystems.xyz:3000
curl -I http://mezzpro.xyz:3000  
curl -I http://minqro.xyz:3000

# 3. Verify DNS propagation
nslookup cradlesystems.xyz
```

---

## Step 1: Configure Environment

### 1.1 Update .env File
```bash
# Edit your .env file
nano .env
```

**Ensure these SSL settings are configured:**
```bash
# Email for Let's Encrypt notifications
EMAIL_FOR_SSL=your-email@example.com

# Enable SSL (will be set to true after setup)
ENABLE_SSL=false

# Your domains (should already be configured)
DOMAIN_CRADLE=cradlesystems.xyz
DOMAIN_MEZZPRO=mezzpro.xyz  
DOMAIN_MINQRO=minqro.xyz
```

### 1.2 Make SSL Scripts Executable
```bash
chmod +x scripts/hetzner/setup-ssl.sh
chmod +x scripts/hetzner/check-ssl.sh
chmod +x scripts/hetzner/renew-ssl.sh
```

---

## Step 2: SSL Certificate Generation

### 2.1 Run SSL Setup
```bash
./scripts/hetzner/setup-ssl.sh
```

**This script will:**
1. Install Certbot on your server
2. Test domain accessibility 
3. Stop services temporarily
4. Generate Let's Encrypt certificates for all domains
5. Set up automatic renewal via cron
6. Configure Docker with SSL support
7. Start SSL-enabled services

### 2.2 What Happens During Setup
```
🔒 Setting up SSL certificates for your domains...
📧 Email: your-email@example.com
🌐 Domains: cradlesystems.xyz, mezzpro.xyz, minqro.xyz

⚠️  IMPORTANT: Ensure your domains are already pointing to 1.2.3.4
   - DNS A records must be configured first
   - DNS propagation must be complete

Have you configured DNS and waited for propagation? (y/N): y

📦 Installing Certbot...
🔍 Testing domain connectivity...
✅ cradlesystems.xyz is accessible
✅ mezzpro.xyz is accessible  
✅ minqro.xyz is accessible

🔒 Generating SSL certificates...
⏸️  Stopping services temporarily...
✅ SSL certificates generated!

🔧 Setting up certificate renewal...
📁 Creating SSL certificate directory for Docker...
🔄 Updating Docker configuration for SSL...
🚀 Starting SSL-enabled services...
✅ SSL certificate setup completed!
```

### 2.3 Expected Duration
- **Certificate generation**: 2-5 minutes
- **Service reconfiguration**: 2-3 minutes
- **Total time**: 5-10 minutes

---

## Step 3: Verification

### 3.1 Check SSL Status
```bash
./scripts/hetzner/check-ssl.sh
```

**Should show:**
- ✅ Certbot installed
- ✅ Certificates for all domains
- ✅ Auto-renewal configured  
- ✅ SSL-enabled Docker configuration
- ✅ Local HTTPS responding
- ✅ HTTP redirects to HTTPS

### 3.2 Test HTTPS Access

**Browser testing:**
- https://cradlesystems.xyz (clean white theme)
- https://mezzpro.xyz (matrix green theme)
- https://minqro.xyz (blue tech theme)

**Command line testing:**
```bash
curl -I https://cradlesystems.xyz
curl -I https://mezzpro.xyz
curl -I https://minqro.xyz
```

### 3.3 Verify SSL Certificate Quality
Test your SSL setup:
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- Enter each domain for detailed analysis
- Should get **A** or **A+** rating

---

## Step 4: SSL Configuration Details

### 4.1 Certificate Locations
**On server:**
- Original certificates: `/etc/letsencrypt/live/DOMAIN/`
- Docker-accessible: `/etc/ssl/vsc-certs/`

### 4.2 Docker Configuration
**SSL setup creates:**
- `nginx-ssl` container for HTTPS termination
- Port 443 mapping for SSL
- Automatic HTTP → HTTPS redirect
- SSL certificate mounting

### 4.3 Auto-Renewal
**Configured via cron:**
```bash
# Runs every 12 hours
0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'cd ~/vsc-deploy/vsc-hetzner-deploy/app && docker-compose restart'
```

---

## Step 5: Maintenance

### 5.1 Check Certificate Status
```bash
# Comprehensive SSL health check
./scripts/hetzner/check-ssl.sh

# Quick certificate expiration check
ssh user@server 'sudo certbot certificates'
```

### 5.2 Manual Certificate Renewal
```bash
# Renew certificates manually if needed
./scripts/hetzner/renew-ssl.sh
```

### 5.3 Certificate Expiration
- **Let's Encrypt certificates**: Valid for 90 days
- **Auto-renewal**: Attempts every 12 hours  
- **Renewal threshold**: Certificates within 30 days of expiry
- **Email notifications**: Sent to configured email

---

## Troubleshooting

### Common SSL Issues

#### 1. Domain Not Accessible During Setup
**Error**: "domain is not accessible"
```bash
# Check DNS propagation
nslookup cradlesystems.xyz 8.8.8.8

# Test HTTP access  
curl -I http://cradlesystems.xyz:3000

# Wait for DNS propagation (up to 48 hours)
```

#### 2. Certificate Generation Failed
**Error**: "Certbot certificate generation failed"
```bash
# Check domain ownership
curl -I http://cradlesystems.xyz

# Verify no other services on port 80
ssh user@server 'sudo netstat -tln | grep :80'

# Try manual certificate generation
ssh user@server 'sudo certbot certonly --standalone -d cradlesystems.xyz'
```

#### 3. Services Won't Start After SSL Setup
**Error**: Docker containers failing to start
```bash
# Check Docker logs
ssh user@server '
  cd ~/vsc-deploy/vsc-hetzner-deploy/app
  docker-compose logs
'

# Restart services
ssh user@server '
  cd ~/vsc-deploy/vsc-hetzner-deploy/app
  docker-compose down
  docker-compose up -d
'
```

#### 4. HTTPS Not Working
**Error**: Browser shows "connection refused" on HTTPS
```bash
# Check SSL containers
./scripts/hetzner/server-status.sh

# Check port 443
ssh user@server 'netstat -tln | grep :443'

# Test local HTTPS
ssh user@server 'curl -k -I https://localhost'
```

#### 5. Certificate Renewal Failing
**Error**: Auto-renewal not working
```bash
# Test renewal manually
ssh user@server 'sudo certbot renew --dry-run'

# Check cron configuration
ssh user@server 'crontab -l'

# Run manual renewal
./scripts/hetzner/renew-ssl.sh
```

### Advanced Troubleshooting

#### Check Certificate Details
```bash
# View certificate information
ssh user@server '
  openssl x509 -in /etc/ssl/vsc-certs/fullchain.pem -noout -text
'

# Check certificate chain
ssh user@server '
  openssl s_client -connect cradlesystems.xyz:443 -servername cradlesystems.xyz
'
```

#### Reset SSL Configuration
If SSL setup is completely broken:
```bash
# Remove SSL certificates
ssh user@server 'sudo rm -rf /etc/letsencrypt /etc/ssl/vsc-certs'

# Restore original Docker configuration  
ssh user@server '
  cd ~/vsc-deploy/vsc-hetzner-deploy/app
  cp docker-compose.yml.backup docker-compose.yml
  docker-compose down
  docker-compose up -d
'

# Start fresh SSL setup
./scripts/hetzner/setup-ssl.sh
```

---

## SSL Best Practices

### Security Configuration
- **TLS versions**: 1.2 and 1.3 only
- **Strong ciphers**: Modern cipher suites  
- **HSTS headers**: HTTP Strict Transport Security
- **Certificate monitoring**: Regular expiration checks

### Performance Optimization  
- **SSL session caching**: Reduces handshake overhead
- **HTTP/2 support**: Better performance over HTTPS
- **Certificate chain optimization**: Minimal chain length

### Monitoring and Alerts
- **Expiration monitoring**: 30-day warning alerts
- **SSL Labs testing**: Monthly security assessment
- **Auto-renewal logging**: Monitor renewal success
- **Certificate transparency**: Monitor CT logs

---

## Next Steps After SSL Setup

### 1. Update Application Settings
```bash
# Update .env to reflect SSL is enabled
ENABLE_SSL=true
```

### 2. Configure HSTS (Optional)
Add HTTP Strict Transport Security headers for enhanced security.

### 3. Set Up Monitoring
- Configure uptime monitoring for HTTPS endpoints
- Set up certificate expiration alerts
- Monitor SSL Labs ratings

### 4. Update Documentation
Update any internal documentation to use HTTPS URLs.

---

## SSL Management Commands

### Quick Reference
```bash
# Setup SSL certificates
./scripts/hetzner/setup-ssl.sh

# Check SSL status
./scripts/hetzner/check-ssl.sh

# Renew certificates manually  
./scripts/hetzner/renew-ssl.sh

# Test certificate renewal
ssh user@server 'sudo certbot renew --dry-run'

# View certificates
ssh user@server 'sudo certbot certificates'
```

Your VSC deployment now supports secure HTTPS access with automatic certificate renewal! 🔒✨