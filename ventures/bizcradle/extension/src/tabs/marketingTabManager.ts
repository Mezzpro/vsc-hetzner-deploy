import * as vscode from 'vscode';
import { ThemeManager } from '../core/themeManager';

export class MarketingTabManager {
    private context: vscode.ExtensionContext;
    private themeManager: ThemeManager;
    private panels: Map<string, vscode.WebviewPanel> = new Map();

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.themeManager = new ThemeManager();
        console.log('📊 Marketing Tab Manager initialized');
    }

    private createBaseWebview(id: string, title: string, column: vscode.ViewColumn = vscode.ViewColumn.One): vscode.WebviewPanel {
        const panel = vscode.window.createWebviewPanel(
            `bizcradle-${id}`,
            title,
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this.context.extensionUri]
            }
        );

        panel.onDidDispose(() => {
            this.panels.delete(id);
        });

        this.panels.set(id, panel);
        return panel;
    }

    public openDashboard(): void {
        const existingPanel = this.panels.get('dashboard');
        if (existingPanel) {
            existingPanel.reveal();
            return;
        }

        const panel = this.createBaseWebview('dashboard', '📊 Marketing Dashboard');
        panel.webview.html = this.getDashboardHTML();
    }

    public openCampaigns(): void {
        const existingPanel = this.panels.get('campaigns');
        if (existingPanel) {
            existingPanel.reveal();
            return;
        }

        const panel = this.createBaseWebview('campaigns', '📢 Campaign Manager', vscode.ViewColumn.Two);
        panel.webview.html = this.getCampaignsHTML();
    }

    public openContent(): void {
        const existingPanel = this.panels.get('content');
        if (existingPanel) {
            existingPanel.reveal();
            return;
        }

        const panel = this.createBaseWebview('content', '📝 Content Studio', vscode.ViewColumn.Three);
        panel.webview.html = this.getContentHTML();
    }

    public openAnalytics(): void {
        const existingPanel = this.panels.get('analytics');
        if (existingPanel) {
            existingPanel.reveal();
            return;
        }

        const panel = this.createBaseWebview('analytics', '📈 Analytics Hub', vscode.ViewColumn.Two);
        panel.webview.html = this.getAnalyticsHTML();
    }

    public openDownload(): void {
        const existingPanel = this.panels.get('download');
        if (existingPanel) {
            existingPanel.reveal();
            return;
        }

        const panel = this.createBaseWebview('download', '💻 Download Desktop', vscode.ViewColumn.Two);
        panel.webview.html = this.getDownloadHTML();
    }

    public openWebPortal(): void {
        // Open native VS Code webview in new browser window
        vscode.env.openExternal(vscode.Uri.parse('http://localhost:3000/?folder=%2Fhome%2Fcoder%2Fworkspaces%2Fbizcradle'));
        vscode.window.showInformationMessage('🔗 Web Portal opened in external browser');
    }

    private getDashboardHTML(): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Marketing Dashboard</title>
            ${this.themeManager.getOrangeCSS()}
        </head>
        <body>
            <div class="bizcradle-container bizcradle-fade-in">
                <div class="bizcradle-header">
                    <h1 class="bizcradle-title">📊 Marketing Dashboard</h1>
                    <p class="bizcradle-subtitle">Real-time marketing metrics and performance overview</p>
                </div>

                <div class="bizcradle-stats">
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">12.5K</span>
                        <span class="bizcradle-stat-label">Total Leads</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">47</span>
                        <span class="bizcradle-stat-label">Active Campaigns</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">$89.2K</span>
                        <span class="bizcradle-stat-label">Revenue Generated</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">23.8%</span>
                        <span class="bizcradle-stat-label">Conversion Rate</span>
                    </div>
                </div>

                <div class="bizcradle-grid">
                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📈 Campaign Performance</h3>
                        <div class="bizcradle-card-content">
                            <p>Recent campaigns showing <span class="bizcradle-highlight">+23% improvement</span> in engagement rates.</p>
                            <p><strong>Top Performing:</strong> Email Marketing Campaign #47</p>
                            <p><strong>ROI:</strong> 340% return on ad spend</p>
                        </div>
                        <button class="bizcradle-button" onclick="openCampaigns()">View Campaigns</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📱 Content Performance</h3>
                        <div class="bizcradle-card-content">
                            <p>Content automation driving <span class="bizcradle-highlight">85% time savings</span> on content creation.</p>
                            <p><strong>Most Engaging:</strong> Video content series</p>
                            <p><strong>Reach:</strong> 150K+ impressions this month</p>
                        </div>
                        <button class="bizcradle-button" onclick="openContent()">Content Studio</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🎯 Lead Generation</h3>
                        <div class="bizcradle-card-content">
                            <p>Automated lead scoring increased qualified leads by <span class="bizcradle-highlight">45%</span>.</p>
                            <p><strong>Hot Leads:</strong> 342 prospects ready to convert</p>
                            <p><strong>Pipeline Value:</strong> $2.3M estimated</p>
                        </div>
                        <button class="bizcradle-button" onclick="openAnalytics()">View Analytics</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🚀 Platform Updates</h3>
                        <div class="bizcradle-card-content">
                            <p>New AI-powered content suggestions now available in desktop app.</p>
                            <p><strong>Version:</strong> Bizcradle Pro 2.1.4</p>
                            <p><strong>Features:</strong> Advanced automation, better analytics</p>
                        </div>
                        <button class="bizcradle-button" onclick="openDownload()">Download Update</button>
                    </div>
                </div>

                <div class="bizcradle-action-bar">
                    <button class="bizcradle-button" onclick="openCampaigns()">📢 Manage Campaigns</button>
                    <button class="bizcradle-button" onclick="openContent()">📝 Create Content</button>
                    <button class="bizcradle-button" onclick="openAnalytics()">📊 View Reports</button>
                    <button class="bizcradle-button" onclick="openWebPortal()">🔗 Open Web Portal</button>
                </div>

                <div class="bizcradle-footer">
                    <p>Bizcradle Marketing Platform • Professional Digital Marketing & Content Creation Suite</p>
                </div>
            </div>

            <script>
                function openCampaigns() {
                    vscode.postMessage({ command: 'openCampaigns' });
                }
                function openContent() {
                    vscode.postMessage({ command: 'openContent' });
                }
                function openAnalytics() {
                    vscode.postMessage({ command: 'openAnalytics' });
                }
                function openDownload() {
                    vscode.postMessage({ command: 'openDownload' });
                }
                function openWebPortal() {
                    vscode.postMessage({ command: 'openWebPortal' });
                }
            </script>
        </body>
        </html>`;
    }

    private getCampaignsHTML(): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Campaign Manager</title>
            ${this.themeManager.getOrangeCSS()}
        </head>
        <body>
            <div class="bizcradle-container bizcradle-fade-in">
                <div class="bizcradle-header">
                    <h1 class="bizcradle-title">📢 Campaign Manager</h1>
                    <p class="bizcradle-subtitle">Create, manage, and optimize your marketing campaigns</p>
                </div>

                <div class="bizcradle-action-bar">
                    <button class="bizcradle-button">➕ New Campaign</button>
                    <button class="bizcradle-button">📊 Campaign Analytics</button>
                    <button class="bizcradle-button">🔄 Automation Rules</button>
                    <button class="bizcradle-button">📤 Export Data</button>
                </div>

                <div class="bizcradle-grid">
                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🎯 Email Marketing Campaign #47</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Status:</strong> <span class="bizcradle-highlight">Active</span></p>
                            <p><strong>Opens:</strong> 12,458 (34.2% rate)</p>
                            <p><strong>Clicks:</strong> 3,892 (10.7% CTR)</p>
                            <p><strong>Conversions:</strong> 287 (7.4%)</p>
                            <p><strong>Budget Used:</strong> $4,250 / $5,000</p>
                        </div>
                        <button class="bizcradle-button">📝 Edit Campaign</button>
                        <button class="bizcradle-button">📊 View Report</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📱 Social Media Automation</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Status:</strong> <span class="bizcradle-highlight">Running</span></p>
                            <p><strong>Posts Scheduled:</strong> 156 this month</p>
                            <p><strong>Engagement Rate:</strong> 8.9% average</p>
                            <p><strong>Reach:</strong> 89K+ followers</p>
                            <p><strong>Auto-Generated Content:</strong> 78%</p>
                        </div>
                        <button class="bizcradle-button">🔧 Configure</button>
                        <button class="bizcradle-button">📅 Schedule Posts</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🎥 Video Marketing Series</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Status:</strong> <span class="bizcradle-highlight">In Production</span></p>
                            <p><strong>Videos Created:</strong> 24 / 30 planned</p>
                            <p><strong>Total Views:</strong> 156K across platforms</p>
                            <p><strong>Engagement:</strong> 12.3% average</p>
                            <p><strong>AI Assistance:</strong> Script generation, editing</p>
                        </div>
                        <button class="bizcradle-button">🎬 Production Tools</button>
                        <button class="bizcradle-button">📈 Performance</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🔍 Lead Generation Campaign</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Status:</strong> <span class="bizcradle-highlight">Optimizing</span></p>
                            <p><strong>Leads Generated:</strong> 2,847 this quarter</p>
                            <p><strong>Cost per Lead:</strong> $23.50 average</p>
                            <p><strong>Qualified Leads:</strong> 1,289 (45.2%)</p>
                            <p><strong>AI Scoring:</strong> Automated lead qualification</p>
                        </div>
                        <button class="bizcradle-button">🎯 Targeting</button>
                        <button class="bizcradle-button">📋 Lead List</button>
                    </div>
                </div>

                <div class="bizcradle-professional-section">
                    <h3 class="bizcradle-card-title">🤖 Campaign Automation Features</h3>
                    <div class="bizcradle-card-content">
                        <p>• <strong>Smart Scheduling:</strong> AI-optimized send times based on audience behavior</p>
                        <p>• <strong>A/B Testing:</strong> Automated testing and optimization of campaign elements</p>
                        <p>• <strong>Dynamic Content:</strong> Personalized content based on user segments</p>
                        <p>• <strong>Cross-Channel Sync:</strong> Unified messaging across email, social, and web</p>
                        <p>• <strong>Performance Alerts:</strong> Real-time notifications for campaign milestones</p>
                    </div>
                </div>

                <div class="bizcradle-footer">
                    <p>Campaign Manager • Automated Marketing at Scale</p>
                </div>
            </div>
        </body>
        </html>`;
    }

    private getContentHTML(): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Content Studio</title>
            ${this.themeManager.getOrangeCSS()}
        </head>
        <body>
            <div class="bizcradle-container bizcradle-fade-in">
                <div class="bizcradle-header">
                    <h1 class="bizcradle-title">📝 Content Studio</h1>
                    <p class="bizcradle-subtitle">AI-powered content creation and automation platform</p>
                </div>

                <div class="bizcradle-action-bar">
                    <button class="bizcradle-button">✨ AI Content Generator</button>
                    <button class="bizcradle-button">🎥 Video Editor</button>
                    <button class="bizcradle-button">🖼️ Image Studio</button>
                    <button class="bizcradle-button">📊 Content Calendar</button>
                </div>

                <div class="bizcradle-grid">
                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🎬 Video Content Creation</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>AI Video Generation:</strong> Create professional videos from text prompts</p>
                            <p><strong>Auto-Editing:</strong> Smart cuts, transitions, and effects</p>
                            <p><strong>Voice Synthesis:</strong> Natural-sounding narration</p>
                            <p><strong>Template Library:</strong> 500+ professional templates</p>
                        </div>
                        <button class="bizcradle-button">🎥 Create Video</button>
                        <button class="bizcradle-button">📁 Video Library</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📄 Blog & Article Generator</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>SEO Optimized:</strong> Automatic keyword optimization</p>
                            <p><strong>Research Integration:</strong> AI-powered fact checking</p>
                            <p><strong>Multi-Format:</strong> Blog posts, articles, newsletters</p>
                            <p><strong>Plagiarism Check:</strong> Ensure 100% original content</p>
                        </div>
                        <button class="bizcradle-button">✍️ Write Article</button>
                        <button class="bizcradle-button">📚 Content Library</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🖼️ Visual Content Studio</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>AI Image Generation:</strong> Custom graphics from descriptions</p>
                            <p><strong>Photo Enhancement:</strong> Professional editing tools</p>
                            <p><strong>Brand Consistency:</strong> Auto-apply brand guidelines</p>
                            <p><strong>Batch Processing:</strong> Bulk editing capabilities</p>
                        </div>
                        <button class="bizcradle-button">🎨 Create Graphics</button>
                        <button class="bizcradle-button">📸 Photo Editor</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📱 Social Media Content</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Platform Optimization:</strong> Auto-resize for all platforms</p>
                            <p><strong>Hashtag Generator:</strong> AI-suggested relevant hashtags</p>
                            <p><strong>Engagement Prediction:</strong> Score content before posting</p>
                            <p><strong>Trending Topics:</strong> Real-time trend integration</p>
                        </div>
                        <button class="bizcradle-button">📱 Create Posts</button>
                        <button class="bizcradle-button">📈 Trend Analysis</button>
                    </div>
                </div>

                <div class="bizcradle-professional-section">
                    <h3 class="bizcradle-card-title">🎯 Content Automation Workflow</h3>
                    <div class="bizcradle-card-content">
                        <p>• <strong>Content Calendar:</strong> Automated scheduling based on optimal posting times</p>
                        <p>• <strong>Cross-Platform Publishing:</strong> One-click distribution to all channels</p>
                        <p>• <strong>Performance Tracking:</strong> Real-time analytics and optimization suggestions</p>
                        <p>• <strong>A/B Testing:</strong> Automatic testing of headlines, images, and content variants</p>
                        <p>• <strong>Content Repurposing:</strong> Transform one piece into multiple formats</p>
                    </div>
                </div>

                <div class="bizcradle-stats">
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">89%</span>
                        <span class="bizcradle-stat-label">Time Saved</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">342</span>
                        <span class="bizcradle-stat-label">Content Pieces</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">45%</span>
                        <span class="bizcradle-stat-label">Engagement Boost</span>
                    </div>
                </div>

                <div class="bizcradle-footer">
                    <p>Content Studio • AI-Powered Creative Suite</p>
                </div>
            </div>
        </body>
        </html>`;
    }

    private getAnalyticsHTML(): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Analytics Hub</title>
            ${this.themeManager.getOrangeCSS()}
        </head>
        <body>
            <div class="bizcradle-container bizcradle-fade-in">
                <div class="bizcradle-header">
                    <h1 class="bizcradle-title">📈 Analytics Hub</h1>
                    <p class="bizcradle-subtitle">Comprehensive marketing performance analytics and insights</p>
                </div>

                <div class="bizcradle-stats">
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">156%</span>
                        <span class="bizcradle-stat-label">ROI Growth</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">89K</span>
                        <span class="bizcradle-stat-label">Monthly Visitors</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">23.8%</span>
                        <span class="bizcradle-stat-label">Conversion Rate</span>
                    </div>
                    <div class="bizcradle-stat">
                        <span class="bizcradle-stat-number">$127K</span>
                        <span class="bizcradle-stat-label">Revenue Generated</span>
                    </div>
                </div>

                <div class="bizcradle-grid">
                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📊 Traffic Analytics</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Unique Visitors:</strong> <span class="bizcradle-highlight">89,234</span> (+18% MoM)</p>
                            <p><strong>Page Views:</strong> 342,891 (+23% MoM)</p>
                            <p><strong>Bounce Rate:</strong> 24.5% (-5% MoM)</p>
                            <p><strong>Avg Session:</strong> 4m 32s (+12% MoM)</p>
                            <p><strong>Top Source:</strong> Organic Search (45.2%)</p>
                        </div>
                        <button class="bizcradle-button">🔍 Detailed Report</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">💰 Revenue Analytics</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Total Revenue:</strong> <span class="bizcradle-highlight">$127,450</span></p>
                            <p><strong>Average Order:</strong> $89.23 (+8% MoM)</p>
                            <p><strong>Customer LTV:</strong> $342.18</p>
                            <p><strong>Conversion Rate:</strong> 23.8% (+3.2% MoM)</p>
                            <p><strong>Revenue/Visitor:</strong> $1.43</p>
                        </div>
                        <button class="bizcradle-button">💳 Sales Funnel</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📧 Email Performance</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Open Rate:</strong> <span class="bizcradle-highlight">34.2%</span> (Industry: 21.3%)</p>
                            <p><strong>Click Rate:</strong> 10.7% (Industry: 2.6%)</p>
                            <p><strong>Unsubscribe:</strong> 0.8% (Industry: 0.5%)</p>
                            <p><strong>List Growth:</strong> +1,247 subscribers</p>
                            <p><strong>Revenue/Email:</strong> $3.42</p>
                        </div>
                        <button class="bizcradle-button">📬 Email Insights</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📱 Social Media Analytics</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Total Followers:</strong> <span class="bizcradle-highlight">156K+</span></p>
                            <p><strong>Engagement Rate:</strong> 8.9% (Industry: 1.2%)</p>
                            <p><strong>Reach:</strong> 2.3M impressions</p>
                            <p><strong>Shares:</strong> 12,847 (+34% MoM)</p>
                            <p><strong>Social Traffic:</strong> 23.4% of total</p>
                        </div>
                        <button class="bizcradle-button">📱 Social Report</button>
                    </div>
                </div>

                <div class="bizcradle-professional-section">
                    <h3 class="bizcradle-card-title">🎯 AI-Powered Insights</h3>
                    <div class="bizcradle-card-content">
                        <p>• <strong>Predictive Analytics:</strong> Forecast performance and identify opportunities</p>
                        <p>• <strong>Anomaly Detection:</strong> Automatic alerts for unusual patterns</p>
                        <p>• <strong>Attribution Modeling:</strong> Multi-touch attribution across channels</p>
                        <p>• <strong>Cohort Analysis:</strong> Track customer behavior over time</p>
                        <p>• <strong>Competitor Benchmarking:</strong> Compare performance against industry</p>
                    </div>
                </div>

                <div class="bizcradle-action-bar">
                    <button class="bizcradle-button">📊 Custom Dashboard</button>
                    <button class="bizcradle-button">📤 Export Report</button>
                    <button class="bizcradle-button">🔔 Set Alerts</button>
                    <button class="bizcradle-button">📈 Forecasting</button>
                </div>

                <div class="bizcradle-footer">
                    <p>Analytics Hub • Data-Driven Marketing Intelligence</p>
                </div>
            </div>
        </body>
        </html>`;
    }

    private getDownloadHTML(): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Desktop</title>
            ${this.themeManager.getOrangeCSS()}
        </head>
        <body>
            <div class="bizcradle-container bizcradle-fade-in">
                <div class="bizcradle-header">
                    <h1 class="bizcradle-title">💻 Download Bizcradle Desktop</h1>
                    <p class="bizcradle-subtitle">Get the full-featured desktop application with advanced automation tools</p>
                </div>

                <div class="bizcradle-professional-section bizcradle-text-center">
                    <h3 class="bizcradle-card-title">🚀 Bizcradle Pro Desktop v2.1.4</h3>
                    <div class="bizcradle-card-content">
                        <p>Enhanced with AI-powered content generation, advanced analytics, and offline capabilities</p>
                        <p><strong>File Size:</strong> 156 MB • <strong>Compatibility:</strong> Windows 10+, macOS 10.15+, Linux</p>
                    </div>
                </div>

                <div class="bizcradle-grid">
                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🪟 Windows Desktop</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Version:</strong> 2.1.4 (Latest)</p>
                            <p><strong>Size:</strong> 156 MB</p>
                            <p><strong>Requirements:</strong> Windows 10 or later</p>
                            <p><strong>Features:</strong> Full automation suite, offline mode</p>
                        </div>
                        <button class="bizcradle-button" onclick="downloadWindows()">📥 Download for Windows</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🍎 macOS Desktop</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Version:</strong> 2.1.4 (Latest)</p>
                            <p><strong>Size:</strong> 142 MB</p>
                            <p><strong>Requirements:</strong> macOS 10.15 or later</p>
                            <p><strong>Features:</strong> Native macOS integration, Touch Bar support</p>
                        </div>
                        <button class="bizcradle-button" onclick="downloadMac()">📥 Download for macOS</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">🐧 Linux Desktop</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>Version:</strong> 2.1.4 (Latest)</p>
                            <p><strong>Size:</strong> 134 MB</p>
                            <p><strong>Requirements:</strong> Ubuntu 18.04+, CentOS 7+</p>
                            <p><strong>Formats:</strong> AppImage, DEB, RPM packages</p>
                        </div>
                        <button class="bizcradle-button" onclick="downloadLinux()">📥 Download for Linux</button>
                    </div>

                    <div class="bizcradle-card">
                        <h3 class="bizcradle-card-title">📱 Mobile Companion</h3>
                        <div class="bizcradle-card-content">
                            <p><strong>iOS App:</strong> Available on App Store</p>
                            <p><strong>Android App:</strong> Available on Play Store</p>
                            <p><strong>Features:</strong> Campaign monitoring, quick content creation</p>
                            <p><strong>Sync:</strong> Real-time sync with desktop</p>
                        </div>
                        <button class="bizcradle-button" onclick="downloadMobile()">📱 Get Mobile Apps</button>
                    </div>
                </div>

                <div class="bizcradle-professional-section">
                    <h3 class="bizcradle-card-title">✨ What's New in v2.1.4</h3>
                    <div class="bizcradle-card-content">
                        <p>• <strong>Enhanced AI Engine:</strong> 40% faster content generation with improved quality</p>
                        <p>• <strong>Advanced Video Editor:</strong> New AI-powered editing tools and effects</p>
                        <p>• <strong>Better Analytics:</strong> Real-time dashboard with predictive insights</p>
                        <p>• <strong>Collaboration Tools:</strong> Team workspace and shared campaigns</p>
                        <p>• <strong>API Integrations:</strong> Connect with 200+ marketing tools</p>
                        <p>• <strong>Performance:</strong> 60% faster startup and improved memory usage</p>
                    </div>
                </div>

                <div class="bizcradle-professional-section">
                    <h3 class="bizcradle-card-title">🔧 System Requirements</h3>
                    <div class="bizcradle-card-content">
                        <p>• <strong>RAM:</strong> 8 GB minimum, 16 GB recommended</p>
                        <p>• <strong>Storage:</strong> 2 GB free space</p>
                        <p>• <strong>Internet:</strong> Required for AI features and sync</p>
                        <p>• <strong>Graphics:</strong> DirectX 11 compatible (Windows)</p>
                        <p>• <strong>License:</strong> Valid Bizcradle Pro subscription required</p>
                    </div>
                </div>

                <div class="bizcradle-action-bar">
                    <button class="bizcradle-button">📋 Release Notes</button>
                    <button class="bizcradle-button">🛠️ Installation Guide</button>
                    <button class="bizcradle-button">💬 Support</button>
                    <button class="bizcradle-button">🔄 Check for Updates</button>
                </div>

                <div class="bizcradle-footer">
                    <p>Bizcradle Desktop • Professional Marketing Automation Platform</p>
                </div>
            </div>

            <script>
                function downloadWindows() {
                    vscode.postMessage({ command: 'download', platform: 'windows' });
                }
                function downloadMac() {
                    vscode.postMessage({ command: 'download', platform: 'mac' });
                }
                function downloadLinux() {
                    vscode.postMessage({ command: 'download', platform: 'linux' });
                }
                function downloadMobile() {
                    vscode.postMessage({ command: 'download', platform: 'mobile' });
                }
            </script>
        </body>
        </html>`;
    }
}