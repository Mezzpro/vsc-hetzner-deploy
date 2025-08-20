#!/bin/bash

# MinQro Blue Tech Theme
echo "🎨 Applying MinQro blue tech theme..."

# Create workspace .vscode directory
mkdir -p /home/coder/workspace-minqro/.vscode

cat > /home/coder/workspace-minqro/.vscode/settings.json <<'EOF'
{
  "workbench.colorTheme": "Default Dark+",
  "workbench.iconTheme": "vs-seti",
  "workbench.activityBar.visible": false,
  "workbench.statusBar.visible": true,
  "workbench.sideBar.location": "right",
  "workbench.panel.defaultLocation": "right",
  "window.menuBarVisibility": "compact",
  "window.commandCenter": true,
  "editor.minimap.enabled": true,
  "editor.minimap.renderCharacters": true,
  "editor.minimap.maxColumn": 100,
  "editor.lineNumbers": "on",
  "editor.renderWhitespace": "selection",
  "editor.renderLineHighlight": "gutter",
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "always",
  "editor.folding": true,
  "editor.glyphMargin": true,
  "breadcrumbs.enabled": true,
  "editor.fontSize": 16,
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  "editor.fontWeight": "400",
  "editor.lineHeight": 1.6,
  "editor.letterSpacing": 0.2,
  "editor.fontLigatures": true,
  "editor.cursorBlinking": "smooth",
  "editor.cursorStyle": "line",
  "editor.cursorWidth": 2,
  "editor.smoothScrolling": true,
  "editor.cursorSmoothCaretAnimation": "on",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.fontFamily": "'JetBrains Mono', monospace",
  "terminal.integrated.fontWeight": "normal",
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.showExitAlert": false,
  "terminal.integrated.splitCwd": "workspaceRoot",
  "terminal.integrated.lineHeight": 1.2,
  "terminal.integrated.showLinkHover": false,
  "terminal.integrated.profiles.linux": {
    "Gemini AI": {
      "path": "/bin/bash",
      "args": [
        "-c",
        "gemini"
      ],
      "icon": "robot",
      "overrideName": true
    },
    "Bash": {
      "path": "/bin/bash",
      "args": ["-l"],
      "icon": "terminal-bash"
    }
  },
  "terminal.integrated.defaultProfile.linux": "Gemini AI",
  "terminal.integrated.automationProfile.linux": {
    "path": "/bin/bash",
    "args": ["-c", "gemini"]
  },
  "terminal.integrated.showOnStartup": "startupProject",
  "terminal.integrated.focusAfterOpen": true,
  "debug.console.closeOnEnd": true,
  "debug.openDebug": "openOnSessionStart",
  "extensions.ignoreRecommendations": false,
  "git.decorations.enabled": true,
  "scm.diffDecorations": "all",
  "workbench.colorCustomizations": {
    "editor.background": "#0a0f1c",
    "editor.foreground": "#64b5f6",
    "editorCursor.foreground": "#42a5f5",
    "editor.selectionBackground": "#1565c0aa",
    "editor.lineHighlightBackground": "#0d47a1aa",
    "editor.wordHighlightBackground": "#1976d2aa",
    "sideBar.background": "#0c1524",
    "sideBar.foreground": "#81c784",
    "activityBar.background": "#081221",
    "activityBar.foreground": "#42a5f5",
    "panel.background": "#0a0f1c",
    "panel.border": "#1976d2",
    "statusBar.background": "#0d47a1",
    "statusBar.foreground": "#ffffff",
    "statusBar.border": "#1976d2",
    "titleBar.activeBackground": "#0c1524",
    "titleBar.activeForeground": "#64b5f6",
    "tab.activeBackground": "#1565c0",
    "tab.activeForeground": "#ffffff",
    "tab.inactiveBackground": "#0a0f1c",
    "tab.inactiveForeground": "#90caf9",
    "tab.border": "#1976d2",
    "terminal.background": "#0a0f1c",
    "terminal.foreground": "#64b5f6",
    "terminalCursor.background": "#42a5f5",
    "terminalCursor.foreground": "#0a0f1c",
    "scrollbar.shadow": "#1976d2",
    "editorRuler.foreground": "#1565c0",
    "editorBracketMatch.background": "#1976d2aa",
    "editorBracketMatch.border": "#42a5f5",
    "minimap.background": "#0a0f1c",
    "minimapSlider.background": "#1565c0aa",
    "minimapSlider.hoverBackground": "#1976d2aa"
  },
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": ["comment"],
        "settings": {
          "foreground": "#4fc3f7",
          "fontStyle": "italic"
        }
      },
      {
        "scope": ["string"],
        "settings": {
          "foreground": "#81c784"
        }
      },
      {
        "scope": ["keyword", "storage.type"],
        "settings": {
          "foreground": "#42a5f5",
          "fontStyle": "bold"
        }
      },
      {
        "scope": ["variable", "support.variable"],
        "settings": {
          "foreground": "#90caf9"
        }
      },
      {
        "scope": ["function", "entity.name.function"],
        "settings": {
          "foreground": "#66bb6a",
          "fontStyle": "bold"
        }
      },
      {
        "scope": ["constant.numeric"],
        "settings": {
          "foreground": "#ffab40"
        }
      },
      {
        "scope": ["class", "entity.name.class"],
        "settings": {
          "foreground": "#7986cb",
          "fontStyle": "bold"
        }
      }
    ]
  },
  "files.autoSave": "onWindowChange",
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "editor.rulers": [80, 100, 120],
  "editor.wordWrap": "wordWrapColumn",
  "editor.wordWrapColumn": 100,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "git.decorations.enabled": true,
  "workbench.startupEditor": "none",
  "telemetry.telemetryLevel": "off",
  "update.showReleaseNotes": false,
  "extensions.showRecommendationsOnlyOnDemand": false,
  "window.title": "MinQro Analytics Platform",
  "workbench.view.extensions.state.hidden": false,
  "problems.visibility": true,
  "editor.inlayHints.enabled": "on",
  "workbench.editorAssociations": {
    "*.html": "default",
    "*.md": "vscode.markdown.preview.editor"
  },
  "workbench.editor.enablePreview": true,
  "workbench.editor.enablePreviewFromQuickOpen": true,
  "workbench.editor.chat.enabled": true,
  "workbench.editor.processExplorer.enabled": true,
  "workbench.editor.terminalEditor.enabled": true,
  "workbench.editor.imagePreview.enabled": true,
  "workbench.editor.audioPreview.enabled": true,
  "workbench.editor.videoPreview.enabled": true,
  "workbench.editor.markdownPreview.enabled": true,
  "workbench.editor.simpleBrowser.enabled": true,
  "workbench.editor.livePreview.enabled": true,
  "workbench.editor.notebookOutputEditor.enabled": true,
  "workbench.editor.jupyterNotebook.enabled": true,
  "workbench.editor.replEditor.enabled": true,
  "workbench.editor.welcomePage.enabled": true,
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
cp /home/coder/tasks/tasks.json /home/coder/workspace-minqro/.vscode/tasks.json

