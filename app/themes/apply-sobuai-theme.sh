#!/bin/bash

# Sobuai Theme - Pink Theme Configuration
# Clean workspace with pink accent colors

echo "🎨 Applying Sobuai pink theme..."

# Create VS Code settings directory
mkdir -p /home/coder/.local/share/code-server/User

# VS Code User Settings - Clean interface with pink theme
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
        "titleBar.activeBackground": "#E91E63",
        "titleBar.activeForeground": "#FFFFFF",
        "titleBar.inactiveBackground": "#FCE4EC",
        "titleBar.inactiveForeground": "#880E4F",
        "activityBar.background": "#F8BBD9",
        "activityBar.foreground": "#880E4F",
        "sideBar.background": "#FCE4EC",
        "sideBar.foreground": "#880E4F",
        "editor.background": "#FFFFFF",
        "panel.background": "#FCE4EC",
        "statusBar.background": "#E91E63",
        "statusBar.foreground": "#FFFFFF"
    },
    "window.title": "Sobuai Workspace",
    "breadcrumbs.enabled": false,
    "workbench.editor.showTabs": true,
    "workbench.editor.tabCloseButton": "off"
}
EOF

# Set proper ownership
chown -R coder:coder /home/coder/.local/share/code-server/User

echo "✅ Sobuai pink theme applied!"