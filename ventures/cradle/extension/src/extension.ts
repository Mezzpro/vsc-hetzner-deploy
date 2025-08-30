import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    console.log('🚀 CRADLE EXTENSION ACTIVATION STARTED!');

    // Check if we're in Cradle workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const isCradleWorkspace = workspaceFolders?.some(folder => 
        folder.uri.path.includes('cradle') || folder.name === 'cradle'
    );

    if (!isCradleWorkspace) {
        console.log('ℹ️ Not in Cradle workspace, extension will remain dormant');
        return;
    }

    console.log('✅ Cradle workspace detected, initializing download center...');

    // Register simple download command
    const downloadCommand = vscode.commands.registerCommand('cradle.downloads', () => {
        console.log('📥 Cradle Downloads command executed!');
        createDownloadTab(context);
    });

    context.subscriptions.push(downloadCommand);

    // Auto-open download center
    setTimeout(() => {
        console.log('🚀 Auto-opening Cradle download center...');
        vscode.commands.executeCommand('cradle.downloads');
    }, 1000);

    console.log('✅ CRADLE EXTENSION ACTIVATION COMPLETED!');
}

function createDownloadTab(context: vscode.ExtensionContext): void {
    const panel = vscode.window.createWebviewPanel(
        'cradle-downloads',
        '📥 CradleSystem Downloads',
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
        <title>CradleSystem Downloads</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                margin: 0;
                padding: 24px;
                background: #ffffff;
                color: #000000;
                line-height: 1.5;
            }
            .header {
                text-align: center;
                padding: 32px 24px;
                border-bottom: 1px solid #e1e5e9;
                margin-bottom: 32px;
            }
            .header h1 {
                margin: 0 0 16px 0;
                color: #1a1a1a;
                font-size: 2.5rem;
                font-weight: 600;
            }
            .header p {
                margin: 0;
                color: #6c757d;
                font-size: 1.1rem;
            }
            .downloads-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .download-card {
                background: #ffffff;
                border: 1px solid #e1e5e9;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                transition: all 0.2s ease;
            }
            .download-card:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                transform: translateY(-2px);
            }
            .download-card h3 {
                margin: 0 0 16px 0;
                color: #1a1a1a;
                font-size: 1.25rem;
                font-weight: 600;
            }
            .download-card p {
                margin: 0 0 20px 0;
                color: #6c757d;
            }
            .download-btn {
                background: #007acc;
                color: #ffffff;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
                margin-right: 12px;
                margin-bottom: 8px;
            }
            .download-btn:hover {
                background: #005a9e;
                transform: translateY(-1px);
            }
            .download-btn-secondary {
                background: #f8f9fa;
                color: #495057;
                border: 1px solid #e1e5e9;
            }
            .download-btn-secondary:hover {
                background: #e9ecef;
                border-color: #adb5bd;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏢 CradleSystem Downloads</h1>
            <p>Business applications and resources for your organization</p>
        </div>
        
        <div class="downloads-grid">
            <div class="download-card">
                <h3>📱 Desktop Applications</h3>
                <p>Full-featured desktop clients with offline capabilities</p>
                <button class="download-btn" onclick="download('cradle-desktop-windows.exe')">
                    🖥️ Windows App
                </button>
                <button class="download-btn" onclick="download('cradle-desktop-macos.dmg')">
                    🍎 Mac App
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('cradle-desktop-linux.deb')">
                    🐧 Linux App
                </button>
            </div>
            
            <div class="download-card">
                <h3>📊 Business Reports</h3>
                <p>Analytics and business intelligence reports</p>
                <button class="download-btn" onclick="download('monthly-report.pdf')">
                    📈 Monthly Report
                </button>
                <button class="download-btn" onclick="download('quarterly-data.xlsx')">
                    📋 Quarterly Data
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('analytics-dashboard.zip')">
                    📊 Analytics Suite
                </button>
            </div>
            
            <div class="download-card">
                <h3>🔧 Admin Tools</h3>
                <p>Administrative utilities and system management</p>
                <button class="download-btn" onclick="download('admin-toolkit.zip')">
                    ⚙️ Admin Toolkit
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('system-diagnostics.exe')">
                    🔍 Diagnostics
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('backup-utility.zip')">
                    💾 Backup Tool
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
    console.log('🏢 Cradle Extension deactivated');
}