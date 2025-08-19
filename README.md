# VSC Hetzner Deploy

**Multi-domain VS Code workspaces on Hetzner with automatic GitHub deployment**

Deploy a single code-server instance to Hetzner that serves different themed workspaces based on the domain accessed. Perfect for managing multiple projects with distinct visual identities.

## 🎨 Features

- **Multi-Domain Routing**: Different themes and workspaces per domain
- **Automatic Deployment**: Push to GitHub → Auto-deploy to Hetzner  
- **Three Themed Workspaces**:
  - `cradlesystems.xyz` → Clean minimal white theme
  - `mezzpro.xyz` → Matrix green-on-black theme  
  - `minqro.xyz` → Blue tech theme
- **Docker-Based**: Containerized for easy deployment and scaling
- **Persistent Data**: Workspace data survives container restarts

## 🚀 Quick Start

### Prerequisites
- Hetzner VPS (Ubuntu/Debian)
- SSH access to your server
- GitHub account with personal access token
- Domains registered (we use Spaceship.com)

### 1. Setup
```bash
git clone https://github.com/YOUR_USERNAME/vsc-hetzner-deploy.git
cd vsc-hetzner-deploy
cp .env.example .env
# Edit .env with your settings
chmod +x scripts/*/*.sh
```

### 2. Deploy
```bash
# Test connection
./scripts/hetzner/check-connection.sh

# Setup server  
./scripts/hetzner/setup-server.sh

# Create GitHub repo and deploy
./scripts/github/create-repository.sh
./scripts/hetzner/deploy-app.sh
```

### 3. Configure DNS
Point your domains to your Hetzner server IP:
```
cradlesystems.xyz → YOUR_SERVER_IP
mezzpro.xyz → YOUR_SERVER_IP  
minqro.xyz → YOUR_SERVER_IP
```

## 📁 Project Structure

```
vsc-hetzner-deploy/
├── app/                     # Application files
│   ├── Dockerfile           # Container configuration
│   ├── docker-compose.yml   # Service orchestration
│   ├── proxy-server.js      # Domain routing logic
│   └── themes/              # Workspace theme scripts
├── scripts/
│   ├── github/              # GitHub operations
│   └── hetzner/             # Server management
├── config/workspaces/       # VS Code workspace configs
├── .github/workflows/       # Auto-deployment pipeline
└── docs/                    # Setup and configuration guides
```

## 🌐 How Domain Routing Works

1. **User visits** `mezzpro.xyz:3000`
2. **Proxy server** reads the domain from request headers
3. **Redirects** to code-server with workspace parameter
4. **Code-server** loads MezzPro workspace with green matrix theme
5. **User sees** themed VS Code interface

Same code-server, different experience per domain!

## 🎯 Workspace Themes

### Cradle Systems (cradlesystems.xyz)
- **Theme**: Clean minimal white
- **Focus**: Distraction-free editing
- **Features**: Hidden UI, large fonts, zen mode

### MezzPro (mezzpro.xyz)  
- **Theme**: Matrix green-on-black
- **Focus**: Terminal/hacker aesthetic  
- **Features**: Bold monospace, dark interface

### MinQro (minqro.xyz)
- **Theme**: Blue tech with gradients
- **Focus**: Modern development
- **Features**: Full feature set, JetBrains Mono

## 🔧 Available Scripts

### GitHub Operations
```bash
./scripts/github/create-repository.sh        # Create GitHub repo
./scripts/github/push-to-main.sh            # Push to main branch
./scripts/github/push-to-feature.sh         # Create and push feature branch
./scripts/github/setup-secrets.sh           # Configure deployment secrets
```

### Hetzner Operations
```bash
./scripts/hetzner/check-connection.sh       # Test SSH connection
./scripts/hetzner/setup-server.sh          # Initial server setup
./scripts/hetzner/deploy-app.sh            # Deploy application  
./scripts/hetzner/server-status.sh         # Check server health
```

## 🤖 Automatic Deployment

Push to main branch triggers automatic deployment:

```bash
git add .
git commit -m "Update themes"
git push origin main
# Automatically deploys to Hetzner within 2-5 minutes
```

Powered by GitHub Actions with SSH deployment to your server.

## 📚 Documentation

- **[Complete Setup Guide](docs/SETUP-GUIDE.md)** - Step-by-step deployment
- **[DNS Configuration](docs/DNS-SETUP.md)** - Domain setup at Spaceship.com  
- **[Project Structure](PROJECT-STRUCTURE.md)** - File organization
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🔒 Security

- Firewall configured (UFW) with minimal open ports
- SSH key-based authentication
- Container runs as non-root user
- Workspace data isolation
- Secure environment variable handling

## 📊 Monitoring

Check your deployment health:
```bash
./scripts/hetzner/server-status.sh
```

Provides:
- System resources (CPU, memory, disk)
- Docker container status  
- Application health checks
- Network connectivity
- Service logs

## 🔄 Development Workflow

1. **Local development**: Test changes locally
2. **Feature branch**: `./scripts/github/push-to-feature.sh feature-name`
3. **Pull request**: Review changes on GitHub
4. **Merge to main**: Triggers automatic deployment
5. **Verify**: Check deployment with server status script

## 🌟 Advanced Features

### Custom Port Configuration
Run on port 80 (no `:3000` needed):
```yaml
# In docker-compose.yml
ports:
  - "80:3000"
```

### SSL/HTTPS Setup  
- Add Cloudflare for automatic SSL
- Or configure Let's Encrypt
- Or use Caddy for automatic certificates

### Scaling
- Add more domains and themes easily
- Scale server resources as needed
- Multiple server deployment with load balancer

## ❓ FAQ

**Q: Can I add more domains?**  
A: Yes! Edit `proxy-server.js` to add domain mappings and create theme scripts.

**Q: How do I change the VS Code password?**  
A: Update `APP_PASSWORD` in `.env` and redeploy.

**Q: Can I customize the themes?**  
A: Absolutely! Edit the theme scripts in `app/themes/` and push changes.

**Q: What if my server goes down?**  
A: Docker containers auto-restart. Workspace data persists in volumes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `./scripts/github/push-to-feature.sh my-feature`
3. Make changes and test
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Scripts**: Use the helper scripts for common tasks
- **Issues**: Open GitHub issues for bugs/features
- **Health Check**: `./scripts/hetzner/server-status.sh`

---

**Deploy once, access everywhere. One server, multiple themed workspaces.** 🎉