# Set up workspace environment variables
echo 'export GEMINI_API_KEY="$GEMINI_API_KEY"' >> /home/coder/workspace-minqro/.bashrc

# Install Live Preview extension
echo "📦 Installing Live Preview extension..."
code-server --install-extension ms-vscode.live-server --force

# Create basic HTML files
cat > /home/coder/workspace-minqro/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MinQro</title>
    <style>
        body {
            font-family: 'JetBrains Mono', monospace;
            background: linear-gradient(135deg, #0a0f1c, #1565c0);
            color: #64b5f6;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        h1 {
            font-size: 3em;
            margin-bottom: 20px;
            color: #42a5f5;
        }
        p {
            font-size: 1.2em;
            margin-bottom: 30px;
            color: #90caf9;
        }
    </style>
</head>
<body>
    <h1>Welcome to MinQro</h1>
    <p>Analytics Platform Ready for Action!</p>
</body>
</html>
EOF

cat > /home/coder/workspace-minqro/download.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MinQro Downloads</title>
    <style>
        body {
            font-family: 'JetBrains Mono', monospace;
            background: linear-gradient(135deg, #0a0f1c, #1565c0);
            color: #64b5f6;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            color: #42a5f5;
        }
        p {
            font-size: 1.2em;
            margin-bottom: 30px;
            color: #90caf9;
        }
        a {
            color: #ffffff;
            background: rgba(66, 165, 245, 0.2);
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            display: inline-block;
            margin: 10px;
            border: 1px solid #42a5f5;
        }
        a:hover {
            background: rgba(66, 165, 245, 0.3);
        }
    </style>
</head>
<body>
    <h1>MinQro Downloads</h1>
    <p>Following is the download link:</p>
    <a href="https://fake-download.minqro.com/analytics-suite.zip">Download Analytics Suite</a>
    <br><br>
    <a href="https://fake-download.minqro.com/minqro-installer.exe">Download MinQro Installer</a>
</body>
</html>
EOF

# Set proper ownership
chown -R coder:coder /home/coder/workspace-minqro/.vscode
chown coder:coder /home/coder/workspace-minqro/.bashrc
chown coder:coder /home/coder/workspace-minqro/index.html
chown coder:coder /home/coder/workspace-minqro/download.html

echo "✅ MinQro blue tech theme applied with auto-terminal, Gemini API, and Live Preview"