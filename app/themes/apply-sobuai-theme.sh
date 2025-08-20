#!/bin/bash

# Sobuai Theme - Pink Theme Configuration
# Clean workspace with pink accent colors

echo "🎨 Applying Sobuai pink theme..."

# Create VS Code settings directory
mkdir -p /home/coder/.local/share/code-server/User

# VS Code User Settings - Clean interface with pink theme
cat > /home/coder/workspace-sobuai/.vscode/settings.json << 'EOF'
{
    "workbench.colorTheme": "Quiet Light",
    "workbench.iconTheme": "vs-minimal",
    "workbench.activityBar.visible": true,
    "workbench.statusBar.visible": true,
    "workbench.sideBar.location": "left",
    "workbench.panel.defaultLocation": "bottom",
    "window.menuBarVisibility": "compact",
    "window.commandCenter": true,
    "editor.minimap.enabled": true,
    "editor.lineNumbers": "on",
    "editor.renderWhitespace": "selection",
    "editor.renderLineHighlight": "all",
    "editor.folding": true,
    "breadcrumbs.enabled": true,
    "editor.scrollbar.horizontal": "auto",
    "editor.scrollbar.vertical": "auto",
    "editor.fontSize": 16,
    "editor.fontFamily": "'Cascadia Code', 'Fira Code', Consolas, monospace",
    "editor.fontWeight": "400",
    "editor.lineHeight": 1.6,
    "editor.letterSpacing": 0.3,
    "editor.fontLigatures": true,
    "editor.cursorBlinking": "smooth",
    "editor.cursorStyle": "line",
    "editor.cursorWidth": 3,
    "editor.smoothScrolling": true,
    "terminal.integrated.fontSize": 14,
    "terminal.integrated.fontFamily": "'Cascadia Mono', Consolas, monospace",
    "terminal.integrated.cursorBlinking": true,
    "debug.console.closeOnEnd": true,
    "debug.openDebug": "neverOpen",
    "extensions.ignoreRecommendations": true,
    "git.openRepositoryInParentFolders": "never",
    "workbench.colorCustomizations": {
        "activityBar.background": "#ffd1dc",
        "activityBar.foreground": "#d1006c",
        "activityBar.activeBorder": "#ff69b4",
        "activityBar.activeBackground": "#ffb6c1",
        "activityBarBadge.background": "#ff1493",
        "activityBarBadge.foreground": "#ffffff",
        "statusBar.background": "#ff69b4",
        "statusBar.foreground": "#ffffff",
        "statusBar.debuggingBackground": "#d1006c",
        "statusBar.noFolderBackground": "#ff1493",
        "titleBar.activeBackground": "#ffc0cb",
        "titleBar.activeForeground": "#8b0051",
        "titleBar.inactiveBackground": "#ffd1dc",
        "button.background": "#ff69b4",
        "button.foreground": "#ffffff",
        "button.hoverBackground": "#ff1493",
        "editorCursor.foreground": "#ff1493",
        "editorLineNumber.activeForeground": "#ff1493",
        "editor.selectionBackground": "#ffb6c150",
        "editor.selectionHighlightBackground": "#ffc0cb40",
        "editor.wordHighlightBackground": "#ffd1dc60",
        "progressBar.background": "#ff69b4",
        "scrollbarSlider.background": "#ff69b450",
        "scrollbarSlider.hoverBackground": "#ff69b480",
        "terminal.ansiMagenta": "#ff69b4",
        "terminal.ansiBrightMagenta": "#ff1493",
        "terminal.selectionBackground": "#ffb6c150",
        "list.activeSelectionBackground": "#ffb6c1",
        "list.activeSelectionForeground": "#8b0051",
        "list.hoverBackground": "#ffd1dc",
        "list.inactiveSelectionBackground": "#ffc0cb",
        "editorWidget.background": "#ffd1dc",
        "editorWidget.border": "#ff69b4",
        "input.background": "#fff0f5",
        "input.border": "#ffb6c1",
        "focusBorder": "#ff69b4"
    },
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "editor.formatOnSave": true,
    "editor.wordWrap": "on",
    "workbench.startupEditor": "none",
    "workbench.tips.enabled": false,
    "telemetry.telemetryLevel": "off",
    "update.showReleaseNotes": false,
    "window.title": "Pink Paradise - ${activeEditorShort}",
    "window.titleSeparator": " 💕 ",
    "explorer.decorations.badges": true,
    "explorer.decorations.colors": true,
    "workbench.tree.renderIndentGuides": "always",
    "workbench.tree.indent": 20,
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
chown -R coder:coder /home/coder/workspace-sobuai/.vscode

echo "✅ Sobuai pink theme applied!"