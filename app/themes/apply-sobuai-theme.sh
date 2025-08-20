#!/bin/bash

# Sobuai Theme - Pink Theme Configuration
# Clean workspace with pink accent colors

echo "🎨 Applying Sobuai pink theme..."

# Create workspace-specific VS Code settings directory
mkdir -p /home/coder/workspace-sobuai/.vscode

# VS Code User Settings - Clean interface with pink theme
cat > /home/coder/workspace-sobuai/.vscode/settings.json << 'EOF'
{
    "workbench.colorTheme": "Quiet Light",
    "workbench.iconTheme": "vs-minimal",
    "workbench.activityBar.visible": true,
    "workbench.statusBar.visible": true,
    "workbench.sideBar.location": "left",
    "workbench.panel.defaultLocation": "right",
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
        // Pink Activity Bar
        "activityBar.background": "#ffd1dc",
        "activityBar.foreground": "#d1006c",
        "activityBar.activeBorder": "#ff69b4",
        "activityBar.activeBackground": "#ffb6c1",
        "activityBar.inactiveForeground": "#d1006c80",
        "activityBarBadge.background": "#ff1493",
        "activityBarBadge.foreground": "#ffffff",
        
        // Pink Status Bar
        "statusBar.background": "#ff69b4",
        "statusBar.foreground": "#ffffff",
        "statusBar.border": "#ff1493",
        "statusBar.debuggingBackground": "#d1006c",
        "statusBar.noFolderBackground": "#ff1493",
        
        // Pink Title Bar
        "titleBar.activeBackground": "#ffc0cb",
        "titleBar.activeForeground": "#8b0051",
        "titleBar.inactiveBackground": "#ffd1dc",
        "titleBar.inactiveForeground": "#8b005180",
        "titleBar.border": "#ffb6c1",
        
        // Pink Editor Background
        "editor.background": "#fefcfd",
        "editor.foreground": "#8b0051",
        "editorCursor.foreground": "#ff1493",
        "editorLineNumber.foreground": "#ff69b480",
        "editorLineNumber.activeForeground": "#ff1493",
        "editor.selectionBackground": "#ffb6c150",
        "editor.selectionHighlightBackground": "#ffc0cb40",
        "editor.wordHighlightBackground": "#ffd1dc60",
        "editor.lineHighlightBackground": "#fff0f550",
        
        // Pink Sidebar
        "sideBar.background": "#fef7f9",
        "sideBar.foreground": "#8b0051",
        "sideBar.border": "#ffb6c1",
        "sideBarTitle.foreground": "#d1006c",
        "sideBarSectionHeader.background": "#ffd1dc",
        "sideBarSectionHeader.foreground": "#8b0051",
        "sideBarSectionHeader.border": "#ffb6c1",
        
        // Pink Explorer
        "list.activeSelectionBackground": "#ffb6c1",
        "list.activeSelectionForeground": "#8b0051",
        "list.hoverBackground": "#ffd1dc",
        "list.hoverForeground": "#8b0051",
        "list.inactiveSelectionBackground": "#ffc0cb",
        "list.inactiveSelectionForeground": "#8b0051",
        "list.focusBackground": "#ffb6c1",
        "list.focusForeground": "#8b0051",
        
        // Pink Tabs
        "tab.activeBackground": "#fefcfd",
        "tab.activeForeground": "#8b0051",
        "tab.activeBorder": "#ff1493",
        "tab.activeBorderTop": "#ff69b4",
        "tab.inactiveBackground": "#fef7f9",
        "tab.inactiveForeground": "#8b005180",
        "tab.border": "#ffb6c1",
        "tab.hoverBackground": "#fff0f5",
        "tab.hoverForeground": "#8b0051",
        
        // Pink Panel
        "panel.background": "#fef7f9",
        "panel.border": "#ff69b4",
        "panelTitle.activeBorder": "#ff1493",
        "panelTitle.activeForeground": "#8b0051",
        "panelTitle.inactiveForeground": "#8b005180",
        
        // Pink Terminal
        "terminal.background": "#fef7f9",
        "terminal.foreground": "#8b0051",
        "terminal.ansiMagenta": "#ff69b4",
        "terminal.ansiBrightMagenta": "#ff1493",
        "terminal.selectionBackground": "#ffb6c150",
        "terminalCursor.background": "#ff1493",
        "terminalCursor.foreground": "#fefcfd",
        
        // Pink UI Elements
        "button.background": "#ff69b4",
        "button.foreground": "#ffffff",
        "button.hoverBackground": "#ff1493",
        "button.border": "#ff1493",
        "progressBar.background": "#ff69b4",
        "scrollbarSlider.background": "#ff69b450",
        "scrollbarSlider.hoverBackground": "#ff69b480",
        "scrollbarSlider.activeBackground": "#ff1493",
        
        // Pink Widgets and Inputs
        "editorWidget.background": "#ffd1dc",
        "editorWidget.border": "#ff69b4",
        "editorWidget.foreground": "#8b0051",
        "input.background": "#fff0f5",
        "input.border": "#ffb6c1",
        "input.foreground": "#8b0051",
        "input.placeholderForeground": "#8b005180",
        "inputOption.activeBorder": "#ff69b4",
        "inputOption.activeBackground": "#ffb6c180",
        "inputOption.activeForeground": "#8b0051",
        "focusBorder": "#ff69b4",
        
        // Pink Menu
        "menu.background": "#fef7f9",
        "menu.foreground": "#8b0051",
        "menu.border": "#ffb6c1",
        "menu.selectionBackground": "#ffb6c1",
        "menu.selectionForeground": "#8b0051",
        "menu.separatorBackground": "#ffb6c1",
        
        // Pink Dropdown
        "dropdown.background": "#fff0f5",
        "dropdown.foreground": "#8b0051",
        "dropdown.border": "#ffb6c1",
        "dropdown.listBackground": "#fef7f9"
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
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": ["comment"],
                "settings": {
                    "foreground": "#ff69b4",
                    "fontStyle": "italic"
                }
            },
            {
                "scope": ["string"],
                "settings": {
                    "foreground": "#d1006c"
                }
            },
            {
                "scope": ["keyword", "storage.type"],
                "settings": {
                    "foreground": "#ff1493",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["variable", "support.variable"],
                "settings": {
                    "foreground": "#8b0051"
                }
            },
            {
                "scope": ["function", "entity.name.function"],
                "settings": {
                    "foreground": "#c2185b",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": ["constant.numeric"],
                "settings": {
                    "foreground": "#e91e63"
                }
            },
            {
                "scope": ["entity.name.class", "entity.name.type"],
                "settings": {
                    "foreground": "#ad1457",
                    "fontStyle": "bold"
                }
            }
        ]
    },
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

# Copy auto-terminal tasks.json
cp /home/coder/tasks/tasks.json /home/coder/workspace-sobuai/.vscode/tasks.json

# Set proper ownership
chown -R coder:coder /home/coder/workspace-sobuai/.vscode

echo "✅ Sobuai pink theme applied with auto-terminal!"