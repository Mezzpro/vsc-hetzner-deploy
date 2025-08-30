import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('=== BIZCRADLE EXTENSION DEBUG ===');
    console.log('Extension ID:', context.extension.id);
    console.log('Extension Path:', context.extensionPath);
    console.log('Global State Keys:', context.globalState.keys());
    console.log('Workspace State Keys:', context.workspaceState.keys());
    
    try {
        // Register download command
        const downloadCommand = vscode.commands.registerCommand('bizcradle.downloads', () => {
            console.log('📥 Bizcradle Downloads command triggered');
            showDownloadCenter();
        });

        context.subscriptions.push(downloadCommand);
        console.log('✅ Command registered successfully');

        // Auto-show download center after short delay
        setTimeout(() => {
            console.log('🚀 Auto-opening download center...');
            vscode.commands.executeCommand('bizcradle.downloads');
        }, 2000);
        
        console.log('✅ BIZCRADLE EXTENSION ACTIVATED SUCCESSFULLY');
    } catch (error) {
        console.error('❌ BIZCRADLE EXTENSION ACTIVATION FAILED:', error);
        vscode.window.showErrorMessage(`Bizcradle Extension Error: ${error}`);
    }
}

function showDownloadCenter() {
    console.log('📱 Creating download center panel...');
    
    const panel = vscode.window.createWebviewPanel(
        'bizcradle-downloads',
        '🚀 Bizcradle Downloads',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bizcradle Downloads</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #1e1e1e; 
            color: #ffffff;
        }
        h1 { color: #ffffff; text-align: center; }
        .download-item { 
            background: #2d2d30; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px; 
            border: 1px solid #3e3e42;
        }
        button { 
            background: #007acc; 
            color: #ffffff; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 3px; 
            cursor: pointer; 
            margin: 5px;
        }
        button:hover { background: #005a9e; }
        .secondary { background: #3c3c3c; border: 1px solid #565656; }
        .secondary:hover { background: #4a4a4a; }
    </style>
</head>
<body>
    <h1>🚀 Bizcradle Downloads</h1>
    <div class="download-item">
        <h3>Marketing Apps</h3>
        <button onclick="download('bizcradle-marketing-windows.exe')">Windows App</button>
        <button onclick="download('bizcradle-marketing-mac.dmg')">Mac App</button>
        <button onclick="download('bizcradle-marketing-linux.deb')">Linux App</button>
    </div>
    <div class="download-item">
        <h3>Analytics Suite</h3>
        <button onclick="download('marketing-analytics.zip')">Analytics Dashboard</button>
        <button class="secondary" onclick="download('roi-calculator.zip')">ROI Calculator</button>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        function download(file) {
            console.log('Download requested:', file);
            vscode.postMessage({ command: 'download', file: file });
        }
    </script>
</body>
</html>`;

    panel.webview.onDidReceiveMessage(message => {
        if (message.command === 'download') {
            vscode.window.showInformationMessage(`📥 Downloading: ${message.file}`);
            console.log('📥 Download requested:', message.file);
        }
    });

    console.log('✅ Download center created successfully');
}

export function deactivate() {
    console.log('🔄 BIZCRADLE EXTENSION DEACTIVATED');
}