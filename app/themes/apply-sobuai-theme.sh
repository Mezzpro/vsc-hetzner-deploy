#!/bin/bash

# Sobuai Theme - Pink Theme Configuration
# Clean workspace with pink accent colors

echo "🎨 Applying Sobuai pink theme..."

# Create VS Code settings directory
mkdir -p /home/coder/.local/share/code-server/User

# VS Code User Settings - Clean interface with pink theme
cat > /home/coder/.local/share/code-server/User/settings.json << 'EOF'
{
    "workbench.colorTheme": "Default Light+",
    "workbench.iconTheme": "vs-minimal",
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
    "editor.fontFamily": "'Segoe UI', 'Calibri', sans-serif",
    "editor.fontWeight": "300",
    "editor.lineHeight": 1.7,
    "editor.letterSpacing": 0.4,
    "editor.cursorBlinking": "smooth",
    "editor.cursorStyle": "line",
    "editor.cursorWidth": 2,
    "editor.smoothScrolling": true,
    "terminal.integrated.fontSize": 14,
    "terminal.integrated.fontFamily": "'Consolas', monospace",
    "workbench.colorCustomizations": {
        "editor.background": "#fdf2f8",
        "editor.foreground": "#be185d",
        "editorCursor.foreground": "#ec4899",
        "editor.selectionBackground": "#f9a8d4aa",
        "editor.lineHighlightBackground": "#fce7f3",
        "sideBar.background": "#fdf2f8",
        "sideBar.foreground": "#a21caf",
        "activityBar.background": "#f8bbd9",
        "activityBar.foreground": "#be185d",
        "panel.background": "#fdf2f8",
        "panel.border": "#e91e63",
        "statusBar.background": "#e91e63",
        "statusBar.foreground": "#ffffff",
        "titleBar.activeBackground": "#e91e63",
        "titleBar.activeForeground": "#ffffff",
        "tab.activeBackground": "#f9a8d4",
        "tab.activeForeground": "#be185d",
        "tab.inactiveBackground": "#fdf2f8",
        "tab.inactiveForeground": "#a855f7",
        "terminal.background": "#fdf2f8",
        "terminal.foreground": "#be185d"
    },
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": ["comment"],
                "settings": {
                    "foreground": "#e91e63",
                    "fontStyle": "italic"
                }
            },
            {
                "scope": ["string"],
                "settings": {
                    "foreground": "#ec4899"
                }
            },
            {
                "scope": ["keyword", "storage.type"],
                "settings": {
                    "foreground": "#be185d",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["variable", "support.variable"],
                "settings": {
                    "foreground": "#a21caf"
                }
            },
            {
                "scope": ["function", "entity.name.function"],
                "settings": {
                    "foreground": "#9333ea",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["constant.numeric"],
                "settings": {
                    "foreground": "#db2777"
                }
            }
        ]
    },
    "files.autoSave": "afterDelay",
    "workbench.startupEditor": "none",
    "workbench.tips.enabled": false,
    "workbench.welcomePage.walkthroughs.openOnInstall": false,
    "telemetry.telemetryLevel": "off",
    "window.title": "Sobuai Creative Platform",
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
chown -R coder:coder /home/coder/.local/share/code-server/User

echo "✅ Sobuai pink theme applied!"