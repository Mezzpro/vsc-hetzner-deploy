# Troubleshooting Guide

Common issues and solutions for VSC Hetzner deployment.

## 🔧 Quick Diagnostics

**Start with these commands:**
```bash
# Test server connection
./scripts/hetzner/check-connection.sh

# Check deployment status  
./scripts/hetzner/server-status.sh

# View recent GitHub Actions
# Visit: https://github.com/YOUR_USERNAME/vsc-hetzner-deploy/actions
```

---

## 🌐 Connection Issues

### SSH Connection Failed

**Symptoms:**
- `./scripts/hetzner/check-connection.sh` fails
- "Permission denied" or "Connection refused"

**Solutions:**

1. **Verify server details:**
   ```bash
   # Check .env file
   cat .env | grep HETZNER
   ```

2. **Test SSH manually:**
   ```bash
   ssh -i ~/.ssh/your_key user@server_ip
   ```

3. **Check SSH key permissions:**
   ```bash
   chmod 600 ~/.ssh/your_private_key
   chmod 644 ~/.ssh/your_private_key.pub
   ```

4. **Verify server is running:**
   - Check Hetzner Cloud console
   - Ensure server is powered on
   - Check firewall allows SSH (port 22)

### DNS Not Resolving

**Symptoms:**
- Domain doesn't point to your server
- `nslookup domain.com` shows wrong IP

**Solutions:**

1. **Check DNS propagation:**
   - Visit: https://dnschecker.org
   - Enter your domain
   - Verify A record points to server IP

2. **Clear local DNS cache:**
   ```bash
   # Windows
   ipconfig /flushdns
   
   # macOS/Linux  
   sudo systemctl restart systemd-resolved
   ```

3. **Test with different DNS:**
   ```bash
   nslookup cradlesystems.xyz 8.8.8.8
   ```

4. **Verify Spaceship DNS records:**
   - Login to Spaceship.com
   - Check A records for @ and www
   - Ensure TTL is set to 300

---

## 🐳 Docker Issues

### Docker Build Failed

**Symptoms:**
- `./scripts/hetzner/deploy-app.sh` fails during build
- "docker: command not found"

**Solutions:**

1. **Check Docker installation:**
   ```bash
   ssh user@server 'docker --version'
   ```

2. **Reinstall Docker if needed:**
   ```bash
   ./scripts/hetzner/setup-server.sh
   ```

3. **Check disk space:**
   ```bash
   ssh user@server 'df -h'
   ```

4. **Clean up Docker if needed:**
   ```bash
   ssh user@server 'docker system prune -f'
   ```

### Containers Won't Start

**Symptoms:**
- Services show as "Exited" in docker-compose ps
- Application not responding

**Solutions:**

1. **Check container logs:**
   ```bash
   ssh user@server
   cd ~/vsc-deploy/vsc-hetzner-deploy/app
   docker-compose logs
   ```

2. **Check resource usage:**
   ```bash
   ./scripts/hetzner/server-status.sh
   ```

3. **Restart containers:**
   ```bash
   ssh user@server
   cd ~/vsc-deploy/vsc-hetzner-deploy/app  
   docker-compose down
   docker-compose up -d
   ```

4. **Check port conflicts:**
   ```bash
   ssh user@server 'netstat -tln | grep :3000'
   ```

---

## 🚀 Application Issues

### VS Code Not Loading

**Symptoms:**
- Browser shows "Connection refused" 
- Blank page or proxy errors

**Solutions:**

1. **Check application health:**
   ```bash
   ./scripts/hetzner/server-status.sh
   ```

2. **Test direct server access:**
   ```bash
   curl -I http://YOUR_SERVER_IP:3000
   ```

3. **Check proxy server logs:**
   ```bash
   ssh user@server
   cd ~/vsc-deploy/vsc-hetzner-deploy/app
   docker-compose logs vsc-hetzner
   ```

4. **Restart services:**
   ```bash
   ./scripts/hetzner/deploy-app.sh
   ```

### Wrong Theme Loading

**Symptoms:**
- Domain shows wrong theme
- All domains show same theme

**Solutions:**

1. **Check domain mapping:**
   - Verify proxy-server.js has correct domains
   - Check DOMAIN_WORKSPACE_MAP configuration

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - Or use incognito/private browsing

3. **Test with curl:**
   ```bash
   curl -H "Host: mezzpro.xyz" http://YOUR_SERVER_IP:3000
   ```

4. **Check theme scripts:**
   ```bash
   ssh user@server
   cd ~/vsc-deploy/vsc-hetzner-deploy/app
   ls -la themes/
   ```

---

## ⚙️ GitHub Actions Issues

### Deployment Failed

**Symptoms:**
- GitHub Actions shows red X (failed)
- Deployment doesn't update server

**Solutions:**

1. **Check GitHub Actions logs:**
   - Go to GitHub repository
   - Click "Actions" tab
   - Click on failed workflow
   - Review error messages

2. **Verify GitHub Secrets:**
   - Go to Settings > Secrets and variables > Actions
   - Ensure these secrets exist:
     - `HETZNER_IP`
     - `HETZNER_USER`  
     - `HETZNER_SSH_KEY`
     - `APP_PASSWORD`

