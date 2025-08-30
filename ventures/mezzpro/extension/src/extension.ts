import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    console.log('⛓️ MEZZPRO EXTENSION ACTIVATION STARTED!');

    // Check if we're in MezzPro workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const isMezzProWorkspace = workspaceFolders?.some(folder => 
        folder.uri.path.includes('mezzpro') || folder.name === 'mezzpro'
    );

    if (!isMezzProWorkspace) {
        console.log('ℹ️ Not in MezzPro workspace, extension will remain dormant');
        return;
    }

    console.log('✅ MezzPro workspace detected, initializing download center...');

    // Register simple download command
    const downloadCommand = vscode.commands.registerCommand('mezzpro.downloads', () => {
        console.log('📥 MezzPro Downloads command executed!');
        createDownloadTab(context);
    });

    context.subscriptions.push(downloadCommand);

    // Auto-open download center
    setTimeout(() => {
        console.log('🚀 Auto-opening MezzPro download center...');
        vscode.commands.executeCommand('mezzpro.downloads');
    }, 1000);

    console.log('✅ MEZZPRO EXTENSION ACTIVATION COMPLETED!');
}

function createDownloadTab(context: vscode.ExtensionContext): void {
    const panel = vscode.window.createWebviewPanel(
        'mezzpro-downloads',
        '⛓️ MezzPro Downloads',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getDownloadsHTML();
    
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'download':
                    vscode.window.showInformationMessage(`Downloading: ${message.file}`);
                    break;
            }
        }
    );
}

function getDownloadsHTML(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MezzPro Downloads</title>
        <style>
            body {
                font-family: 'Courier New', monospace;
                margin: 0;
                padding: 24px;
                background: #000000;
                color: #00ff41;
                line-height: 1.5;
                background-image: 
                    radial-gradient(circle at 25% 25%, #003300 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, #001100 0%, transparent 50%);
            }
            .header {
                text-align: center;
                padding: 32px 24px;
                border-bottom: 2px solid #00ff41;
                margin-bottom: 32px;
                box-shadow: 0 2px 10px rgba(0, 255, 65, 0.3);
            }
            .header h1 {
                margin: 0 0 16px 0;
                color: #00ff41;
                font-size: 2.5rem;
                font-weight: 600;
                text-shadow: 0 0 10px #00ff41;
                animation: matrixGlow 2s ease-in-out infinite;
            }
            .header p {
                margin: 0;
                color: #00ff41;
                font-size: 1.1rem;
                opacity: 0.8;
            }
            .downloads-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .download-card {
                background: rgba(0, 51, 0, 0.3);
                border: 1px solid rgba(0, 255, 65, 0.3);
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
                transition: all 0.2s ease;
                backdrop-filter: blur(5px);
            }
            .download-card:hover {
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
                transform: translateY(-2px);
                border-color: #00ff41;
            }
            .download-card h3 {
                margin: 0 0 16px 0;
                color: #00ff41;
                font-size: 1.25rem;
                font-weight: 600;
                text-shadow: 0 0 5px currentColor;
            }
            .download-card p {
                margin: 0 0 20px 0;
                color: #00ff41;
                opacity: 0.8;
            }
            .download-btn {
                background: #00ff41;
                color: #000000;
                border: 1px solid #00ff41;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
                margin-right: 12px;
                margin-bottom: 8px;
                box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
                text-shadow: none;
            }
            .download-btn:hover {
                background: #006600;
                color: #00ff41;
                transform: translateY(-1px);
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
                text-shadow: 0 0 5px currentColor;
            }
            .download-btn-secondary {
                background: rgba(0, 51, 0, 0.5);
                color: #00ff41;
                border: 1px solid rgba(0, 255, 65, 0.5);
            }
            .download-btn-secondary:hover {
                background: rgba(0, 102, 0, 0.3);
                border-color: #00ff41;
            }
            @keyframes matrixGlow {
                0%, 100% { 
                    text-shadow: 0 0 10px #00ff41; 
                }
                50% { 
                    text-shadow: 0 0 20px #00ff41, 0 0 30px #00ff41; 
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>⛓️ MezzPro Downloads</h1>
            <p>Blockchain development tools and applications</p>
        </div>
        
        <div class="downloads-grid">
            <div class="download-card">
                <h3>🖥️ Blockchain Tools</h3>
                <p>Development and deployment tools for blockchain projects</p>
                <button class="download-btn" onclick="download('mezzpro-dev-suite-windows.exe')">
                    💻 Windows Suite
                </button>
                <button class="download-btn" onclick="download('mezzpro-dev-suite-macos.dmg')">
                    🍎 Mac Suite
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('mezzpro-dev-suite-linux.deb')">
                    🐧 Linux Suite
                </button>
            </div>
            
            <div class="download-card">
                <h3>📊 Network Analytics</h3>
                <p>Blockchain network monitoring and analytics tools</p>
                <button class="download-btn" onclick="download('network-monitor.zip')">
                    📈 Network Monitor
                </button>
                <button class="download-btn" onclick="download('blockchain-analytics.zip')">
                    📋 Analytics Dashboard
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('node-diagnostics.zip')">
                    🔍 Node Diagnostics
                </button>
            </div>
            
            <div class="download-card">
                <h3>🔐 Smart Contracts</h3>
                <p>Smart contract development and deployment utilities</p>
                <button class="download-btn" onclick="download('contract-compiler.zip')">
                    ⚙️ Contract Compiler
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('contract-debugger.zip')">
                    🐛 Contract Debugger
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('contract-templates.zip')">
                    📜 Contract Templates
                </button>
            </div>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            
            function download(filename) {
                vscode.postMessage({ 
                    command: 'download', 
                    file: filename 
                });
            }
        </script>
    </body>
    </html>`;
}

export function deactivate() {
    console.log('⛓️ MezzPro Extension deactivated');
}