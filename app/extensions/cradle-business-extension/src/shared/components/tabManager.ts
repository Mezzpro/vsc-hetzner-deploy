import * as vscode from 'vscode';
import { TabManager as ITabManager } from '../types/interfaces';
import { ThemeManager } from '../../core/themeManager';

export class TabManager implements ITabManager {
    private activeTabs = new Map<string, vscode.WebviewPanel>();
    private context: vscode.ExtensionContext;
    private themeManager: ThemeManager;

    constructor(context: vscode.ExtensionContext, themeManager: ThemeManager) {
        this.context = context;
        this.themeManager = themeManager;
    }

    createOrFocusTab(tabId: string, creator: () => vscode.WebviewPanel): void {
        if (this.activeTabs.has(tabId)) {
            // Focus existing tab
            const existingTab = this.activeTabs.get(tabId)!;
            existingTab.reveal();
            console.log(`📋 Focused existing tab: ${tabId}`);
        } else {
            // Create new tab
            const panel = creator();
            this.activeTabs.set(tabId, panel);
            
            // Clean up on disposal
            panel.onDidDispose(() => {
                this.activeTabs.delete(tabId);
                console.log(`🗑️ Tab disposed: ${tabId}`);
            });
            
            console.log(`✨ Created new tab: ${tabId}`);
        }
    }

    createDashboardTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-dashboard',
            '🏢 Business Dashboard',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        panel.webview.html = this.getDashboardHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'dashboard'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createAnalyticsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-analytics',
            '📊 Analytics Center',
            vscode.ViewColumn.Active,
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

    createDownloadsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-downloads',
            '📥 Download Center',
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getDownloadsHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'downloads'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createToolsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-tools',
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

    createChatbotTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'cradle-chatbot',
            '💬 Chat Assistant',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getChatbotHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleChatMessage(message),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    private handleMessage(message: any, tabType: string): void {
        console.log(`💬 Message from ${tabType}:`, message);
        
        switch (message.command) {
            case 'alert':
                vscode.window.showInformationMessage(message.text);
                break;
            case 'download':
                vscode.window.showInformationMessage(`📥 Download requested: ${message.file}`);
                // Here we can implement actual download logic
                break;
            case 'openTab':
                this.openTabFromMessage(message.tab);
                break;
        }
    }

