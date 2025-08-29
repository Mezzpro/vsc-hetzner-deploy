# VSCode Microservice Architecture - Project Structure

## Overview
Professional, clean VSCode system with venture-specific container isolation and native theme integration.

## Directory Structure

```
vsc-hetzner-deploy/
├── ventures/                          # Venture-specific containers
│   ├── ventures.json                 # Single source venture configuration
│   ├── cradle/                       # Cradle System Container (Business Admin)
│   │   ├── Dockerfile                # Container build definition
│   │   ├── package.json              # Container dependencies
│   │   ├── server.js                 # Venture service endpoint
│   │   ├── start.sh                  # Container startup script
│   │   ├── extension/                # Cradle business extension (migrated)
│   │   │   ├── package.json
│   │   │   ├── src/
│   │   │   │   ├── extension.ts
│   │   │   │   ├── core/
│   │   │   │   ├── navigation/
│   │   │   │   └── tabs/
│   │   │   └── tsconfig.json
│   │   └── workspace/                # Cradle workspace configuration
│   │       └── .vscode/
│   │           └── settings.json     # Dark Modern theme, clean UI
│   ├── mezzpro/                      # MezzPro Venture Container (Blockchain)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── start.sh
│   │   ├── extension/                # MezzPro blockchain extension (migrated)
│   │   │   ├── package.json
│   │   │   ├── src/
│   │   │   │   ├── extension.ts
│   │   │   │   ├── core/
│   │   │   │   ├── navigation/
│   │   │   │   └── tabs/
│   │   │   └── tsconfig.json
│   │   └── workspace/                # MezzPro workspace configuration
│   │       └── .vscode/
│   │           └── settings.json     # Dark High Contrast theme, clean UI
│   └── bizcradle/                    # Bizcradle Venture Container (Marketing)
│       ├── Dockerfile
│       ├── package.json
│       ├── server.js
│       ├── start.sh
│       ├── extension/                # Bizcradle marketing extension (migrated)
│       │   ├── package.json
│       │   ├── src/
│       │   │   ├── extension.ts
│       │   │   ├── core/
│       │   │   ├── navigation/
│       │   │   └── tabs/
│       │   └── tsconfig.json
│       └── workspace/                # Bizcradle workspace configuration
│           └── .vscode/
│               └── settings.json     # Light Modern theme, clean UI
├── containers/                       # Core system containers
│   ├── codeserver/                   # Base VS Code server container
│   │   ├── Dockerfile               # Clean VS Code server setup
│   │   └── config/
│   │       └── settings.json        # Base VS Code settings
│   └── proxy/                       # Proxy gateway container
│       ├── Dockerfile               # Request routing container
│       ├── package.json
│       ├── proxy-server.js          # Domain-based routing logic
│       └── routing-config.json      # Domain to container mapping
├── docker-compose.yml               # Multi-container orchestration
├── scripts/                         # Deployment and management scripts
│   ├── hetzner/
│   │   ├── deploy-app.sh           # Professional deployment with health checks
│   │   ├── test-ventures.sh        # Venture isolation testing
│   │   ├── server-status.sh        # System health monitoring
│   │   ├── check-connection.sh     # Network connectivity testing
│   │   ├── check-logs.sh           # Container log inspection
│   │   └── setup-ssl.sh            # SSL certificate management
│   └── github/                      # Git repository management
│       ├── create-repository.sh
│       ├── push-to-main.sh
│       └── setup-secrets.sh
├── docs/                            # Documentation
│   ├── DNS-SETUP.md
│   ├── SETUP-GUIDE.md
│   ├── SSL-SETUP.md
│   └── TROUBLESHOOTING.md
├── README.md                        # Main documentation
└── PROJECT-STRUCTURE.md            # This file
```

## Container Architecture

### Core Containers
- **vsc-codeserver-base**: Base VS Code server (port 8080)
- **vsc-proxy-gateway**: Request routing (port 3000)

### Venture Containers  
- **vsc-system-cradle**: Cradle business admin + system settings (port 3001)
- **vsc-venture-mezzpro**: MezzPro blockchain platform (port 3002)
- **vsc-venture-bizcradle**: Bizcradle marketing platform (port 3003)

## Key Features

### Professional Standards
- ✅ **Clean Interface**: No terminal auto-opening, minimal UI
- ✅ **Native Themes**: Built-in VSCode themes only
- ✅ **Extension Isolation**: Zero cross-venture contamination
- ✅ **Consistent Naming**: Single source truth in ventures.json
- ✅ **Professional Workspaces**: Simple names (cradle, mezzpro, bizcradle)

### Scalability Features
- ✅ **Independent Updates**: Update one venture without affecting others
- ✅ **Container Isolation**: Each venture in dedicated container
- ✅ **Health Monitoring**: Built-in health checks per container
- ✅ **Resource Optimization**: Efficient resource allocation

### Development Workflow
- ✅ **Single Configuration**: All venture definitions in ventures.json
- ✅ **Clean Architecture**: Clear separation of concerns
- ✅ **Professional Deployment**: Automated with health validation
- ✅ **Easy Maintenance**: Simple, consistent structure

## Migration Notes

### Completed Migrations
- ✅ **Extensions**: All custom extensions migrated to venture containers
- ✅ **Workspaces**: Clean workspace configurations with native themes
- ✅ **Architecture**: Monolithic app/ directory removed
- ✅ **Deployment**: Updated scripts for microservice architecture
- ✅ **Documentation**: Complete project documentation updated

### Removed Components
- ❌ **app/ directory**: Old monolithic structure removed
- ❌ **Old themes**: Complex theme scripts removed, using native themes
- ❌ **Extension debugging scripts**: Obsolete scripts removed
- ❌ **config/ directory**: Old configuration structure removed

## Access Points

- **Cradle System**: https://cradlesystems.xyz (Dark Modern theme)
- **MezzPro Platform**: https://mezzpro.xyz (Dark High Contrast theme)
- **Bizcradle Platform**: https://bizcradle.xyz (Light Modern theme)

---

**Result**: Clean, professional, scalable VSCode microservice architecture with complete venture isolation and native theme integration.
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