import * as vscode from 'vscode';
import { VentureManager } from './core/ventureManager';
import { ConfigManager } from './core/configManager';
import { ThemeManager } from './core/themeManager';
import { UIManager } from './core/uiManager';
import { TabManager } from './shared/components/tabManager';
import { BusinessNavigationProvider } from './ventures/cradle/navigation/businessNavProvider';

export async function activate(context: vscode.ExtensionContext) {
    console.log('🚀 CRADLE BUSINESS EXTENSION ACTIVATION STARTED!');
    console.log('📍 Extension Context Path:', context.extensionPath);
    
    // Show activation notification
    vscode.window.showInformationMessage('🏢 Cradle Business Suite Activated!');

    try {
        // Initialize core managers
        const ventureManager = new VentureManager();
        const configManager = new ConfigManager();
        const themeManager = new ThemeManager();
        const uiManager = new UIManager(context);
        
        // Get current venture configuration
        const currentVenture = ventureManager.getCurrentVenture();
        const config = await ventureManager.getConfig();
        
        console.log('🏢 Current venture:', currentVenture);
        console.log('⚙️ Venture config loaded:', config.name);
        
        // Set theme
        themeManager.setTheme(config.theme);
        
        // Configure VS Code UI for business interface
        await uiManager.hideVSCodeUI();
        await uiManager.showBusinessInterface();
        
        // Initialize tab manager
        const tabManager = new TabManager(context, themeManager);
        
        // Create business navigation
        const navigationItems = (config as any).navigation || [
            { label: '🏢 Business Dashboard', command: 'cradle.dashboard', icon: 'dashboard', description: 'View business metrics and overview' },
            { label: '📊 Analytics Center', command: 'cradle.analytics', icon: 'graph', description: 'Business analytics and insights' },
            { label: '📥 Download Center', command: 'cradle.downloads', icon: 'cloud-download', description: 'Download business applications and files' },
            { label: '🔧 Business Tools', command: 'cradle.tools', icon: 'tools', description: 'Essential business utilities' },
            { label: '💬 Chat Assistant', command: 'cradle.chatbot', icon: 'comment', description: 'AI-powered business assistant' }
        ];
        
        const businessNavigationProvider = new BusinessNavigationProvider(navigationItems);
        
        console.log('🌳 Creating Business Navigation TreeView...');
        const treeView = vscode.window.createTreeView('cradle-business-nav', {
            treeDataProvider: businessNavigationProvider,
            showCollapseAll: false,
            canSelectMany: false
        });
        
        console.log('✅ Business Navigation TreeView created, visible:', treeView.visible);

        // Register commands for business tabs
        const disposables = [
            // Dashboard command
            vscode.commands.registerCommand('cradle.dashboard', () => {
                console.log('🏢 Dashboard command executed!');
                vscode.window.showInformationMessage('Opening Business Dashboard...');
                tabManager.createOrFocusTab('dashboard', () => 
                    tabManager.createDashboardTab()
                );
            }),

            // Analytics command  
            vscode.commands.registerCommand('cradle.analytics', () => {
                console.log('📊 Analytics command executed!');
                vscode.window.showInformationMessage('Opening Analytics Center...');
                tabManager.createOrFocusTab('analytics', () =>
                    tabManager.createAnalyticsTab()
                );
            }),

            // Downloads command
            vscode.commands.registerCommand('cradle.downloads', () => {
                console.log('📥 Downloads command executed!');
                vscode.window.showInformationMessage('Opening Download Center...');
                tabManager.createOrFocusTab('downloads', () =>
                    tabManager.createDownloadsTab()
                );
            }),

            // Tools command
            vscode.commands.registerCommand('cradle.tools', () => {
                console.log('🔧 Tools command executed!');
                vscode.window.showInformationMessage('Opening Business Tools...');
                tabManager.createOrFocusTab('tools', () =>
                    tabManager.createToolsTab()
                );
            }),

            // Chatbot command
            vscode.commands.registerCommand('cradle.chatbot', () => {
                console.log('💬 Chatbot command executed!');
                vscode.window.showInformationMessage('Opening Chat Assistant...');
                tabManager.createOrFocusTab('chatbot', () =>
                    tabManager.createChatbotTab()
                );
            }),

            // Workspace layout command
            vscode.commands.registerCommand('cradle.workspace', () => {
                console.log('🏢 Workspace layout command executed!');
                vscode.window.showInformationMessage('Creating Business Workspace Layout...');
                
                // Create all tabs in sequence
                tabManager.createOrFocusTab('dashboard', () => tabManager.createDashboardTab());
                setTimeout(() => {
                    tabManager.createOrFocusTab('analytics', () => tabManager.createAnalyticsTab());
                }, 500);
                setTimeout(() => {
                    tabManager.createOrFocusTab('downloads', () => tabManager.createDownloadsTab());
                }, 1000);
                setTimeout(() => {
                    tabManager.createOrFocusTab('tools', () => tabManager.createToolsTab());
                }, 1500);
            }),

            // MezzPro Blockchain Commands
            vscode.commands.registerCommand('mezzpro.dashboard', () => {
                console.log('⛓️ MezzPro Dashboard command executed!');
                vscode.window.showInformationMessage('Opening Blockchain Dashboard...');
                tabManager.createOrFocusTab('mezzpro-dashboard', () => 
                    tabManager.createMezzProDashboardTab()
                );
            }),

            vscode.commands.registerCommand('mezzpro.analytics', () => {
                console.log('📊 MezzPro Analytics command executed!');
                vscode.window.showInformationMessage('Opening Analytics Hub...');
                tabManager.createOrFocusTab('mezzpro-analytics', () =>
                    tabManager.createMezzProAnalyticsTab()
                );
            }),

            vscode.commands.registerCommand('mezzpro.network', () => {
                console.log('🔗 MezzPro Network command executed!');
                vscode.window.showInformationMessage('Opening Node Network...');
                tabManager.createOrFocusTab('mezzpro-network', () =>
                    tabManager.createMezzProNetworkTab()
                );
            }),

            vscode.commands.registerCommand('mezzpro.contracts', () => {
                console.log('⚡ MezzPro Contracts command executed!');
                vscode.window.showInformationMessage('Opening Smart Contracts...');
                tabManager.createOrFocusTab('mezzpro-contracts', () =>
                    tabManager.createMezzProContractsTab()
                );
            }),

            vscode.commands.registerCommand('mezzpro.chatbot', () => {
                console.log('💬 MezzPro AI Assistant command executed!');
                vscode.window.showInformationMessage('Opening Blockchain AI Assistant...');
                tabManager.createOrFocusTab('chatbot', () =>
                    tabManager.createChatbotTab()
                );
            })
        ];

        context.subscriptions.push(...disposables, treeView);
        console.log('✅ All commands and TreeView registered successfully!');

        // Auto-create dashboard on activation for admin workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        console.log('🔍 Extension activated, checking workspace:');
        console.log('📁 Workspace folders:', workspaceFolders?.map(f => ({
            name: f.name,
            path: f.uri.path,
            scheme: f.uri.scheme
        })));
        
        if (workspaceFolders) {
            const hasAdminWorkspace = workspaceFolders.some(folder => {
                const hasAdmin = folder.uri.path.includes('workspace-admin');
                console.log(`📁 Checking folder: ${folder.uri.path} - Contains admin: ${hasAdmin}`);
                return hasAdmin;
            });
            
            if (hasAdminWorkspace) {
                console.log('✅ Admin workspace detected, creating dashboard in 3 seconds...');
                vscode.window.showInformationMessage('Cradle Systems workspace detected! Opening business dashboard...', 'Open Dashboard', 'Skip')
                    .then(selection => {
                        if (selection === 'Open Dashboard') {
                            setTimeout(() => {
                                console.log('🚀 Auto-executing dashboard command...');
                                vscode.commands.executeCommand('cradle.dashboard');
                            }, 1000);
                        }
                    });
            } else {
                console.log('ℹ️ Non-admin workspace detected');
                vscode.window.showInformationMessage('Cradle Business Suite loaded - Use sidebar navigation or Command Palette');
            }
        } else {
            console.log('ℹ️ No workspace folders found');
            vscode.window.showInformationMessage('Cradle Business Suite loaded - Open a workspace to get started');
        }
        
        console.log('✅ CRADLE BUSINESS EXTENSION ACTIVATION COMPLETED!');

    } catch (error) {
        console.error('❌ Extension activation failed:', error);
        vscode.window.showErrorMessage(`Cradle Business Extension activation failed: ${error}`);
    }
}

export function deactivate() {
    console.log('🏢 Cradle Business Extension deactivated');
}