    private handleChatMessage(message: any): void {
        if (message.command === 'sendMessage') {
            // Simulate chatbot response
            const responses = [
                "I can help you with Cradle Systems operations. What would you like to know?",
                "Let me check that information for you...",
                "Based on our current analytics, I can provide those insights.",
                "I'm here to assist with your business needs. How can I help?",
                "That's a great question about our business operations.",
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            // Send response back to webview
            const chatPanel = this.activeTabs.get('chatbot');
            if (chatPanel) {
                setTimeout(() => {
                    chatPanel.webview.postMessage({
                        command: 'addMessage',
                        message: {
                            text: randomResponse,
                            sender: 'assistant',
                            timestamp: new Date().toISOString()
                        }
                    });
                }, 1000); // Simulate thinking time
            }
        }
    }

    private openTabFromMessage(tabName: string): void {
        switch (tabName) {
            case 'analytics':
                this.createOrFocusTab('analytics', () => this.createAnalyticsTab());
                break;
            case 'downloads':
                this.createOrFocusTab('downloads', () => this.createDownloadsTab());
                break;
            case 'tools':
                this.createOrFocusTab('tools', () => this.createToolsTab());
                break;
            case 'chatbot':
                this.createOrFocusTab('chatbot', () => this.createChatbotTab());
                break;
        }
    }

    private getDashboardHTML(): string {
        const themeCSS = this.themeManager.getCleanThemeCSS();
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cradle Business Dashboard</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="header">
                <h1>Business Dashboard</h1>
                <p>Welcome to your Cradle Systems business interface</p>
            </div>
            
            <div class="content">
                <div class="grid">
                    <div class="card animate-fade-in">
                        <h3>📊 System Performance</h3>
                        <div class="metric">
                            <div class="metric-value">98.5%</div>
                            <div class="metric-label">Uptime</div>
                        </div>
                        <div style="display: flex; gap: 12px; margin-top: 16px;">
                            <button class="btn-secondary" onclick="openAnalytics()">View Details</button>
                            <button class="btn-secondary" onclick="exportData()">Export</button>
                        </div>
                    </div>
                    
                    <div class="card animate-fade-in">
                        <h3>👥 Active Users</h3>
                        <div class="metric">
                            <div class="metric-value">1,247</div>
                            <div class="metric-label">Currently online</div>
                        </div>
                        <button class="btn-secondary" onclick="viewUsers()" style="margin-top: 16px;">Manage Users</button>
                    </div>
                    
                    <div class="card animate-fade-in">
                        <h3>📥 Downloads</h3>
                        <p>Access your business applications and files</p>
                        <button class="download-btn" onclick="downloadDesktop()">
                            <span>📱</span> Download Desktop App
                        </button>
                        <button class="btn-secondary" onclick="openDownloads()">View All Downloads</button>
                    </div>
                    
                    <div class="card animate-fade-in">
                        <h3>🔧 Quick Tools</h3>
                        <p>Essential business utilities</p>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;">
                            <button class="btn-secondary" onclick="openCalculator()">Calculator</button>
                            <button class="btn-secondary" onclick="openCalendar()">Calendar</button>
                            <button class="btn-secondary" onclick="openNotes()">Notes</button>
                            <button class="btn-secondary" onclick="openTools()">All Tools</button>
                        </div>
                    </div>
                </div>
                
                <div class="grid" style="margin-top: 32px;">
                    <div class="card">
                        <h3>💬 Need Help?</h3>
                        <p>Chat with our AI assistant for instant support</p>
                        <button class="btn-primary" onclick="openChat()">
                            <span>💬</span> Open Chat Assistant
                        </button>
                    </div>
                    
                    <div class="card">
                        <h3>📊 Quick Analytics</h3>
                        <div class="grid-3" style="margin-top: 16px;">
                            <div class="metric">
                                <div class="metric-value">2.3s</div>
                                <div class="metric-label">Response Time</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">15.2K</div>
                                <div class="metric-label">Daily Requests</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">847</div>
                                <div class="metric-label">Active Sessions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function openAnalytics() {
                    vscode.postMessage({ command: 'openTab', tab: 'analytics' });
                }
                
                function openDownloads() {
                    vscode.postMessage({ command: 'openTab', tab: 'downloads' });
                }
                
                function openTools() {
                    vscode.postMessage({ command: 'openTab', tab: 'tools' });
                }
                
                function openChat() {
                    vscode.postMessage({ command: 'openTab', tab: 'chatbot' });
                }
                
                function downloadDesktop() {
                    vscode.postMessage({ command: 'download', file: 'cradle-desktop-app.exe' });
                }
                
                function exportData() {
                    vscode.postMessage({ command: 'download', file: 'analytics-export.csv' });
                }
                
                function viewUsers() {
                    vscode.postMessage({ command: 'alert', text: 'Opening user management interface...' });
                }
                
                function openCalculator() {
                    vscode.postMessage({ command: 'alert', text: 'Opening calculator tool...' });
                }
                
                function openCalendar() {
                    vscode.postMessage({ command: 'alert', text: 'Opening calendar tool...' });
                }
                
                function openNotes() {
                    vscode.postMessage({ command: 'alert', text: 'Opening notes tool...' });
                }
            </script>
        </body>
        </html>`;
    }

    private getAnalyticsHTML(): string {
        const themeCSS = this.themeManager.getCleanThemeCSS();
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Analytics Center</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="header">
                <h1>Analytics Center</h1>
                <p>Real-time business insights and performance metrics</p>
            </div>
            
            <div class="content">
                <div class="grid">
                    <div class="card">
                        <h3>📈 Performance Overview</h3>
                        <div class="grid-2">
                            <div class="metric">
                                <div class="metric-value">98.5%</div>
                                <div class="metric-label">System Uptime</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">2.3s</div>
                                <div class="metric-label">Avg Response Time</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">15.2K</div>
                                <div class="metric-label">Daily Requests</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">847</div>
                                <div class="metric-label">Active Sessions</div>
                            </div>
                        </div>
                        <button class="download-btn" onclick="exportAnalytics()">
                            <span>📊</span> Export Analytics Report
                        </button>
                    </div>
                    
                    <div class="card">
                        <h3>🎯 Business Metrics</h3>
                        <div class="metric" style="margin-bottom: 24px;">
                            <div class="metric-value">$247K</div>
                            <div class="metric-label">Monthly Revenue</div>
                        </div>
                        <div class="grid-2">
                            <div class="metric">
                                <div class="metric-value">1,247</div>
                                <div class="metric-label">Total Users</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">89%</div>
                                <div class="metric-label">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 24px;">
                    <h3>📋 Quick Actions</h3>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="generateReport()">Generate Report</button>
                        <button class="btn-secondary" onclick="viewDashboard()">Back to Dashboard</button>
                        <button class="btn-secondary" onclick="openTools()">Business Tools</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function exportAnalytics() {
                    vscode.postMessage({ command: 'download', file: 'analytics-detailed-report.pdf' });
                }
                
                function generateReport() {
                    vscode.postMessage({ command: 'alert', text: 'Generating comprehensive analytics report...' });
                }
                
                function viewDashboard() {
                    vscode.postMessage({ command: 'openTab', tab: 'dashboard' });
                }
                
                function openTools() {
                    vscode.postMessage({ command: 'openTab', tab: 'tools' });
                }
            </script>
        </body>
        </html>`;
    }

    private getDownloadsHTML(): string {
        const themeCSS = this.themeManager.getCleanThemeCSS();
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Center</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="header">
                <h1>Download Center</h1>
                <p>Access your business applications, reports, and resources</p>
            </div>
            
            <div class="content">
                <div class="grid">
                    <div class="card">
                        <h3>📱 Desktop Applications</h3>
                        <p>Full-featured desktop clients with offline capabilities</p>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button class="download-btn" onclick="download('cradle-desktop-windows.exe')">
                                <span>🖥️</span> Download for Windows
                            </button>
                            <button class="download-btn" onclick="download('cradle-desktop-macos.dmg')">
                                <span>🍎</span> Download for Mac
                            </button>
                            <button class="btn-secondary" onclick="download('cradle-desktop-linux.deb')">
                                Download for Linux
                            </button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>📊 Analytics & Reports</h3>
                        <p>Business intelligence and reporting tools</p>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button class="download-btn" onclick="download('analytics-suite.zip')">
                                <span>📈</span> Analytics Suite
                            </button>
                            <button class="btn-secondary" onclick="download('monthly-report.pdf')">
                                Monthly Report (PDF)
                            </button>
                            <button class="btn-secondary" onclick="download('quarterly-data.xlsx')">
                                Quarterly Data (Excel)
                            </button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>🔧 Admin Tools</h3>
                        <p>Administrative utilities and system management tools</p>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button class="download-btn" onclick="download('admin-toolkit.zip')">
                                <span>⚙️</span> Admin Toolkit
                            </button>
                            <button class="btn-secondary" onclick="download('system-diagnostics.exe')">
                                System Diagnostics
                            </button>
                            <button class="btn-secondary" onclick="download('backup-utility.zip')">
                                Backup Utility
                            </button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>📚 Documentation</h3>
                        <p>User guides, API documentation, and resources</p>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button class="btn-secondary" onclick="download('user-manual.pdf')">
                                User Manual (PDF)
                            </button>
                            <button class="btn-secondary" onclick="download('api-documentation.pdf')">
                                API Documentation
                            </button>
                            <button class="btn-secondary" onclick="download('quick-start-guide.pdf')">
                                Quick Start Guide
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 24px;">
                    <h3>🔗 Quick Links</h3>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="viewDashboard()">Back to Dashboard</button>
                        <button class="btn-secondary" onclick="openAnalytics()">View Analytics</button>
                        <button class="btn-secondary" onclick="openTools()">Business Tools</button>
                        <button class="btn-secondary" onclick="openChat()">Get Help</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function download(filename) {
                    vscode.postMessage({ command: 'download', file: filename });
                }
                
                function viewDashboard() {
                    vscode.postMessage({ command: 'openTab', tab: 'dashboard' });
                }
                
                function openAnalytics() {
                    vscode.postMessage({ command: 'openTab', tab: 'analytics' });
                }
                
                function openTools() {
                    vscode.postMessage({ command: 'openTab', tab: 'tools' });
                }
                
                function openChat() {
                    vscode.postMessage({ command: 'openTab', tab: 'chatbot' });
                }
            </script>
        </body>
        </html>`;
    }

    private getToolsHTML(): string {
        const themeCSS = this.themeManager.getCleanThemeCSS();
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Business Tools</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="header">
                <h1>Business Tools</h1>
                <p>Essential utilities for productivity and business operations</p>
            </div>
            
            <div class="content">
                <div class="grid-3">
                    <div class="card animate-fade-in" onclick="openTool('calculator')" style="cursor: pointer;">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🧮</div>
                            <h3>Calculator</h3>
                            <p>Advanced business calculator with financial functions</p>
                        </div>
                    </div>
                    
                    <div class="card animate-fade-in" onclick="openTool('calendar')" style="cursor: pointer;">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">📅</div>
                            <h3>Calendar</h3>
                            <p>Schedule meetings and manage appointments</p>
                        </div>
                    </div>
                    
                    <div class="card animate-fade-in" onclick="openTool('notes')" style="cursor: pointer;">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">📝</div>
                            <h3>Notes</h3>
                            <p>Quick note-taking and document management</p>
                        </div>
                    </div>
                    
                    <div class="card animate-fade-in" onclick="openTool('converter')" style="cursor: pointer;">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🔄</div>
                            <h3>Unit Converter</h3>
                            <p>Convert units, currencies, and measurements</p>
                        </div>
                    </div>
                    
                    <div class="card animate-fade-in" onclick="openTool('timer')" style="cursor: pointer;">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">⏰</div>
                            <h3>Productivity Timer</h3>
                            <p>Pomodoro timer and time tracking</p>
                        </div>
                    </div>
                    
                    <div class="card animate-fade-in" onclick="openTool('weather')" style="cursor: pointer;">
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🌤️</div>
                            <h3>Weather</h3>
                            <p>Current weather and forecast information</p>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 32px;">
                    <h3>🚀 Quick Actions</h3>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="viewDashboard()">Back to Dashboard</button>
                        <button class="btn-secondary" onclick="openAnalytics()">View Analytics</button>
                        <button class="btn-secondary" onclick="openDownloads()">Downloads</button>
                        <button class="btn-secondary" onclick="openChat()">Chat Assistant</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function openTool(toolName) {
                    vscode.postMessage({ 
                        command: 'alert', 
                        text: \`Opening \${toolName} tool... (This would open a dedicated \${toolName} interface)\`
                    });
                }
                
                function viewDashboard() {
                    vscode.postMessage({ command: 'openTab', tab: 'dashboard' });
                }
                
                function openAnalytics() {
                    vscode.postMessage({ command: 'openTab', tab: 'analytics' });
                }
                
                function openDownloads() {
                    vscode.postMessage({ command: 'openTab', tab: 'downloads' });
                }
                
                function openChat() {
                    vscode.postMessage({ command: 'openTab', tab: 'chatbot' });
                }
            </script>
        </body>
        </html>`;
    }

    private getChatbotHTML(): string {
        const themeCSS = this.themeManager.getCleanThemeCSS();
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chat Assistant</title>
            <style>
                ${themeCSS}
                .typing-indicator {
                    display: none;
                    padding: 12px;
                    font-style: italic;
                    color: var(--cradle-secondary);
                }
                
                .message-timestamp {
                    font-size: 12px;
                    color: var(--cradle-secondary);
                    margin-top: 4px;
                }
                
                .chat-input-container {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                
                .chat-input-field {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid var(--cradle-border);
                    border-radius: 6px;
                    font-size: 14px;
                    background: var(--cradle-background);
                    color: var(--cradle-text);
                }
                
                .chat-input-field:focus {
                    outline: none;
                    border-color: var(--cradle-primary);
                }
                
                .send-button {
                    background: var(--cradle-primary);
                    color: var(--cradle-background);
                    border: none;
                    padding: 12px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .send-button:hover {
                    background: var(--cradle-secondary);
                }
                
                .send-button:disabled {
                    background: var(--cradle-accent);
                    cursor: not-allowed;
                }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <div class="header" style="padding: 16px 24px;">
                    <h2 style="margin: 0;">💬 Chat Assistant</h2>
                    <p style="margin: 4px 0 0 0; font-size: 14px;">AI-powered business support for Cradle Systems</p>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="message assistant animate-fade-in">
                        <div>Hello! I'm your Cradle Systems AI assistant. How can I help you today?</div>
                        <div class="message-timestamp">Just now</div>
                    </div>
                </div>
                
                <div class="typing-indicator" id="typingIndicator">
                    Assistant is typing...
                </div>
                
                <div class="chat-input">
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            id="messageInput" 
                            class="chat-input-field"
                            placeholder="Ask me about Cradle Systems operations, analytics, or business questions..."
                            maxlength="500"
                        >
                        <button id="sendButton" class="send-button" onclick="sendMessage()">
                            Send
                        </button>
                    </div>
                    <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="sendQuickMessage('What are our current metrics?')">
                            📊 Current Metrics
                        </button>
                        <button class="btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="sendQuickMessage('How do I download the desktop app?')">
                            📱 Desktop App
                        </button>
                        <button class="btn-secondary" style="font-size: 12px; padding: 6px 12px;" onclick="sendQuickMessage('Generate a business report')">
                            📋 Generate Report
                        </button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                let messageCount = 0;
                
                // Handle messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'addMessage') {
                        addMessage(message.message.text, message.message.sender);
                    }
                });
                
                function addMessage(text, sender = 'user') {
                    const messagesContainer = document.getElementById('chatMessages');
                    const messageDiv = document.createElement('div');
                    messageDiv.className = \`message \${sender} animate-fade-in\`;
                    
                    const now = new Date();
                    const timestamp = now.toLocaleTimeString();
                    
                    messageDiv.innerHTML = \`
                        <div>\${text}</div>
                        <div class="message-timestamp">\${timestamp}</div>
                    \`;
                    
                    messagesContainer.appendChild(messageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                    if (sender === 'assistant') {
                        hideTypingIndicator();
                    }
                }
                
                function sendMessage() {
                    const input = document.getElementById('messageInput');
                    const message = input.value.trim();
                    
                    if (message) {
                        // Add user message
                        addMessage(message, 'user');
                        input.value = '';
                        
                        // Show typing indicator
                        showTypingIndicator();
                        
                        // Send to extension
                        vscode.postMessage({
                            command: 'sendMessage',
                            message: message
                        });
                    }
                }
                
                function sendQuickMessage(message) {
                    document.getElementById('messageInput').value = message;
                    sendMessage();
                }
                
                function showTypingIndicator() {
                    document.getElementById('typingIndicator').style.display = 'block';
                    const messagesContainer = document.getElementById('chatMessages');
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
                
                function hideTypingIndicator() {
                    document.getElementById('typingIndicator').style.display = 'none';
                }
                
                // Enter key to send message
                document.getElementById('messageInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
                
                // Focus on input
                document.getElementById('messageInput').focus();
            </script>
        </body>
        </html>`;
    }
}