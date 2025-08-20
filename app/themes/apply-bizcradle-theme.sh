#!/bin/bash

# Bizcradle Theme - Orange Theme Configuration  
# Clean workspace with orange accent colors

echo "🎨 Applying Bizcradle orange theme..."

# Create VS Code settings directory
mkdir -p /home/coder/.local/share/code-server/User

# VS Code User Settings - Clean interface with orange theme
cat > /home/coder/workspace-bizcradle/.vscode/settings.json << 'EOF'
{
    "workbench.colorTheme": "Default Dark+",
    "workbench.iconTheme": null,
    "workbench.activityBar.visible": true,
    "workbench.statusBar.visible": true,
    "workbench.sideBar.location": "left",
    "workbench.panel.defaultLocation": "left",
    "window.menuBarVisibility": "classic",
    "window.commandCenter": false,
    "window.titleBarStyle": "native",
    "editor.minimap.enabled": false,
    "editor.lineNumbers": "on",
    "editor.renderWhitespace": "none",
    "editor.renderLineHighlight": "line",
    "editor.bracketPairColorization.enabled": false,
    "editor.guides.bracketPairs": "never",
    "editor.folding": false,
    "editor.glyphMargin": false,
    "breadcrumbs.enabled": false,
    "editor.scrollbar.horizontal": "visible",
    "editor.scrollbar.vertical": "visible",
    "editor.fontSize": 14,
    "editor.fontFamily": "'IBM Plex Mono', 'Courier New', 'Lucida Console', monospace",
    "editor.fontWeight": "normal",
    "editor.lineHeight": 1.2,
    "editor.letterSpacing": 0,
    "editor.cursorBlinking": "blink",
    "editor.cursorStyle": "underline",
    "editor.cursorWidth": 1,
    "editor.smoothScrolling": false,
    "editor.cursorSmoothCaretAnimation": "off",
    "workbench.list.smoothScrolling": false,
    "terminal.integrated.fontSize": 14,
    "terminal.integrated.fontFamily": "'IBM Plex Mono', 'Courier New', monospace",
    "terminal.integrated.fontWeight": "normal",
    "terminal.integrated.cursorBlinking": true,
    "terminal.integrated.cursorStyle": "underline",
    "terminal.integrated.tabs.enabled": false,
    "debug.console.closeOnEnd": true,
    "debug.openDebug": "neverOpen",
    "extensions.ignoreRecommendations": true,
    "git.decorations.enabled": false,
    "scm.diffDecorations": "none",
    "workbench.colorCustomizations": {
        "editor.background": "#2b1810",
        "editor.foreground": "#ffb000",
        "editorCursor.foreground": "#ffb000",
        "editor.selectionBackground": "#4d2f1a",
        "editor.lineHighlightBackground": "#3d251a",
        "editor.wordHighlightBackground": "#4d2f1a",
        "sideBar.background": "#1f1208",
        "sideBar.foreground": "#cc8800",
        "activityBar.background": "#1a0f06",
        "activityBar.foreground": "#ffb000",
        "panel.background": "#2b1810",
        "panel.border": "#ffb000",
        "panelTitle.activeForeground": "#ffb000",
        "panelTitle.inactiveForeground": "#cc8800",
        "statusBar.background": "#1a0f06",
        "statusBar.foreground": "#ffb000",
        "statusBar.border": "#ffb000",
        "titleBar.activeBackground": "#2b1810",
        "titleBar.activeForeground": "#ffb000",
        "tab.activeBackground": "#3d251a",
        "tab.activeForeground": "#ffb000",
        "tab.inactiveBackground": "#1f1208",
        "tab.inactiveForeground": "#cc8800",
        "tab.border": "#4d2f1a",
        "terminal.background": "#1a0f06",
        "terminal.foreground": "#ffb000",
        "terminalCursor.background": "#ffb000",
        "terminalCursor.foreground": "#1a0f06",
        "scrollbar.shadow": "#000000",
        "scrollbarSlider.background": "#4d2f1a",
        "scrollbarSlider.hoverBackground": "#664020",
        "scrollbarSlider.activeBackground": "#805028",
        "editorLineNumber.foreground": "#996600",
        "editorLineNumber.activeForeground": "#ffb000",
        "editorBracketMatch.background": "#4d2f1a",
        "editorBracketMatch.border": "#ffb000",
        "editorRuler.foreground": "#4d2f1a",
        "button.background": "#ffb000",
        "button.foreground": "#1a0f06",
        "input.background": "#3d251a",
        "input.foreground": "#ffb000",
        "input.border": "#ffb000"
    },
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": ["comment"],
                "settings": {
                    "foreground": "#996600",
                    "fontStyle": "italic"
                }
            },
            {
                "scope": ["string"],
                "settings": {
                    "foreground": "#cc8800"
                }
            },
            {
                "scope": ["keyword", "storage.type"],
                "settings": {
                    "foreground": "#ffb000",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["variable", "support.variable"],
                "settings": {
                    "foreground": "#e6a000"
                }
            },
            {
                "scope": ["function", "entity.name.function"],
                "settings": {
                    "foreground": "#ffcc33",
                    "fontStyle": "normal"
                }
            },
            {
                "scope": ["constant.numeric"],
                "settings": {
                    "foreground": "#ffcc33"
                }
            },
            {
                "scope": ["entity.name.class", "entity.name.type"],
                "settings": {
                    "foreground": "#cc8800",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["punctuation"],
                "settings": {
                    "foreground": "#b38600"
                }
            }
        ]
    },
    "files.autoSave": "off",
    "editor.formatOnSave": false,
    "editor.rulers": [80],
    "editor.wordWrap": "off",
    "editor.tabSize": 8,
    "editor.insertSpaces": false,
    "workbench.tree.indent": 8,
    "workbench.tree.renderIndentGuides": "none",
    "workbench.hover.delay": 1000,
    "git.autofetch": false,
    "git.confirmSync": true,
    "git.enableSmartCommit": false,
    "workbench.startupEditor": "none",
    "telemetry.telemetryLevel": "off",
    "update.showReleaseNotes": false,
    "extensions.showRecommendationsOnlyOnDemand": true,
    "editor.suggest.showIcons": false,
    "editor.parameterHints.enabled": false,
    "editor.quickSuggestions": false,
    "editor.wordBasedSuggestions": false,
    "editor.acceptSuggestionOnCommitCharacter": false,
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