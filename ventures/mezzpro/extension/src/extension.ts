import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('=== MEZZPRO EXTENSION DEBUG ===');
    console.log('Extension ID:', context.extension.id);
    console.log('Extension Path:', context.extensionPath);
    console.log('Global State Keys:', context.globalState.keys());
    console.log('Workspace State Keys:', context.workspaceState.keys());
    
    try {
        // Register download command
        const downloadCommand = vscode.commands.registerCommand('mezzpro.downloads', () => {
            console.log('📥 MezzPro Downloads command triggered');
            showDownloadCenter();
        });

        context.subscriptions.push(downloadCommand);
        console.log('✅ Command registered successfully');

        // Auto-show download center after short delay
        setTimeout(() => {
            console.log('🚀 Auto-opening download center...');
            vscode.commands.executeCommand('mezzpro.downloads');
        }, 2000);
        
        console.log('✅ MEZZPRO EXTENSION ACTIVATED SUCCESSFULLY');
    } catch (error) {
        console.error('❌ MEZZPRO EXTENSION ACTIVATION FAILED:', error);
        vscode.window.showErrorMessage(`MezzPro Extension Error: ${error}`);
    }
}

function showDownloadCenter() {
    console.log('📱 Creating download center panel...');
    
    const panel = vscode.window.createWebviewPanel(
        'mezzpro-downloads',
        '⛓️ MezzPro Downloads',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MezzPro Downloads</title>
    <style>
        body { 
            font-family: 'Courier New', monospace; 
            padding: 20px; 
            background: #000; 
            color: #00ff41;
        }
        h1 { color: #00ff41; text-align: center; text-shadow: 0 0 10px #00ff41; }
        .download-item { 
            background: rgba(0, 51, 0, 0.3); 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px; 
            border: 1px solid rgba(0, 255, 65, 0.3);
        }
        button { 
            background: #00ff41; 
            color: #000; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 3px; 
            cursor: pointer; 
            margin: 5px;
            font-weight: bold;
        }
        button:hover { 
            background: #006600; 
            color: #00ff41; 
            box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }
    </style>
</head>
<body>
    <h1>⛓️ MezzPro Downloads</h1>
    <div class="download-item">
        <h3>Blockchain Tools</h3>
        <button onclick="download('mezzpro-dev-suite-windows.exe')">Windows Suite</button>
        <button onclick="download('mezzpro-dev-suite-mac.dmg')">Mac Suite</button>
        <button onclick="download('mezzpro-dev-suite-linux.deb')">Linux Suite</button>
    </div>
    <div class="download-item">
        <h3>Smart Contracts</h3>
        <button onclick="download('contract-compiler.zip')">Contract Compiler</button>
        <button onclick="download('contract-templates.zip')">Contract Templates</button>
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
    console.log('🔄 MEZZPRO EXTENSION DEACTIVATED');
}