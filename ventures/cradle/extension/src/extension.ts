import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('=== CRADLE EXTENSION DEBUG ===');
    console.log('Extension ID:', context.extension.id);
    console.log('Extension Path:', context.extensionPath);
    console.log('Global State Keys:', context.globalState.keys());
    console.log('Workspace State Keys:', context.workspaceState.keys());
    
    try {
        // Register download command
        const downloadCommand = vscode.commands.registerCommand('cradle.downloads', () => {
            console.log('📥 Cradle Downloads command triggered');
            showDownloadCenter();
        });

        context.subscriptions.push(downloadCommand);
        console.log('✅ Command registered successfully');

        // Auto-show download center after short delay
        setTimeout(() => {
            console.log('🚀 Auto-opening download center...');
            vscode.commands.executeCommand('cradle.downloads');
        }, 2000);
        
        console.log('✅ CRADLE EXTENSION ACTIVATED SUCCESSFULLY');
    } catch (error) {
        console.error('❌ CRADLE EXTENSION ACTIVATION FAILED:', error);
        vscode.window.showErrorMessage(`Cradle Extension Error: ${error}`);
    }
}

function showDownloadCenter() {
    console.log('📱 Creating download center panel...');
    
    const panel = vscode.window.createWebviewPanel(
        'cradle-downloads',
        '📥 CradleSystem Downloads',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CradleSystem Downloads</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        h1 { color: #333; text-align: center; }
        .download-item { 
            background: white; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        button { 
            background: #007acc; 
            color: white; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 3px; 
            cursor: pointer; 
            margin: 5px;
        }
        button:hover { background: #005a9e; }
    </style>
</head>
<body>
    <h1>🏢 CradleSystem Downloads</h1>
    <div class="download-item">
        <h3>Desktop Applications</h3>
        <button onclick="download('cradle-windows.exe')">Windows App</button>
        <button onclick="download('cradle-mac.dmg')">Mac App</button>
        <button onclick="download('cradle-linux.deb')">Linux App</button>
    </div>
    <div class="download-item">
        <h3>Business Tools</h3>
        <button onclick="download('business-suite.zip')">Business Suite</button>
        <button onclick="download('reports.zip')">Reports Package</button>
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
    console.log('🔄 CRADLE EXTENSION DEACTIVATED');
}