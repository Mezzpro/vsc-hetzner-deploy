import * as vscode from 'vscode';
import * as path from 'path';

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
            'cradle-dashboard',
            'Business Dashboard',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        panel.webview.html = this.getDashboardHTML(panel.webview);
        
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => this.handleDashboardMessage(message, panel),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createAnalyticsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-analytics',
            'Analytics Center',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        panel.webview.html = this.getAnalyticsHTML(panel.webview);
        
        panel.webview.onDidReceiveMessage(
            message => this.handleAnalyticsMessage(message, panel),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createDownloadCenterTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-downloads',
            'Download Center',
            vscode.ViewColumn.Three,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        panel.webview.html = this.getDownloadCenterHTML(panel.webview);
        
        panel.webview.onDidReceiveMessage(
            message => this.handleDownloadMessage(message, panel),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createToolsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-tools',
            'Business Tools',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        panel.webview.html = this.getToolsHTML(panel.webview);
        
        panel.webview.onDidReceiveMessage(
            message => this.handleToolsMessage(message, panel),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createBusinessWorkspace(): void {
        // Create multiple tabs in a business-friendly layout
        this.createOrFocusTab('dashboard', () => this.createDashboardTab());
        
        setTimeout(() => {
            this.createOrFocusTab('analytics', () => this.createAnalyticsTab());
        }, 500);
        
        setTimeout(() => {
            this.createOrFocusTab('downloads', () => this.createDownloadCenterTab());
        }, 1000);
    }

    private getDashboardHTML(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Business Dashboard</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    color: white;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 50px;
                }
                
                .header h1 {
                    font-size: 3rem;
                    font-weight: 300;
                    margin: 0 0 20px 0;
                    background: linear-gradient(45deg, #ffffff, #f8f9fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .header p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    margin: 0;
                }
                
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                    margin-bottom: 50px;
                }
                
                .card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
                
                .card-icon {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    display: block;
                }
                
                .card h3 {
                    font-size: 1.5rem;
                    margin: 0 0 15px 0;
                    font-weight: 600;
                }
                
                .card p {
                    opacity: 0.8;
                    line-height: 1.6;
                }
                
                .download-section {
                    text-align: center;
                    margin-top: 50px;
                }
                
                .fairies-download-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
                }
                
                .fairies-download-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(79, 172, 254, 0.4);
                }
                
                .download-icon {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                }
                
                .metrics-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 40px;
                }
                
                .metric {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                }
                
                .metric-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                
                .metric-label {
                    opacity: 0.8;
                    font-size: 0.9rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Cradle Systems</h1>
                    <p>Business Dashboard & Control Center</p>
                </div>
                
                <div class="cards-grid">
                    <div class="card">
                        <span class="card-icon">📊</span>
                        <h3>Analytics</h3>
                        <p>Real-time business metrics and performance tracking for all your ventures.</p>
                    </div>
                    <div class="card">
                        <span class="card-icon">🚀</span>
                        <h3>Projects</h3>
                        <p>Manage and monitor all active business projects and initiatives.</p>
                    </div>
                    <div class="card">
                        <span class="card-icon">💼</span>
                        <h3>Resources</h3>
                        <p>Access business documents, templates, and essential resources.</p>
                    </div>
                </div>
                
                <div class="metrics-row">
                    <div class="metric">
                        <div class="metric-value">5</div>
                        <div class="metric-label">Active Ventures</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">98%</div>
                        <div class="metric-label">Uptime</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">2.1K</div>
                        <div class="metric-label">Monthly Users</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">24/7</div>
                        <div class="metric-label">Support</div>
                    </div>
                </div>
                
                <div class="download-section">
                    <h2 style="margin-bottom: 30px; font-weight: 300;">Get Started Today</h2>
                    <button class="fairies-download-btn" onclick="handleDownload()">
                        <svg class="download-icon" viewBox="0 0 24 24">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                        <span>Download Desktop</span>
                    </button>
                </div>
            </div>
            
            <script>
                function handleDownload() {
                    const vscode = acquireVsCodeApi();
                    vscode.postMessage({
                        command: 'download',
                        type: 'desktop-app'
                    });
                }
            </script>
        </body>
        </html>`;
    }

    private getAnalyticsHTML(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Analytics Center</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f8f9fa;
                    color: #333;
                }
                
                .analytics-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .analytics-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .analytics-header h1 {
                    font-size: 2.5rem;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 10px;
                }
                
                .chart-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 30px;
                    margin-bottom: 40px;
                }
                
                .chart-card {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .chart-card h3 {
                    margin: 0 0 20px 0;
                    font-size: 1.3rem;
                    color: #4a5568;
                }
                
                .chart-placeholder {
                    height: 200px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                }
                
                .data-table {
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .table-header {
                    background: #4a5568;
                    color: white;
                    padding: 20px;
                }
                
                .table-content {
                    padding: 20px;
                }
                
                .data-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    padding: 15px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .data-row:last-child {
                    border-bottom: none;
                }
            </style>
        </head>
        <body>
            <div class="analytics-container">
                <div class="analytics-header">
                    <h1>📈 Analytics Center</h1>
                    <p>Business Intelligence & Performance Metrics</p>
                </div>
                
                <div class="chart-grid">
                    <div class="chart-card">
                        <h3>Revenue Growth</h3>
                        <div class="chart-placeholder">📊 Revenue Chart</div>
                    </div>
                    <div class="chart-card">
                        <h3>User Engagement</h3>
                        <div class="chart-placeholder">👥 User Analytics</div>
                    </div>
                    <div class="chart-card">
                        <h3>System Performance</h3>
                        <div class="chart-placeholder">⚡ Performance Metrics</div>
                    </div>
                    <div class="chart-card">
                        <h3>Market Trends</h3>
                        <div class="chart-placeholder">📈 Market Analysis</div>
                    </div>
                </div>
                
                <div class="data-table">
                    <div class="table-header">
                        <h3 style="margin: 0;">Business Metrics Overview</h3>
                    </div>
                    <div class="table-content">
                        <div class="data-row" style="font-weight: 600; border-bottom: 2px solid #4a5568;">
                            <div>Venture</div>
                            <div>Revenue</div>
                            <div>Growth</div>
                            <div>Status</div>
                        </div>
                        <div class="data-row">
                            <div>Cradle Systems</div>
                            <div>$125K</div>
                            <div>+15%</div>
                            <div>🟢 Active</div>
                        </div>
                        <div class="data-row">
                            <div>MezzPro</div>
                            <div>$89K</div>
                            <div>+22%</div>
                            <div>🟢 Growing</div>
                        </div>
                        <div class="data-row">
                            <div>MinQro</div>
                            <div>$67K</div>
                            <div>+8%</div>
                            <div>🟡 Stable</div>
                        </div>
                        <div class="data-row">
                            <div>SobuAI</div>
                            <div>$45K</div>
                            <div>+35%</div>
                            <div>🚀 Expanding</div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }

    private getDownloadCenterHTML(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Center</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    min-height: 100vh;
                    color: white;
                }
                
                .download-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                
                .download-header {
                    text-align: center;
                    margin-bottom: 50px;
                }
                
                .download-header h1 {
                    font-size: 3rem;
                    font-weight: 300;
                    margin-bottom: 20px;
                    background: linear-gradient(45deg, #ffffff, #f8f9fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .download-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 30px;
                    margin-bottom: 50px;
                }
                
                .download-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    text-align: center;
                    transition: transform 0.3s ease;
                }
                
                .download-card:hover {
                    transform: translateY(-5px);
                }
                
                .download-card-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                    display: block;
                }
                
                .download-card h3 {
                    font-size: 1.8rem;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                
                .download-card p {
                    opacity: 0.8;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                
                .fairies-download-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
                    margin: 5px;
                }
                
                .fairies-download-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(79, 172, 254, 0.4);
                }
                
                .fairies-download-btn.secondary {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
                }
                
                .download-icon {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                }
                
                .featured-download {
                    background: rgba(255, 255, 255, 0.15);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    position: relative;
                }
                
                .featured-badge {
                    position: absolute;
                    top: -10px;
                    right: 20px;
                    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
            </style>
        </head>
        <body>
            <div class="download-container">
                <div class="download-header">
                    <h1>📥 Download Center</h1>
                    <p>Access all your business resources and applications</p>
                </div>
                
                <div class="download-grid">
                    <div class="download-card featured-download">
                        <div class="featured-badge">Most Popular</div>
                        <span class="download-card-icon">💻</span>
                        <h3>Desktop Application</h3>
                        <p>The complete Cradle Systems desktop experience with offline capabilities and enhanced performance.</p>
                        <button class="fairies-download-btn" onclick="handleDownload('desktop', 'windows')">
                            <svg class="download-icon" viewBox="0 0 24 24">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            Download for Windows
                        </button>
                        <button class="fairies-download-btn secondary" onclick="handleDownload('desktop', 'mac')">
                            <svg class="download-icon" viewBox="0 0 24 24">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            Download for Mac
                        </button>
                    </div>
                    
                    <div class="download-card">
                        <span class="download-card-icon">📊</span>
                        <h3>Business Reports</h3>
                        <p>Comprehensive analytics reports and business intelligence documents for all your ventures.</p>
                        <button class="fairies-download-btn" onclick="handleDownload('reports', 'pdf')">
                            <svg class="download-icon" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                            Download Reports
                        </button>
                    </div>
                    
                    <div class="download-card">
                        <span class="download-card-icon">📋</span>
                        <h3>Templates & Resources</h3>
                        <p>Business document templates, brand assets, and essential resources for your projects.</p>
                        <button class="fairies-download-btn" onclick="handleDownload('templates', 'zip')">
                            <svg class="download-icon" viewBox="0 0 24 24">
                                <path d="M16,0H8C6.9,0 6,0.9 6,2V22L12,19L18,22V2C18,0.9 17.1,0 16,0Z"/>
                            </svg>
                            Download Templates
                        </button>
                    </div>
                    
                    <div class="download-card">
                        <span class="download-card-icon">⚙️</span>
                        <h3>Configuration Files</h3>
                        <p>System configuration files, environment settings, and deployment configurations.</p>
                        <button class="fairies-download-btn" onclick="handleDownload('config', 'json')">
                            <svg class="download-icon" viewBox="0 0 24 24">
                                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                            </svg>
                            Download Config
                        </button>
                    </div>
                </div>
            </div>
            
            <script>
                function handleDownload(type, format) {
                    const vscode = acquireVsCodeApi();
                    
                    // Show download progress
                    const button = event.target.closest('.fairies-download-btn');
                    const originalText = button.innerHTML;
                    button.innerHTML = '<span>Downloading...</span>';
                    button.disabled = true;
                    
                    // Send message to extension
                    vscode.postMessage({
                        command: 'download',
                        type: type,
                        format: format
                    });
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 2000);
                }
            </script>
        </body>
        </html>`;
    }

    private getToolsHTML(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Business Tools</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f7fafc;
                    color: #2d3748;
                }
                
                .tools-container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .tools-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
                
                .tool-card {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    transition: transform 0.2s ease;
                }
                
                .tool-card:hover {
                    transform: translateY(-5px);
                }
                
                .tool-icon {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    display: block;
                }
                
                .tool-button {
                    background: #4299e1;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-top: 15px;
                    transition: background 0.2s ease;
                }
                
                .tool-button:hover {
                    background: #3182ce;
                }
            </style>
        </head>
        <body>
            <div class="tools-container">
                <div class="tools-header">
                    <h1>🔧 Business Tools</h1>
                    <p>Essential utilities for business operations</p>
                </div>
                
                <div class="tools-grid">
                    <div class="tool-card">
                        <span class="tool-icon">📝</span>
                        <h3>Document Generator</h3>
                        <p>Generate business documents and contracts</p>
                        <button class="tool-button" onclick="openTool('document-generator')">Launch Tool</button>
                    </div>
                    
                    <div class="tool-card">
                        <span class="tool-icon">💰</span>
                        <h3>Financial Calculator</h3>
                        <p>Business financial calculations and projections</p>
                        <button class="tool-button" onclick="openTool('financial-calc')">Launch Tool</button>
                    </div>
                    
                    <div class="tool-card">
                        <span class="tool-icon">📊</span>
                        <h3>Data Converter</h3>
                        <p>Convert and transform business data</p>
                        <button class="tool-button" onclick="openTool('data-converter')">Launch Tool</button>
                    </div>
                    
                    <div class="tool-card">
                        <span class="tool-icon">🎨</span>
                        <h3>Brand Assets</h3>
                        <p>Generate logos and brand materials</p>
                        <button class="tool-button" onclick="openTool('brand-assets')">Launch Tool</button>
                    </div>
                </div>
            </div>
            
            <script>
                function openTool(toolName) {
                    const vscode = acquireVsCodeApi();
                    vscode.postMessage({
                        command: 'openTool',
                        tool: toolName
                    });
                }
            </script>
        </body>
        </html>`;
    }

    private handleDashboardMessage(message: any, panel: vscode.WebviewPanel): void {
        switch (message.command) {
            case 'download':
                vscode.window.showInformationMessage(`Downloading ${message.type}...`);
                // Here you could implement actual download logic
                break;
        }
    }

    private handleAnalyticsMessage(message: any, panel: vscode.WebviewPanel): void {
        // Handle analytics-specific messages
    }

    private handleDownloadMessage(message: any, panel: vscode.WebviewPanel): void {
        switch (message.command) {
            case 'download':
                const fileName = `${message.type}-${message.format}-${Date.now()}`;
                vscode.window.showInformationMessage(`Downloading ${fileName}...`);
                
                // Create a sample file for demonstration
                this.createSampleDownload(message.type, message.format);
                break;
        }
    }

    private handleToolsMessage(message: any, panel: vscode.WebviewPanel): void {
        switch (message.command) {
            case 'openTool':
                vscode.window.showInformationMessage(`Opening ${message.tool}...`);
                break;
        }
    }

    private async createSampleDownload(type: string, format: string): Promise<void> {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) return;

            const fileName = `${type}-sample.${format}`;
            const uri = vscode.Uri.joinPath(workspaceFolder.uri, fileName);
            
            let content = '';
            switch (type) {
                case 'desktop':
                    content = 'Desktop Application Installer\n\nCradle Systems Business Suite v1.0\n\nInstallation Instructions:\n1. Run installer as administrator\n2. Follow setup wizard\n3. Launch application from desktop shortcut';
                    break;
                case 'reports':
                    content = 'Business Analytics Report\n\nGenerated: ' + new Date().toISOString() + '\n\nKey Metrics:\n- Revenue: $125,000\n- Growth: +15%\n- Users: 2,100\n- Uptime: 98.5%';
                    break;
                case 'templates':
                    content = 'Business Templates Package\n\nIncluded Templates:\n- Business Plan Template\n- Financial Projection Template\n- Marketing Plan Template\n- Project Charter Template';
                    break;
                case 'config':
                    content = JSON.stringify({
                        "businessConfig": {
                            "theme": "cradle-systems",
                            "features": ["analytics", "downloads", "tools"],
                            "version": "1.0.0"
                        }
                    }, null, 2);
                    break;
            }

            await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
            vscode.window.showInformationMessage(`Downloaded: ${fileName}`);
            
            // Open the file to show it was created
            const document = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(document);
            
        } catch (error) {
            vscode.window.showErrorMessage(`Download failed: ${error}`);
        }
    }

    closeTab(tabId: string): void {
        this.activeTabs.get(tabId)?.dispose();
    }

    refreshAllTabs(): void {
        this.activeTabs.forEach(panel => {
            panel.webview.postMessage({ command: 'refresh' });
        });
    }
}