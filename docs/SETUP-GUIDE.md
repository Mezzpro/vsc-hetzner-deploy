# Complete Setup Guide

Step-by-step guide to deploy VSC Coder Ventures to your Hetzner server with automatic GitHub deployment.

## Prerequisites

### What You Need:
- ✅ Hetzner VPS server (Ubuntu/Debian)
- ✅ SSH key pair for server access  
- ✅ GitHub personal access token
- ✅ Domains registered at Spaceship.com

### Server Requirements:
- **OS**: Ubuntu 20.04+ or Debian 10+
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB minimum  
- **Network**: Public IP address

---

## Step 1: Initial Setup

### 1.1 Clone This Repository
```bash
git clone https://github.com/YOUR_USERNAME/vsc-hetzner-deploy.git
cd vsc-hetzner-deploy
```

### 1.2 Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env
```

**Required settings in `.env`:**
```bash
# Hetzner Server
HETZNER_IP=your.server.ip.address
HETZNER_USER=your-username  
HETZNER_SSH_KEY_PATH=/path/to/your/private/key

# GitHub
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your-github-username
GITHUB_REPO_NAME=vsc-hetzner-deploy

# Application
APP_PASSWORD=your-secure-password-for-vscode
APP_PORT=3000

# Domains
DOMAIN_CRADLE=cradlesystems.xyz
DOMAIN_MEZZPRO=mezzpro.xyz  
DOMAIN_MINQRO=minqro.xyz
```

### 1.3 Make Scripts Executable
```bash
chmod +x scripts/github/*.sh
chmod +x scripts/hetzner/*.sh
```

---

## Step 2: Hetzner Server Preparation

### 2.1 Test Connection
```bash
./scripts/hetzner/check-connection.sh
```
**Expected output:**
- ✅ SSH connection working
- ✅ Server information displayed
- ⚠️ Docker not found (normal - we'll install it)

### 2.2 Setup Server
```bash
./scripts/hetzner/setup-server.sh
```
**This installs:**
- Docker and Docker Compose
- Essential packages (git, curl, etc.)
- Firewall configuration (UFW)
- Creates deployment directories

**Expected duration:** 5-10 minutes

### 2.3 Verify Setup
```bash
./scripts/hetzner/check-connection.sh
```
**Now you should see:**
- ✅ Docker found
- ✅ Docker Compose found

---

## Step 3: GitHub Repository Setup

### 3.1 Create Repository
```bash
./scripts/github/create-repository.sh
```
**This creates:**
- New GitHub repository
- Initializes local git repo
- Adds remote origin

### 3.2 Configure GitHub Secrets
1. **Automatic setup** (shows instructions):
   ```bash
   ./scripts/github/setup-secrets.sh
   ```

2. **Manual setup** (required for SSH key):
   - Go to: `https://github.com/YOUR_USERNAME/vsc-hetzner-deploy/settings/secrets/actions`
   - Add these secrets:
     - `HETZNER_IP` → Your server IP
     - `HETZNER_USER` → Your server username  
     - `HETZNER_SSH_KEY` → Your SSH private key content
     - `APP_PASSWORD` → Your VS Code password

### 3.3 Push Initial Code
```bash
./scripts/github/push-to-main.sh "Initial deployment setup"
```

---

## Step 4: Deploy Application

### 4.1 Deploy to Hetzner
```bash
./scripts/hetzner/deploy-app.sh
```
**This will:**
- Clone repository to server
- Build Docker containers
- Start all services
- Test application health

**Expected duration:** 5-10 minutes

### 4.2 Verify Deployment
```bash
./scripts/hetzner/server-status.sh
```
**Check for:**
- ✅ Services running
- ✅ Application responding on port 3000
- ✅ Docker containers healthy

### 4.3 Test Application
Visit in browser: `http://YOUR_SERVER_IP:3000`
- Should show VS Code interface
- Default workspace loads (admin theme)

---

## Step 5: DNS Configuration

### 5.1 Configure Domains
Follow the detailed [DNS Setup Guide](DNS-SETUP.md):

**At Spaceship.com, for each domain:**
1. Add A record: `@` → `YOUR_SERVER_IP`  
2. Add A record: `www` → `YOUR_SERVER_IP`
3. Set TTL to `300` for faster updates

### 5.2 Wait for Propagation  
- **Minimum**: 5-15 minutes
- **Typical**: 1-2 hours  
- **Maximum**: 24-48 hours

### 5.3 Test Domain Routing
After DNS propagation:
```bash
# Test each domain (with port for now)
curl -I http://cradlesystems.xyz:3000  # White theme
curl -I http://mezzpro.xyz:3000        # Green theme  
curl -I http://minqro.xyz:3000         # Blue theme
```

---

## Step 6: Verify Complete Setup

### 6.1 Test Automatic Deployment
1. Make a small change to any file
2. Push to GitHub:
   ```bash
   ./scripts/github/push-to-main.sh "Test automatic deployment"
   ```
3. Check GitHub Actions tab for deployment status
4. Verify changes appear on server within 2-5 minutes

### 6.2 Test All Features
**Domain Routing:**
- ✅ cradlesystems.xyz:3000 → Clean white theme
- ✅ mezzpro.xyz:3000 → Matrix green theme
- ✅ minqro.xyz:3000 → Blue tech theme

**Workspace Isolation:**
- ✅ Each domain has separate workspace folder
- ✅ Theme switching works automatically
- ✅ Data persists between container restarts

**Deployment Pipeline:**
- ✅ Push to main triggers deployment
- ✅ GitHub Actions completes successfully
- ✅ Changes reflect on server automatically

---

## Step 7: Optional Enhancements

### 7.1 Remove Port 3000 Requirement
To access domains without `:3000`:

1. **Edit docker-compose.yml:**
   ```yaml
   ports:
     - "80:3000"  # Change from "3000:3000"
   ```

2. **Redeploy:**
   ```bash
   ./scripts/hetzner/deploy-app.sh
   ```

3. **Test:**
   - http://cradlesystems.xyz (no port needed)
   - http://mezzpro.xyz  
   - http://minqro.xyz

### 7.2 SSL Certificates (HTTPS)
For production, consider adding SSL:
- Use Cloudflare (easiest)
- Or Let's Encrypt with Nginx
- Or Caddy server for automatic SSL

### 7.3 Monitoring Setup
- Set up uptime monitoring
- Configure log rotation
- Add backup automation

---

## Troubleshooting

### Common Issues

**1. SSH Connection Failed**
```bash
# Check your SSH key and server IP
./scripts/hetzner/check-connection.sh
```

**2. Docker Build Failed**
```bash  
# Check server resources and logs
./scripts/hetzner/server-status.sh
```

**3. DNS Not Working**
- Check DNS propagation: https://dnschecker.org
- Verify A records point to correct IP
- Wait longer (up to 48 hours)

**4. GitHub Actions Failed**
- Check repository secrets are set correctly
- Verify SSH key has no passphrase
- Check server accessibility from GitHub

**5. Application Not Responding**
```bash
# Check service status and logs
./scripts/hetzner/server-status.sh

# SSH into server for detailed logs
ssh user@server
cd ~/vsc-deploy/vsc-hetzner-deploy/app
docker-compose logs
```

### Getting Help

1. **Check server status:** `./scripts/hetzner/server-status.sh`
2. **Review logs:** SSH to server and check `docker-compose logs`
3. **Test connection:** `./scripts/hetzner/check-connection.sh`
4. **Verify DNS:** Use online DNS checkers

---

## Next Steps

After successful deployment:

1. **Customize themes** for your needs
2. **Set up regular backups**
3. **Configure SSL certificates**  
4. **Add monitoring and alerts**
5. **Scale resources** as needed

Congratulations! Your multi-domain VS Code environment is now running on Hetzner with automatic GitHub deployment! 🎉