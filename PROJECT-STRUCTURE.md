# VSC Hetzner Deploy - Project Structure

```
vsc-hetzner-deploy/
│
├── .env.example                          # Environment variables template
├── .env                                  # Your actual environment (DO NOT COMMIT)
├── README.md                             # Main project documentation
├── PROJECT-STRUCTURE.md                  # This file - project organization
│
├── app/                                  # Application files
│   ├── Dockerfile                        # Container configuration
│   ├── docker-compose.yml               # Service orchestration
│   ├── package.json                     # Node.js dependencies
│   ├── proxy-server.js                  # Domain routing proxy
│   ├── start-services.sh                # Application startup script
│   └── themes/                          # Workspace theme configurations
│       ├── cradle-theme.sh              # Clean white theme
│       ├── mezzpro-theme.sh             # Matrix green theme
│       └── minqro-theme.sh              # Blue tech theme
│
├── scripts/                             # Automation scripts
│   ├── github/                          # GitHub-related operations
│   │   ├── create-repository.sh         # Create GitHub repository
│   │   ├── push-to-main.sh              # Push changes to main branch
│   │   ├── push-to-feature.sh           # Push to feature branch
│   │   └── setup-secrets.sh             # Configure GitHub secrets
│   │
│   └── hetzner/                         # Hetzner server operations
│       ├── check-connection.sh          # Test SSH connection
│       ├── setup-server.sh              # Initial server setup
│       ├── deploy-app.sh                # Deploy application
│       └── server-status.sh             # Check server health
│
├── config/                              # Configuration files
│   ├── vscode-settings.json             # VS Code default settings
│   └── workspaces/                      # Workspace configurations
│       ├── cradle-admin.code-workspace  # Admin workspace
│       ├── mezzpro.code-workspace       # MezzPro workspace
│       └── minqro.code-workspace        # MinQro workspace
│
├── .github/                             # GitHub Actions
│   └── workflows/                       # CI/CD pipelines
│       └── deploy.yml                   # Auto-deployment workflow
│
└── docs/                                # Documentation
    ├── DNS-SETUP.md                     # DNS configuration guide
    ├── HETZNER-SETUP.md                 # Hetzner server setup guide
    ├── GITHUB-SETUP.md                  # GitHub configuration guide
    └── TROUBLESHOOTING.md               # Common issues and solutions
```

## Purpose of Each Directory:

### `/app/` - Application Files
- Contains the actual code-server application
- Docker configuration and startup scripts
- Theme configurations for workspaces

### `/scripts/github/` - GitHub Operations
- Repository creation and management
- Branch operations and pushes
- GitHub secrets configuration

### `/scripts/hetzner/` - Server Operations  
- Server connection testing
- Deployment automation
- Health monitoring

### `/config/` - Configuration
- VS Code settings and workspace files
- Static configuration that rarely changes

### `/.github/workflows/` - CI/CD
- Automated deployment pipelines
- GitHub Actions configuration

### `/docs/` - Documentation
- Step-by-step setup guides
- Manual configuration instructions
- Troubleshooting information

## File Naming Convention:
- **Scripts**: `action-target.sh` (e.g., `check-connection.sh`)
- **Config**: `service-settings.json` (e.g., `vscode-settings.json`)
- **Docs**: `TOPIC-PURPOSE.md` (e.g., `DNS-SETUP.md`)
- **App files**: Descriptive names (e.g., `proxy-server.js`)

This structure ensures clear separation of concerns and easy navigation.