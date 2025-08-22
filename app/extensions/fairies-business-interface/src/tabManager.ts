import * as vscode from 'vscode';

export class TabManager {
    private activeTabs = new Map<string, vscode.WebviewPanel>();
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    createOrFocusTab(tabId: string, creator: () => vscode.WebviewPanel): void {
        if (this.activeTabs.has(tabId)) {
            // Focus existing tab
            const existingTab = this.activeTabs.get(tabId)!;
            existingTab.reveal();
        } else {
            // Create new tab
            const panel = creator();
            this.activeTabs.set(tabId, panel);
            
            // Clean up on disposal
            panel.onDidDispose(() => {
                this.activeTabs.delete(tabId);
            });
        }
    }

    createDashboardTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'fairies-dashboard',
            '🧚‍♀️ Business Dashboard',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        panel.webview.html = this.getDashboardHTML();
        
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'dashboard'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createAnalyticsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'fairies-analytics',
            '📈 Analytics Center',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getAnalyticsHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'analytics'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createDownloadCenterTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'fairies-downloads',
            '📥 Download Center',
            vscode.ViewColumn.Three,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getDownloadCenterHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'downloads'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createToolsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'fairies-tools',
            '🔧 Business Tools',
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getToolsHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'tools'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createBusinessWorkspace(): void {
        // Open all tabs in a multi-column layout
        this.createOrFocusTab('dashboard', () => this.createDashboardTab());
        setTimeout(() => {
            this.createOrFocusTab('analytics', () => this.createAnalyticsTab());
        }, 500);
        setTimeout(() => {
            this.createOrFocusTab('downloads', () => this.createDownloadCenterTab());
        }, 1000);
        
        vscode.window.showInformationMessage('🧚‍♀️ Business workspace layout created!');
    }

    private handleMessage(message: any, tabType: string): void {
        switch (message.command) {
            case 'alert':
                vscode.window.showInformationMessage(message.text);
                break;
            case 'download':
                vscode.window.showInformationMessage(`Download requested: ${message.file}`);
                break;
        }
    }

    private getDashboardHTML(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fairies Business Dashboard</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    overflow-x: hidden;
                }
                
                .header {
                    text-align: center;
                    padding: 2rem 1rem;
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 2.5rem;
                    font-weight: 300;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                
                .subtitle {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-top: 0.5rem;
                }
                
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .card {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.2);
                }
                
