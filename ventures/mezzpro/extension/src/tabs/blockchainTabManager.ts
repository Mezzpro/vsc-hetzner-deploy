import * as vscode from 'vscode';
import { ThemeManager } from '../core/themeManager';

export class BlockchainTabManager {
    private activeTabs: Map<string, vscode.WebviewPanel> = new Map();

    constructor(
        private context: vscode.ExtensionContext,
        private themeManager: ThemeManager
    ) {}

    createOrFocusTab(tabId: string, creator: () => vscode.WebviewPanel): void {
        const existingTab = this.activeTabs.get(tabId);
        
        if (existingTab) {
            // Focus existing tab
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
            'mezzpro-blockchain-dashboard',
            '⛓️ Blockchain Dashboard',
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getDashboardHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'blockchain-dashboard'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createAnalyticsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'mezzpro-analytics-hub',
            '📊 Analytics Hub',
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getAnalyticsHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'analytics-hub'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createNetworkTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'mezzpro-node-network',
            '🔗 Node Network',
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getNetworkHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'node-network'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createContractsTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'mezzpro-smart-contracts',
            '⚡ Smart Contracts',
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getContractsHTML();
        
        panel.webview.onDidReceiveMessage(
            message => this.handleMessage(message, 'smart-contracts'),
            undefined,
            this.context.subscriptions
        );

        return panel;
    }

    createChatbotTab(): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            'mezzpro-ai-assistant',
            '💬 AI Assistant',
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
            case 'download':
                vscode.window.showInformationMessage(`📥 Downloading: ${message.file}`);
                break;
            case 'alert':
                vscode.window.showInformationMessage(message.text);
                break;
            case 'openTab':
                this.openRelatedTab(message.tab);
                break;
        }
    }

    private handleChatMessage(message: any): void {
        if (message.command === 'sendMessage') {
            const userMessage = message.text;
            console.log('💬 User message:', userMessage);
            
            // Simulate blockchain AI response
            setTimeout(() => {
                const responses = [
                    "I can help you with blockchain development, smart contracts, and DeFi protocols.",
                    "MezzPro blockchain supports high-throughput transactions with 3,247 TPS capacity.",
                    "For smart contract deployment, use the Templates section in the Smart Contracts tab.",
                    "Current network has 156 active validators with 89.7% staking ratio.",
                    "MEZZ token price is $45.67 with $2.1B total value locked in DeFi protocols."
                ];
                
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                const panel = this.activeTabs.get('chatbot');
                if (panel) {
                    panel.webview.postMessage({
                        command: 'addMessage',
                        message: {
                            type: 'assistant',
                            content: response,
                            timestamp: new Date().toLocaleTimeString()
                        }
                    });
                }
            }, 1000 + Math.random() * 2000);
        }
    }

    private openRelatedTab(tabName: string): void {
        switch (tabName) {
            case 'dashboard':
                vscode.commands.executeCommand('mezzpro.dashboard');
                break;
            case 'analytics':
                vscode.commands.executeCommand('mezzpro.analytics');
                break;
            case 'network':
                vscode.commands.executeCommand('mezzpro.network');
                break;
            case 'contracts':
                vscode.commands.executeCommand('mezzpro.contracts');
                break;
        }
    }

    private getDashboardHTML(): string {
        const themeCSS = this.themeManager.getBlockchainThemeCSS();
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Blockchain Dashboard</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="content">
                <div class="header">
                    <h1 class="matrix-glow">⛓️ Blockchain Dashboard</h1>
                    <p>Real-time blockchain network status and metrics</p>
                </div>
                
                <div class="grid">
                    <div class="card">
                        <h3>🔗 Network Status</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">99.8%</div>
                            <div class="metric-label">NETWORK UPTIME</div>
                        </div>
                        <div class="grid-2" style="margin-top: 20px;">
                            <div class="metric">
                                <div class="metric-value">2,847,293</div>
                                <div class="metric-label">Block Height</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">12.5s</div>
                                <div class="metric-label">Avg Block Time</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>💰 Token Metrics</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">$45.67</div>
                            <div class="metric-label">MEZZ TOKEN PRICE</div>
                        </div>
                        <div class="grid-2" style="margin-top: 20px;">
                            <div class="metric">
                                <div class="metric-value">1.2B</div>
                                <div class="metric-label">Total Supply</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">847M</div>
                                <div class="metric-label">Circulating</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>⚡ Network Activity</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">3,247</div>
                            <div class="metric-label">TXS PER SECOND</div>
                        </div>
                        <div class="grid-2" style="margin-top: 20px;">
                            <div class="metric">
                                <div class="metric-value">156</div>
                                <div class="metric-label">Active Validators</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">89.7%</div>
                                <div class="metric-label">Staking Ratio</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>🏗️ DeFi Protocol</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">$2.1B</div>
                            <div class="metric-label">TOTAL VALUE LOCKED</div>
                        </div>
                        <div style="margin-top: 24px;">
                            <button class="download-btn" onclick="stakeMezz()">Stake MEZZ Tokens</button>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 32px;">
                    <h3>🚀 Quick Actions</h3>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="openNetwork()">Node Network</button>
                        <button class="btn-secondary" onclick="openContracts()">Smart Contracts</button>
                        <button class="btn-secondary" onclick="openAnalytics()">Analytics Hub</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function stakeMezz() {
                    vscode.postMessage({ command: 'download', file: 'mezz-staking-app.dapp' });
                }
                
                function openNetwork() {
                    vscode.postMessage({ command: 'openTab', tab: 'network' });
                }
                
                function openContracts() {
                    vscode.postMessage({ command: 'openTab', tab: 'contracts' });
                }
                
                function openAnalytics() {
                    vscode.postMessage({ command: 'openTab', tab: 'analytics' });
                }
            </script>
        </body>
        </html>`;
    }

    private getAnalyticsHTML(): string {
        const themeCSS = this.themeManager.getBlockchainThemeCSS();
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Analytics Hub</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="content">
                <div class="header">
                    <h1 class="matrix-glow">📊 Analytics Hub</h1>
                    <p>Transaction analytics and blockchain insights</p>
                </div>
                
                <div class="grid">
                    <div class="card">
                        <h3>📈 Transaction Volume</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">$127.4M</div>
                            <div class="metric-label">24H VOLUME</div>
                        </div>
                        <div class="grid-2" style="margin-top: 20px;">
                            <div class="metric">
                                <div class="metric-value">2.1M</div>
                                <div class="metric-label">Transactions</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">45,892</div>
                                <div class="metric-label">Active Addresses</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>🔄 DeFi Analytics</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">$2.1B</div>
                            <div class="metric-label">TVL GROWTH</div>
                        </div>
                        <div class="grid-2" style="margin-top: 20px;">
                            <div class="metric">
                                <div class="metric-value">156</div>
                                <div class="metric-label">Active Pools</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">23.4%</div>
                                <div class="metric-label">Avg APY</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 24px;">
                    <h3>📋 Analytics Actions</h3>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <button class="download-btn" onclick="exportAnalytics()">Export Analytics Report</button>
                        <button class="btn-secondary" onclick="viewDashboard()">Blockchain Dashboard</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function exportAnalytics() {
                    vscode.postMessage({ command: 'download', file: 'blockchain-analytics-report.json' });
                }
                
                function viewDashboard() {
                    vscode.postMessage({ command: 'openTab', tab: 'dashboard' });
                }
            </script>
        </body>
        </html>`;
    }

    private getNetworkHTML(): string {
        const themeCSS = this.themeManager.getBlockchainThemeCSS();
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Node Network</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="content">
                <div class="header">
                    <h1 class="matrix-glow">🔗 Node Network</h1>
                    <p>Manage validator nodes and network infrastructure</p>
                </div>
                
                <div class="grid">
                    <div class="card">
                        <h3>🖥️ Your Validator Node</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">Online</div>
                            <div class="metric-label">NODE STATUS</div>
                        </div>
                        <div class="grid-2" style="margin-top: 20px;">
                            <div class="metric">
                                <div class="metric-value">99.98%</div>
                                <div class="metric-label">Uptime</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">847.2 MEZZ</div>
                                <div class="metric-label">Rewards Earned</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>🌐 Network Overview</h3>
                        <div class="metric">
                            <div class="metric-value matrix-glow">156</div>
                            <div class="metric-label">ACTIVE VALIDATORS</div>
                        </div>
                        <div class="grid-2" style="margin-top: 20px;">
                            <div class="metric">
                                <div class="metric-value">23</div>
                                <div class="metric-label">Countries</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">89.7%</div>
                                <div class="metric-label">Network Health</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 24px;">
                    <h3>🚀 Node Management</h3>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <button class="download-btn" onclick="downloadNodeSetup()">Download Node Setup</button>
                        <button class="btn-secondary" onclick="viewDashboard()">Dashboard</button>
                        <button class="btn-secondary" onclick="openContracts()">Smart Contracts</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function downloadNodeSetup() {
                    vscode.postMessage({ command: 'download', file: 'mezzpro-validator-setup.tar.gz' });
                }
                
                function viewDashboard() {
                    vscode.postMessage({ command: 'openTab', tab: 'dashboard' });
                }
                
                function openContracts() {
                    vscode.postMessage({ command: 'openTab', tab: 'contracts' });
                }
            </script>
        </body>
        </html>`;
    }

    private getContractsHTML(): string {
        const themeCSS = this.themeManager.getBlockchainThemeCSS();
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Smart Contracts</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="content">
                <div class="header">
                    <h1 class="matrix-glow">⚡ Smart Contracts</h1>
                    <p>Deploy and manage smart contracts on MezzPro blockchain</p>
                </div>
                
                <div class="grid">
                    <div class="card">
                        <h3>📜 Contract Templates</h3>
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">📋</div>
                            <p>Pre-built contract templates for common use cases</p>
                        </div>
                        <button class="download-btn" onclick="downloadTemplates()">Download Templates</button>
                    </div>
                    
                    <div class="card">
                        <h3>🚀 Deployment Tools</h3>
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🛠️</div>
                            <p>Advanced tools for contract deployment and testing</p>
                        </div>
                        <button class="download-btn" onclick="downloadTools()">Download Tools</button>
                    </div>
                    
                    <div class="card">
                        <h3>🔍 Contract Explorer</h3>
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🔎</div>
                            <p>Explore and verify deployed contracts</p>
                        </div>
                        <button class="download-btn" onclick="downloadExplorer()">Download Explorer</button>
                    </div>
                    
                    <div class="card">
                        <h3>📚 Documentation</h3>
                        <div style="text-align: center; margin: 20px 0;">
                            <div style="font-size: 3rem; margin-bottom: 16px;">📖</div>
                            <p>Smart contract development documentation</p>
                        </div>
                        <button class="download-btn" onclick="downloadDocs()">Download Docs</button>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 32px;">
                    <h3>🚀 Quick Actions</h3>
                    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="viewDashboard()">Blockchain Dashboard</button>
                        <button class="btn-secondary" onclick="openNetwork()">Node Network</button>
                        <button class="btn-secondary" onclick="openAnalytics()">Analytics Hub</button>
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function downloadTemplates() {
                    vscode.postMessage({ command: 'download', file: 'smart-contract-templates.zip' });
                }
                
                function downloadTools() {
                    vscode.postMessage({ command: 'download', file: 'mezzpro-contract-tools.dapp' });
                }
                
                function downloadExplorer() {
                    vscode.postMessage({ command: 'download', file: 'contract-explorer.dapp' });
                }
                
                function downloadDocs() {
                    vscode.postMessage({ command: 'download', file: 'smart-contract-docs.pdf' });
                }
                
                function viewDashboard() {
                    vscode.postMessage({ command: 'openTab', tab: 'dashboard' });
                }
                
                function openNetwork() {
                    vscode.postMessage({ command: 'openTab', tab: 'network' });
                }
                
                function openAnalytics() {
                    vscode.postMessage({ command: 'openTab', tab: 'analytics' });
                }
            </script>
        </body>
        </html>`;
    }

    private getChatbotHTML(): string {
        const themeCSS = this.themeManager.getBlockchainThemeCSS();
        
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Blockchain AI Assistant</title>
            <style>${themeCSS}</style>
        </head>
        <body>
            <div class="chat-container">
                <div class="header">
                    <h1 class="matrix-glow">💬 Blockchain AI Assistant</h1>
                    <p>Your intelligent blockchain development companion</p>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="message assistant animate-fade-in">
                        <strong>MezzPro AI:</strong> Welcome to MezzPro Blockchain Platform! I can help you with smart contracts, DeFi protocols, and blockchain development. How can I assist you today?
                    </div>
                </div>
                
                <div class="chat-input">
                    <div style="display: flex; gap: 12px;">
                        <input type="text" id="messageInput" placeholder="Ask about blockchain development, smart contracts, DeFi..." 
                               style="flex: 1; padding: 12px; border: 1px solid var(--mezzpro-border); border-radius: 6px; 
                                      background: var(--mezzpro-accent); color: var(--mezzpro-text); 
                                      font-family: 'Courier New', monospace;">
                        <button onclick="sendMessage()" class="btn-primary">Send</button>
                    </div>
                    <div id="typingIndicator" style="display: none; margin-top: 12px; color: var(--mezzpro-primary); font-style: italic;">
                        🤖 MezzPro AI is thinking...
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function sendMessage() {
                    const input = document.getElementById('messageInput');
                    const message = input.value.trim();
                    
                    if (message) {
                        // Add user message
                        addMessage('user', message);
                        input.value = '';
                        
                        // Show typing indicator
                        showTypingIndicator();
                        
                        // Send to extension
                        vscode.postMessage({
                            command: 'sendMessage',
                            text: message
                        });
                    }
                }
                
                function addMessage(type, content) {
                    const messagesContainer = document.getElementById('chatMessages');
                    const messageDiv = document.createElement('div');
                    messageDiv.className = \`message \${type} animate-fade-in\`;
                    
                    const timestamp = new Date().toLocaleTimeString();
                    if (type === 'user') {
                        messageDiv.innerHTML = \`<strong>You:</strong> \${content}\`;
                    } else {
                        messageDiv.innerHTML = \`<strong>MezzPro AI:</strong> \${content}\`;
                    }
                    
                    messagesContainer.appendChild(messageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
                
                function showTypingIndicator() {
                    document.getElementById('typingIndicator').style.display = 'block';
                }
                
                function hideTypingIndicator() {
                    document.getElementById('typingIndicator').style.display = 'none';
                }
                
                // Listen for messages from extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    
                    if (message.command === 'addMessage') {
                        hideTypingIndicator();
                        addMessage(message.message.type, message.message.content);
                    }
                });
                
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