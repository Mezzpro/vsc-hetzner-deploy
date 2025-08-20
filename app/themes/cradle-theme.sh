#!/bin/bash

# Cradle Systems Clean White Theme
echo "🎨 Applying Cradle clean white theme..."

# Create workspace .vscode directory
mkdir -p /home/coder/workspace-admin/.vscode

cat > /home/coder/workspace-admin/.vscode/settings.json <<'EOF'
{
  "workbench.colorTheme": "Default Light+",
  "workbench.iconTheme": null,
  "workbench.activityBar.visible": false,
  "workbench.statusBar.visible": false,
  "workbench.sideBar.location": "left",
  "workbench.panel.defaultLocation": "bottom",
  "workbench.panel.opensMaximized": "never",
  "window.menuBarVisibility": "toggle",
  "window.commandCenter": false,
  "explorer.openEditors.visible": 0,
  "explorer.decorations.badges": false,
  "explorer.decorations.colors": false,
  "workbench.view.extensions.state.hidden": true,
  "editor.minimap.enabled": false,
  "editor.lineNumbers": "off",
  "editor.renderWhitespace": "none",
  "editor.renderLineHighlight": "none",
  "editor.occurrencesHighlight": false,
  "editor.folding": false,
  "editor.glyphMargin": false,
  "editor.renderIndentGuides": false,
  "breadcrumbs.enabled": false,
  "editor.scrollbar.horizontal": "hidden",
  "editor.scrollbar.vertical": "hidden",
  "editor.overviewRulerBorder": false,
  "editor.fontSize": 20,
  "editor.fontFamily": "'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
  "editor.fontWeight": "300",
  "editor.lineHeight": 1.8,
  "editor.letterSpacing": 0.5,
  "workbench.editor.showTabs": "none",
  "zenMode.centerLayout": true,
  "zenMode.hideLineNumbers": true,
  "zenMode.hideTabs": true,
  "zenMode.hideStatusBar": true,
  "zenMode.hideActivityBar": true,
  "zenMode.fullScreen": false,
  "editor.cursorBlinking": "solid",
  "editor.cursorStyle": "block",
  "editor.cursorWidth": 2,
  "editor.smoothScrolling": false,
  "terminal.integrated.fontSize": 16,
  "terminal.integrated.fontFamily": "'SF Mono', Consolas, monospace",
  "terminal.integrated.tabs.enabled": false,
  "debug.console.closeOnEnd": true,
  "debug.openDebug": "neverOpen",
  "extensions.ignoreRecommendations": true,
  "git.openRepositoryInParentFolders": "never",
  "scm.diffDecorations": "none",
  "workbench.colorCustomizations": {
    "editor.background": "#ffffff",
    "editor.foreground": "#2c2c2c",
    "editorCursor.foreground": "#2c2c2c",
    "editor.selectionBackground": "#e8e8e8",
    "editor.lineHighlightBackground": "#fafafa",
    "sideBar.background": "#f8f8f8",
    "activityBar.background": "#f0f0f0",
    "panel.background": "#f8f8f8",
    "statusBar.background": "#f0f0f0",
    "titleBar.activeBackground": "#ffffff",
    "tab.activeBackground": "#ffffff",
    "tab.inactiveBackground": "#f8f8f8"
  },
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": ["comment"],
        "settings": {
          "foreground": "#999999",
          "fontStyle": "italic"
        }
      },
      {
        "scope": ["string", "keyword", "variable", "function", "class"],
        "settings": {
          "foreground": "#2c2c2c"
        }
      }
    ]
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 2000,
  "editor.formatOnSave": true,
  "editor.wordWrap": "on",
  "workbench.startupEditor": "none",
  "workbench.tips.enabled": false,
  "workbench.welcomePage.walkthroughs.openOnInstall": false,
  "workbench.editor.enablePreview": false,
  "workbench.editor.enablePreviewFromQuickOpen": false,
  "telemetry.telemetryLevel": "off",
  "update.showReleaseNotes": false,
  "extensions.showRecommendationsOnlyOnDemand": true,
  "terminal.integrated.showExitAlert": false,
  "workbench.panel.opens": "never",
  "window.title": "Cradle Systems Admin Panel",
  "window.titleSeparator": " • ",
  "workbench.activityBar.iconClickBehavior": "hide",
  "problems.visibility": false,
  "workbench.sideBar.visible": false,
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.value": 3,
  "workbench.editor.limit.perEditorGroup": true,
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
chown -R coder:coder /home/coder/workspace-admin/.vscode

echo "✅ Cradle clean white theme applied"