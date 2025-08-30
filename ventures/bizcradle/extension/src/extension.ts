import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    console.log('🚀 BIZCRADLE EXTENSION ACTIVATION STARTED!');

    // Check if we're in Bizcradle workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const isBizcradleWorkspace = workspaceFolders?.some(folder => 
        folder.uri.path.includes('bizcradle') || folder.name === 'bizcradle'
    );

    if (!isBizcradleWorkspace) {
        console.log('ℹ️ Not in Bizcradle workspace, extension will remain dormant');
        return;
    }

    console.log('✅ Bizcradle workspace detected, initializing download center...');

    // Register simple download command
    const downloadCommand = vscode.commands.registerCommand('bizcradle.downloads', () => {
        console.log('📥 Bizcradle Downloads command executed!');
        createDownloadTab(context);
    });

    context.subscriptions.push(downloadCommand);

    // Auto-open download center
    setTimeout(() => {
        console.log('🚀 Auto-opening Bizcradle download center...');
        vscode.commands.executeCommand('bizcradle.downloads');
    }, 1000);

    console.log('✅ BIZCRADLE EXTENSION ACTIVATION COMPLETED!');
}

function createDownloadTab(context: vscode.ExtensionContext): void {
    const panel = vscode.window.createWebviewPanel(
        'bizcradle-downloads',
        '🚀 Bizcradle Downloads',
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
        <title>Bizcradle Downloads</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                margin: 0;
                padding: 24px;
                background: #1e1e1e;
                color: #ffffff;
                line-height: 1.5;
            }
            .header {
                text-align: center;
                padding: 32px 24px;
                border-bottom: 1px solid #333333;
                margin-bottom: 32px;
            }
            .header h1 {
                margin: 0 0 16px 0;
                color: #ffffff;
                font-size: 2.5rem;
                font-weight: 600;
            }
            .header p {
                margin: 0;
                color: #cccccc;
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
                background: #2d2d30;
                border: 1px solid #3e3e42;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
            }
            .download-card:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                transform: translateY(-2px);
                border-color: #007acc;
            }
            .download-card h3 {
                margin: 0 0 16px 0;
                color: #ffffff;
                font-size: 1.25rem;
                font-weight: 600;
            }
            .download-card p {
                margin: 0 0 20px 0;
                color: #cccccc;
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
                background: #3c3c3c;
                color: #ffffff;
                border: 1px solid #565656;
            }
            .download-btn-secondary:hover {
                background: #4a4a4a;
                border-color: #007acc;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Bizcradle Downloads</h1>
            <p>Marketing and business growth applications</p>
        </div>
        
        <div class="downloads-grid">
            <div class="download-card">
                <h3>📱 Marketing Apps</h3>
                <p>Comprehensive marketing automation and campaign management tools</p>
                <button class="download-btn" onclick="download('bizcradle-marketing-windows.exe')">
                    💻 Windows App
                </button>
                <button class="download-btn" onclick="download('bizcradle-marketing-macos.dmg')">
                    🍎 Mac App
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('bizcradle-marketing-linux.deb')">
                    🐧 Linux App
                </button>
            </div>
            
            <div class="download-card">
                <h3>📊 Analytics Suite</h3>
                <p>Marketing analytics and performance tracking tools</p>
                <button class="download-btn" onclick="download('marketing-analytics.zip')">
                    📈 Analytics Dashboard
                </button>
                <button class="download-btn" onclick="download('campaign-reports.zip')">
                    📋 Campaign Reports
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('roi-calculator.zip')">
                    💰 ROI Calculator
                </button>
            </div>
            
            <div class="download-card">
                <h3>🎯 Campaign Tools</h3>
                <p>Email marketing and social media campaign utilities</p>
                <button class="download-btn" onclick="download('email-campaign-builder.zip')">
                    ✉️ Email Builder
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('social-media-scheduler.zip')">
                    📱 Social Scheduler
                </button>
                <button class="download-btn-secondary download-btn" onclick="download('content-templates.zip')">
                    📝 Content Templates
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
    console.log('🚀 Bizcradle Extension deactivated');
}