# DNS Setup Guide

This guide shows you how to configure DNS at Spaceship.com to point your domains to your Hetzner server.

## Your Server IP Address
First, get your Hetzner server's public IP address:
```bash
# From your local machine, check connection script
./scripts/hetzner/check-connection.sh
```
Or SSH into your server and run:
```bash
curl ifconfig.me
```

## Spaceship.com DNS Configuration

### Step 1: Login to Spaceship
1. Go to [spaceship.com](https://spaceship.com)
2. Login to your account
3. Navigate to "My Domains"

### Step 2: Configure Each Domain
For **each domain** (cradlesystems.xyz, mezzpro.xyz, minqro.xyz):

#### Domain Management
1. Click on the domain name
2. Find "DNS Management" or "DNS Records"
3. Click "Manage DNS" or "Add Record"

#### Add A Records
Add these DNS records for each domain:

**Root Domain Record:**
```
Type: A
Name: @ 
Value: [YOUR_HETZNER_SERVER_IP]
TTL: 300
```

**WWW Subdomain Record:**
```
Type: A  
Name: www
Value: [YOUR_HETZNER_SERVER_IP] 
TTL: 300
```

### Step 3: Example Configuration

If your Hetzner server IP is `49.12.34.56`, add these records:

#### For cradlesystems.xyz:
- Type: A, Name: @, Value: 49.12.34.56, TTL: 300
- Type: A, Name: www, Value: 49.12.34.56, TTL: 300

#### For mezzpro.xyz:
- Type: A, Name: @, Value: 49.12.34.56, TTL: 300  
- Type: A, Name: www, Value: 49.12.34.56, TTL: 300

#### For minqro.xyz:
- Type: A, Name: @, Value: 49.12.34.56, TTL: 300
- Type: A, Name: www, Value: 49.12.34.56, TTL: 300

## DNS Propagation

### Timing
- **TTL 300** = 5 minutes minimum propagation
- **Global propagation** = 15 minutes to 2 hours typically
- **Complete propagation** = Up to 24-48 hours maximum

### Check Propagation Status
Test if DNS is working:

**Online Tools:**
- https://dnschecker.org - Enter your domain
- https://whatsmydns.net - Global DNS checker

**Command Line:**
```bash
# Test DNS resolution
nslookup cradlesystems.xyz
nslookup mezzpro.xyz  
nslookup minqro.xyz

# Test with specific DNS server
nslookup cradlesystems.xyz 8.8.8.8
```

## Testing Your Setup

### 1. Test Direct IP Access
```bash
# Should work immediately after deployment
curl -I http://[YOUR_HETZNER_IP]:3000
```

### 2. Test Domain Access (after DNS propagation)
```bash
# Test each domain 
curl -I http://cradlesystems.xyz:3000
curl -I http://mezzpro.xyz:3000
curl -I http://minqro.xyz:3000
```

### 3. Browser Testing
After DNS propagation, visit:
- http://cradlesystems.xyz:3000 (white theme)
- http://mezzpro.xyz:3000 (green matrix theme)
- http://minqro.xyz:3000 (blue tech theme)

## Troubleshooting DNS

### Common Issues

**DNS Not Propagating:**
- Wait longer (up to 24-48 hours)
- Clear your local DNS cache: `ipconfig /flushdns` (Windows)
- Try different DNS servers (8.8.8.8, 1.1.1.1)

**Wrong IP Address:**
- Double-check your Hetzner server IP
- Verify server is running: `./scripts/hetzner/server-status.sh`

**TTL Too High:**
- Lower TTL to 300 for faster changes
- Wait for old TTL to expire before testing

**Domain Not Owned:**
- Verify you own the domain at Spaceship
- Check domain expiration date

### Advanced Troubleshooting

**Check DNS Resolution:**
```bash
dig cradlesystems.xyz A
dig mezzpro.xyz A
dig minqro.xyz A
```

**Check Server Accessibility:**
```bash
telnet [YOUR_HETZNER_IP] 3000
```

**Check Application Logs:**
```bash
./scripts/hetzner/server-status.sh
```

## Port 80 Setup (Optional)

To access domains without `:3000`, you need to run on port 80:

### 1. Update Docker Compose
In `app/docker-compose.yml`:
```yaml
ports:
  - "80:3000"  # Map port 80 to container port 3000
```

### 2. Update Firewall 
```bash
sudo ufw allow 80/tcp
```

### 3. Redeploy
```bash
./scripts/hetzner/deploy-app.sh
```

Then access domains directly:
- http://cradlesystems.xyz
- http://mezzpro.xyz  
- http://minqro.xyz

## Next Steps

After DNS is configured and working:

1. **Test all domains** and theme switching
2. **Set up SSL certificates** (optional)
3. **Configure automated backups**
4. **Set up monitoring and alerts**

Need help? Check the troubleshooting guide or server status scripts.