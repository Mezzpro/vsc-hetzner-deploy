#!/bin/bash

# Bizcradle Theme - Orange Theme Configuration  
# Clean workspace with orange accent colors

echo "🎨 Applying Bizcradle orange theme..."

# Create VS Code settings directory
mkdir -p /home/coder/.local/share/code-server/User

# VS Code User Settings - Clean interface with orange theme
cat > /home/coder/.local/share/code-server/User/settings.json << 'EOF'
{
    "workbench.colorTheme": "Default Light Modern",
    "workbench.startupEditor": "none",
    "workbench.tips.enabled": false,
    "workbench.welcomePage.walkthroughs.openOnInstall": false,
    "files.autoSave": "afterDelay",
    "editor.minimap.enabled": false,
    "editor.lineNumbers": "off",
    "editor.folding": false,
    "editor.glyphMargin": false,
    "workbench.activityBar.visible": false,
    "workbench.statusBar.visible": false,
    "workbench.sideBar.location": "right",
    "explorer.openEditors.visible": 0,
    "files.exclude": {
        "**/.*": true,
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/node_modules": true,
        "**/.vscode": true
    },
    "workbench.tree.renderIndentGuides": "none",
    "workbench.colorCustomizations": {
        "titleBar.activeBackground": "#FF9800",
        "titleBar.activeForeground": "#FFFFFF",
        "titleBar.inactiveBackground": "#FFF3E0",
        "titleBar.inactiveForeground": "#E65100",
        "activityBar.background": "#FFCC80",
        "activityBar.foreground": "#E65100",
        "sideBar.background": "#FFF3E0",
        "sideBar.foreground": "#E65100",
        "editor.background": "#FFFFFF",
        "panel.background": "#FFF3E0",
        "statusBar.background": "#FF9800",
        "statusBar.foreground": "#FFFFFF"
    },
    "window.title": "Bizcradle Workspace",
    "breadcrumbs.enabled": false,
    "workbench.editor.showTabs": true,
    "workbench.editor.tabCloseButton": "off"
}
EOF

# Set proper ownership
chown -R coder:coder /home/coder/.local/share/code-server/User

echo "✅ Bizcradle orange theme applied!"