#!/bin/bash

# MezzPro Matrix Green Theme
echo "🎨 Applying MezzPro matrix green theme..."

# Create workspace .vscode directory
mkdir -p /home/coder/workspace-mezzpro/.vscode

cat > /home/coder/workspace-mezzpro/.vscode/settings.json <<'EOF'
{
  "workbench.colorTheme": "Default Dark+",
  "workbench.iconTheme": "vs-minimal",
  "workbench.activityBar.visible": false,
  "workbench.statusBar.visible": true,
  "workbench.sideBar.location": "left",
  "workbench.auxiliaryBar.location": "right",
  "workbench.panel.defaultLocation": "bottom",
  "workbench.panel.opensMaximized": false,
  "window.menuBarVisibility": "compact",
  "window.commandCenter": true,
  "editor.minimap.enabled": true,
  "editor.minimap.renderCharacters": false,
  "editor.minimap.maxColumn": 80,
  "editor.lineNumbers": "on",
  "editor.renderWhitespace": "boundary",
  "editor.renderLineHighlight": "all",
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.folding": true,
  "editor.glyphMargin": true,
  "breadcrumbs.enabled": true,
  "editor.fontSize": 14,
  "editor.fontFamily": "'Courier New', 'Lucida Console', 'Monaco', monospace",
  "editor.fontWeight": "bold",
  "editor.lineHeight": 1.4,
  "editor.letterSpacing": 0.8,
  "editor.cursorBlinking": "expand",
  "editor.cursorStyle": "block",
  "editor.cursorWidth": 4,
  "editor.smoothScrolling": true,
  "editor.cursorSmoothCaretAnimation": "on",
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'Courier New', monospace",
  "terminal.integrated.fontWeight": "bold",
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyle": "block",
  "debug.console.closeOnEnd": true,
  "debug.openDebug": "neverOpen", 
  "extensions.ignoreRecommendations": true,
  "git.decorations.enabled": false,
  "scm.diffDecorations": "none",
  "workbench.colorCustomizations": {
    "editor.background": "#000000",
    "editor.foreground": "#00ff41",
    "editorCursor.foreground": "#00ff41",
    "editor.selectionBackground": "#003300",
    "editor.lineHighlightBackground": "#001100",
    "editor.wordHighlightBackground": "#002200",
    "sideBar.background": "#0a0a0a",
    "sideBar.foreground": "#00cc33",
    "activityBar.background": "#050505",
    "activityBar.foreground": "#00ff41",
    "panel.background": "#000000",
    "panel.border": "#00ff41",
    "statusBar.background": "#000000",
    "statusBar.foreground": "#00ff41",
    "statusBar.border": "#00ff41",
    "titleBar.activeBackground": "#000000",
    "titleBar.activeForeground": "#00ff41",
    "tab.activeBackground": "#001100",
    "tab.activeForeground": "#00ff41",
    "tab.inactiveBackground": "#000000",
    "tab.inactiveForeground": "#009922",
    "tab.border": "#00ff41",
    "terminal.background": "#000000",
    "terminal.foreground": "#00ff41",
    "terminalCursor.background": "#00ff41",
    "terminalCursor.foreground": "#000000",
    "scrollbar.shadow": "#00ff41",
    "editorRuler.foreground": "#003300",
    "editorBracketMatch.background": "#006600",
    "editorBracketMatch.border": "#00ff41",
    "minimap.background": "#000000",
    "minimapSlider.background": "#003300",
    "minimapSlider.hoverBackground": "#006600"
  },
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": ["comment"],
        "settings": {
          "foreground": "#006600",
          "fontStyle": "italic"
        }
      },
      {
        "scope": ["string"],
        "settings": {
          "foreground": "#00cc33"
        }
      },
      {
        "scope": ["keyword", "storage.type"],
        "settings": {
          "foreground": "#00ff41",
          "fontStyle": "bold"
        }
      },
      {
        "scope": ["variable", "support.variable"],
        "settings": {
          "foreground": "#33ff66"
        }
      },
      {
        "scope": ["function", "entity.name.function"],
        "settings": {
          "foreground": "#66ff99",
          "fontStyle": "bold"
        }
      },
      {
        "scope": ["constant.numeric"],
        "settings": {
          "foreground": "#99ffcc"
        }
      }
    ]
  },
  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "editor.rulers": [80, 120],
  "editor.wordWrap": "bounded",
  "editor.wordWrapColumn": 120,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "workbench.startupEditor": "none",
  "telemetry.telemetryLevel": "off",
  "update.showReleaseNotes": false,
  "extensions.showRecommendationsOnlyOnDemand": true,
  "window.title": "MezzPro Blockchain Platform",
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
cp /home/coder/tasks/tasks.json /home/coder/workspace-mezzpro/.vscode/tasks.json

# Copy keybindings for secondary sidebar terminal
cp /home/coder/keybindings/keybindings.json /home/coder/workspace-mezzpro/.vscode/keybindings.json

# Set proper ownership
chown -R coder:coder /home/coder/workspace-mezzpro/.vscode

echo "✅ MezzPro matrix green theme applied with auto-terminal"