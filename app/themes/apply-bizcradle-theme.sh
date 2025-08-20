#!/bin/bash

# Bizcradle Theme - Orange Theme Configuration  
# Clean workspace with orange accent colors

echo "🎨 Applying Bizcradle orange theme..."

# Create VS Code settings directory
mkdir -p /home/coder/.local/share/code-server/User

# VS Code User Settings - Clean interface with orange theme
cat > /home/coder/workspace-bizcradle/.vscode/settings.json << 'EOF'
{
    "workbench.colorTheme": "Default Light+",
    "workbench.iconTheme": "vs-seti",
    "workbench.activityBar.visible": false,
    "workbench.statusBar.visible": false,
    "workbench.sideBar.location": "right",
    "workbench.panel.defaultLocation": "bottom",
    "window.menuBarVisibility": "compact",
    "window.commandCenter": true,
    "editor.minimap.enabled": false,
    "editor.lineNumbers": "off",
    "editor.folding": false,
    "editor.glyphMargin": false,
    "breadcrumbs.enabled": false,
    "editor.fontSize": 16,
    "editor.fontFamily": "'Segoe UI', 'Arial', sans-serif",
    "editor.fontWeight": "400",
    "editor.lineHeight": 1.6,
    "editor.letterSpacing": 0.3,
    "editor.cursorBlinking": "smooth",
    "editor.cursorStyle": "line",
    "editor.cursorWidth": 2,
    "editor.smoothScrolling": true,
    "terminal.integrated.fontSize": 14,
    "terminal.integrated.fontFamily": "'Consolas', monospace",
    "workbench.colorCustomizations": {
        "editor.background": "#fff8f0",
        "editor.foreground": "#d2691e",
        "editorCursor.foreground": "#ff6f00",
        "editor.selectionBackground": "#ffe0b3",
        "editor.lineHighlightBackground": "#fff3e6",
        "sideBar.background": "#fff8f0",
        "sideBar.foreground": "#cc5500",
        "activityBar.background": "#ffcc80",
        "activityBar.foreground": "#d2691e",
        "panel.background": "#fff8f0",
        "panel.border": "#ff9800",
        "statusBar.background": "#ff9800",
        "statusBar.foreground": "#ffffff",
        "titleBar.activeBackground": "#ff9800",
        "titleBar.activeForeground": "#ffffff",
        "tab.activeBackground": "#ffe0b3",
        "tab.activeForeground": "#d2691e",
        "tab.inactiveBackground": "#fff8f0",
        "tab.inactiveForeground": "#cc7a00",
        "terminal.background": "#fff8f0",
        "terminal.foreground": "#d2691e"
    },
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": ["comment"],
                "settings": {
                    "foreground": "#ff9800",
                    "fontStyle": "italic"
                }
            },
            {
                "scope": ["string"],
                "settings": {
                    "foreground": "#ff6f00"
                }
            },
            {
                "scope": ["keyword", "storage.type"],
                "settings": {
                    "foreground": "#d2691e",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["variable", "support.variable"],
                "settings": {
                    "foreground": "#cc5500"
                }
            },
            {
                "scope": ["function", "entity.name.function"],
                "settings": {
                    "foreground": "#e65100",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["constant.numeric"],
                "settings": {
                    "foreground": "#ff8f00"
                }
            }
        ]
    },
    "files.autoSave": "afterDelay",
    "workbench.startupEditor": "none",
    "workbench.tips.enabled": false,
    "workbench.welcomePage.walkthroughs.openOnInstall": false,
    "telemetry.telemetryLevel": "off",
    "window.title": "Bizcradle Business Platform",
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
    }
}
EOF

# Set proper ownership
chown -R coder:coder /home/coder/workspace-bizcradle/.vscode

echo "✅ Bizcradle orange theme applied!"