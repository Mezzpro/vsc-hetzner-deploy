# Cradle Business Suite Extension

A multi-tab business interface extension for VS Code with fairies.ai-inspired styling, designed specifically for the Cradle Systems workspace.

## Features

### Multi-Tab Business Interface
- **Business Dashboard**: Main interface with fairies.ai styling and exact download button
- **Analytics Center**: Business metrics, charts, and performance tracking
- **Download Center**: Resource management with multiple download options
- **Business Tools**: Essential utilities for business operations

### TreeView Navigation
- Clean sidebar navigation with business-focused menu items
- Professional icons and terminology
- Quick access to all business tabs

### Native VS Code Integration
- Full support for VS Code's native tab management
- Drag-and-drop tabs between editor groups
- Split view and ViewColumn positioning
- Tab lifecycle management with proper cleanup

## Installation

### Automatic (Docker Container)
The extension is automatically installed and configured in the Cradle Systems Docker container.

### Manual Installation
1. Copy the extension to your code-server extensions directory:
   ```bash
   cp -r cradle-business-suite ~/.local/share/code-server/extensions/
   ```

2. Restart code-server

3. The extension will automatically activate when you open the `workspace-admin` workspace

## Architecture

### Tab Management
- Uses VS Code's native `createWebviewPanel()` API
- ViewColumn positioning for side-by-side layouts
- Tab persistence with `retainContextWhenHidden: true`

### Business Navigation
- TreeView provider for clean sidebar menu
- Command registration for each business section
- Auto-activation in Cradle workspaces

### Styling
- Fairies.ai-inspired design with exact download button replication
- Responsive layouts for different screen sizes
- Professional business aesthetics

## Usage

### Opening Business Tabs
Click any item in the "Business Navigation" sidebar:
- 📊 Business Dashboard
- 📈 Analytics Center  
- 📥 Download Center
- 🔧 Business Tools
- ⚡ Quick Workspace (opens all tabs)

### Keyboard Shortcuts
- `Ctrl+Shift+D`: Open Business Dashboard
- `Ctrl+Shift+A`: Open Analytics Center

### Tab Management
- Drag tabs between editor groups
- Use split view for side-by-side workflows
- Close tabs individually or use VS Code's tab management

## Development

### Building the Extension
```bash
npm install
npm run compile
```

### File Structure
```
cradle-business-suite/
├── src/
│   ├── extension.ts              # Main extension entry point
│   ├── businessNavigationProvider.ts  # TreeView sidebar
│   └── tabManager.ts            # Multi-webview management
├── package.json                 # Extension manifest
├── tsconfig.json               # TypeScript configuration
└── build.sh                    # Build script
```

## Integration

### Docker Container
The extension integrates seamlessly with the existing Cradle Systems architecture:
- Zero disruption to code-server container workflow
- Preserves Docker volume persistence
- Compatible with domain routing and themes

### Workspace Detection
Auto-activates when detecting `workspace-admin` folder, ensuring the business interface is available only in the appropriate workspace.

## Version

- **Version**: 1.0.0
- **VS Code Compatibility**: ^1.74.0
- **License**: Private (Cradle Systems)

---

Built for Cradle Systems multi-venture business platform.