3. **Test SSH key:**
   ```bash
   # SSH key should not have passphrase for automation
   ssh-keygen -y -f ~/.ssh/your_key
   ```

4. **Check server accessibility from GitHub:**
   - Ensure server allows SSH from any IP
   - Check UFW firewall allows SSH

### Secrets Configuration

**Symptoms:**
- "SSH key not found" or "Permission denied" in Actions
- Missing environment variables

**Solutions:**

1. **Add SSH private key to GitHub:**
   ```bash
   # Copy your PRIVATE key content (not .pub)
   cat ~/.ssh/your_private_key
   # Paste entire content into HETZNER_SSH_KEY secret
   ```

2. **Verify secret format:**
   - SSH key should include `-----BEGIN` and `-----END` lines
   - No extra spaces or formatting

3. **Test manual setup:**
   ```bash
   ./scripts/github/setup-secrets.sh
   ```

---

## 🔥 Firewall Issues

### Ports Not Accessible

**Symptoms:**
- Can SSH but can't access application
- "Connection timed out" on port 3000

**Solutions:**

1. **Check UFW status:**
   ```bash
   ssh user@server 'sudo ufw status'
   ```

2. **Open required ports:**
   ```bash
   ssh user@server '
     sudo ufw allow 22/tcp
     sudo ufw allow 80/tcp  
     sudo ufw allow 3000/tcp
     sudo ufw reload
   '
   ```

3. **Check Hetzner Cloud firewall:**
   - Login to Hetzner Cloud console
   - Check server firewall settings
   - Ensure ports 22, 80, 3000 are allowed

### Port Conflicts

**Symptoms:**
- "Port already in use" errors
- Services won't bind to ports

**Solutions:**

1. **Find processes using ports:**
   ```bash
   ssh user@server 'sudo netstat -tulpn | grep :3000'
   ```

2. **Kill conflicting processes:**
   ```bash
   ssh user@server 'sudo kill -9 PID_NUMBER'
   ```

3. **Use different ports:**
   - Edit docker-compose.yml
   - Change port mapping

---

## 📊 Performance Issues

### Slow Response Times

**Symptoms:**
- VS Code loads slowly
- Long delays opening files

**Solutions:**

1. **Check server resources:**
   ```bash
   ./scripts/hetzner/server-status.sh
   ```

2. **Upgrade server if needed:**
   - More RAM (4GB+ recommended)
   - More CPU cores
   - SSD storage

3. **Optimize Docker:**
   ```bash
   ssh user@server '
     docker system prune -f
     docker volume prune -f
   '
   ```

### High Memory Usage

**Symptoms:**
- Out of memory errors
- Container restarts frequently

**Solutions:**

1. **Monitor resources:**
   ```bash
   ssh user@server 'free -h && df -h'
   ```

2. **Add swap space:**
   ```bash
   ssh user@server '
     sudo fallocate -l 2G /swapfile
     sudo chmod 600 /swapfile  
     sudo mkswap /swapfile
     sudo swapon /swapfile
   '
   ```

3. **Limit container memory:**
   ```yaml
   # In docker-compose.yml
   services:
     vsc-hetzner:
       deploy:
         resources:
           limits:
             memory: 1G
   ```

---

## 🆘 Emergency Recovery

### Complete Deployment Reset

If everything is broken:

1. **Stop all services:**
   ```bash
   ssh user@server '
     cd ~/vsc-deploy/vsc-hetzner-deploy/app
     docker-compose down
   '
   ```

2. **Clean up Docker:**
   ```bash
   ssh user@server '
     docker system prune -af
     docker volume prune -f
   '
   ```

3. **Redeploy from scratch:**
   ```bash
   ./scripts/hetzner/deploy-app.sh
   ```

### Restore from Backup

If you have backups:

```bash
ssh user@server '
  cd ~/vsc-deploy
  rm -rf vsc-hetzner-deploy
  cp -r ~/backups/vsc-backup-YYYYMMDD_HHMMSS vsc-hetzner-deploy
  cd vsc-hetzner-deploy/app
  docker-compose up -d
'
```

---

## 📞 Getting More Help

### Diagnostic Information

When asking for help, provide:

1. **Server status:**
   ```bash
   ./scripts/hetzner/server-status.sh > server-status.txt
   ```

2. **Connection test:**
   ```bash  
   ./scripts/hetzner/check-connection.sh > connection-test.txt
   ```

3. **Docker logs:**
   ```bash
   ssh user@server 'cd ~/vsc-deploy/vsc-hetzner-deploy/app && docker-compose logs' > docker-logs.txt
   ```

4. **GitHub Actions logs:**
   - Screenshot of failed workflow
   - Copy error messages

### Log Locations

**Application logs:**
```bash
ssh user@server '
  cd ~/vsc-deploy/vsc-hetzner-deploy/app
  docker-compose logs vsc-hetzner
'
```

**System logs:**
```bash
ssh user@server 'sudo journalctl -u docker --since "1 hour ago"'
```

**Deployment logs:**  
- GitHub Actions logs in repository
- Check workflow run details

Remember: Most issues are DNS propagation delays or SSH key configuration problems. Start with the basics! 🔍