                .card h3 {
                    margin-top: 0;
                    font-size: 1.3rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .metric {
                    font-size: 2rem;
                    font-weight: bold;
                    margin: 0.5rem 0;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                
                .download-button {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 1rem auto;
                    width: fit-content;
                }
                
                .download-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(238, 90, 36, 0.6);
                }
                
                .fairy-sparkle {
                    animation: sparkle 2s infinite;
                    display: inline-block;
                }
                
                @keyframes sparkle {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
                }
                
                .quick-actions {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                }
                
                .action-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                
                .action-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1><span class="fairy-sparkle">🧚‍♀️</span> Business Dashboard <span class="fairy-sparkle">✨</span></h1>
                <div class="subtitle">Welcome to your magical business interface</div>
            </div>
            
            <div class="dashboard-grid">
                <div class="card">
                    <h3>📊 Analytics Overview</h3>
                    <div class="metric">92.4%</div>
                    <p>System Performance</p>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="openAnalytics()">View Details</button>
                        <button class="action-btn" onclick="exportData()">Export</button>
                    </div>
                </div>
                
                <div class="card">
                    <h3>👥 Active Users</h3>
                    <div class="metric">1,247</div>
                    <p>Currently online</p>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="viewUsers()">Manage</button>
                    </div>
                </div>
                
                <div class="card">
                    <h3>💾 Download Center</h3>
                    <p>Access your business files and applications</p>
                    <button class="download-button" onclick="downloadDesktop()">
                        <span>📱</span> Download Desktop App
                    </button>
                </div>
                
                <div class="card">
                    <h3>🔧 Quick Tools</h3>
                    <p>Essential business utilities</p>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="openCalculator()">Calculator</button>
                        <button class="action-btn" onclick="openCalendar()">Calendar</button>
                        <button class="action-btn" onclick="openNotes()">Notes</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function openAnalytics() {
                    vscode.postMessage({ command: 'alert', text: 'Opening Analytics Center...' });
                }
                
                function downloadDesktop() {
                    vscode.postMessage({ command: 'download', file: 'desktop-app.exe' });
                }
                
                function exportData() {
                    vscode.postMessage({ command: 'alert', text: 'Exporting analytics data...' });
                }
                
                function viewUsers() {
                    vscode.postMessage({ command: 'alert', text: 'Opening user management...' });
                }
                
                function openCalculator() {
                    vscode.postMessage({ command: 'alert', text: 'Opening calculator...' });
                }
                
                function openCalendar() {
                    vscode.postMessage({ command: 'alert', text: 'Opening calendar...' });
                }
                
                function openNotes() {
                    vscode.postMessage({ command: 'alert', text: 'Opening notes...' });
                }
            </script>
        </body>
        </html>`;
    }

    private getAnalyticsHTML(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Analytics Center</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
                    color: white;
                }
                .header { text-align: center; margin-bottom: 2rem; }
                .chart-container {
                    background: rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    backdrop-filter: blur(10px);
                }
                .metric-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .metric-card {
                    background: rgba(255,255,255,0.1);
                    padding: 1rem;
                    border-radius: 12px;
                    text-align: center;
                }
                .metric-value { font-size: 1.5rem; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📈 Analytics Center</h1>
                <p>Real-time business insights</p>
            </div>
            <div class="chart-container">
                <h3>Performance Metrics</h3>
                <div class="metric-grid">
                    <div class="metric-card">
                        <div class="metric-value">98.5%</div>
                        <div>Uptime</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">2.3s</div>
                        <div>Response Time</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">15.2K</div>
                        <div>Daily Requests</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">847</div>
                        <div>Active Sessions</div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }

    private getDownloadCenterHTML(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Center</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
                    color: white;
                }
                .header { text-align: center; margin-bottom: 2rem; }
                .download-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }
                .download-card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    backdrop-filter: blur(10px);
                }
                .download-btn {
                    background: rgba(255,255,255,0.9);
                    color: #e84393;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    margin: 1rem 0;
                    transition: transform 0.3s ease;
                }
                .download-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📥 Download Center</h1>
                <p>Get your business applications</p>
            </div>
            <div class="download-grid">
                <div class="download-card">
                    <h3>📱 Desktop Application</h3>
                    <p>Full-featured desktop client with offline capabilities</p>
                    <button class="download-btn" onclick="download('desktop')">Download for Windows</button>
                    <button class="download-btn" onclick="download('desktop-mac')">Download for Mac</button>
                </div>
                <div class="download-card">
                    <h3>📊 Analytics Tools</h3>
                    <p>Advanced analytics and reporting suite</p>
                    <button class="download-btn" onclick="download('analytics')">Download Tools</button>
                </div>
                <div class="download-card">
                    <h3>🔧 Admin Utilities</h3>
                    <p>Administrative tools and system utilities</p>
                    <button class="download-btn" onclick="download('admin')">Download Package</button>
                </div>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                function download(type) {
                    vscode.postMessage({ command: 'download', file: type });
                }
            </script>
        </body>
        </html>`;
    }

    private getToolsHTML(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Business Tools</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
                    color: white;
                }
                .header { text-align: center; margin-bottom: 2rem; }
                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }
                .tool-card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 1.5rem;
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                .tool-card:hover {
                    transform: translateY(-5px);
                }
                .tool-icon { font-size: 2rem; margin-bottom: 1rem; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🔧 Business Tools</h1>
                <p>Essential utilities for productivity</p>
            </div>
            <div class="tools-grid">
                <div class="tool-card" onclick="openTool('calculator')">
                    <div class="tool-icon">🧮</div>
                    <h3>Calculator</h3>
                    <p>Advanced business calculator</p>
                </div>
                <div class="tool-card" onclick="openTool('calendar')">
                    <div class="tool-icon">📅</div>
                    <h3>Calendar</h3>
                    <p>Schedule and appointments</p>
                </div>
                <div class="tool-card" onclick="openTool('notes')">
                    <div class="tool-icon">📝</div>
                    <h3>Notes</h3>
                    <p>Quick note taking</p>
                </div>
                <div class="tool-card" onclick="openTool('converter')">
                    <div class="tool-icon">🔄</div>
                    <h3>Unit Converter</h3>
                    <p>Convert units and currencies</p>
                </div>
                <div class="tool-card" onclick="openTool('timer')">
                    <div class="tool-icon">⏰</div>
                    <h3>Timer</h3>
                    <p>Productivity timer</p>
                </div>
                <div class="tool-card" onclick="openTool('weather')">
                    <div class="tool-icon">🌤️</div>
                    <h3>Weather</h3>
                    <p>Current weather info</p>
                </div>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                function openTool(tool) {
                    vscode.postMessage({ command: 'alert', text: \`Opening \${tool} tool...\` });
                }
            </script>
        </body>
        </html>`;
    }
}