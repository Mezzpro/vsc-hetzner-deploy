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

    // Check if we're in Cradle workspace (workspace-admin)
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const isCradleWorkspace = workspaceFolders?.some(folder => 
        folder.uri.path.includes('workspace-admin')
    );

    if (!isCradleWorkspace) {
        console.log('ℹ️ Not in Cradle workspace, extension will remain dormant');
        return;
    }

    console.log('✅ Cradle workspace detected, initializing business interface...');

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
        console.log('🧭 Config navigation:', (config as any).navigation);
        console.log('🎨 Config theme:', config.theme);
        
        // Set theme
        themeManager.setTheme(config.theme);
        
        // Configure VS Code UI for business interface
        await uiManager.hideVSCodeUI();
        await uiManager.showBusinessInterface();
        
        // Force strict UI hiding
        await configureStrictBusinessUI();
        
        // Initialize tab manager
        const tabManager = new TabManager(context, themeManager);
        
        // Create business navigation with debugging
        const configNavigation = (config as any).navigation;
        console.log('🔍 Config navigation exists:', !!configNavigation);
        console.log('🔍 Config navigation length:', configNavigation?.length);
        
        const navigationItems = configNavigation || [
            { label: '🏢 Business Dashboard', command: 'cradle.dashboard', icon: 'dashboard', description: 'View business metrics and overview' },
            { label: '📊 Analytics Center', command: 'cradle.analytics', icon: 'graph', description: 'Business analytics and insights' },
            { label: '📥 Download Center', command: 'cradle.downloads', icon: 'cloud-download', description: 'Download business applications and files' },
            { label: '🔧 Business Tools', command: 'cradle.tools', icon: 'tools', description: 'Essential business utilities' },
            { label: '💬 Chat Assistant', command: 'cradle.chatbot', icon: 'comment', description: 'AI-powered business assistant' }
        ];
        
        console.log('📋 Final navigation items:');
        navigationItems.forEach((item: any, index: number) => {
            console.log(`  ${index + 1}. ${item.label} -> ${item.command}`);
        });
        
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
                tabManager.createOrFocusTab('dashboard', () => 
                    tabManager.createDashboardTab()
                );
            }),

            // Analytics command  
            vscode.commands.registerCommand('cradle.analytics', () => {
                console.log('📊 Analytics command executed!');
                tabManager.createOrFocusTab('analytics', () =>
                    tabManager.createAnalyticsTab()
                );
            }),

            // Downloads command
            vscode.commands.registerCommand('cradle.downloads', () => {
                console.log('📥 Downloads command executed!');
                tabManager.createOrFocusTab('downloads', () =>
                    tabManager.createDownloadsTab()
                );
            }),

            // Tools command
            vscode.commands.registerCommand('cradle.tools', () => {
                console.log('🔧 Tools command executed!');
                tabManager.createOrFocusTab('tools', () =>
                    tabManager.createToolsTab()
                );
            }),

            // Chatbot command
            vscode.commands.registerCommand('cradle.chatbot', () => {
                console.log('💬 Chatbot command executed!');
                tabManager.createOrFocusTab('chatbot', () =>
                    tabManager.createChatbotTab()
                );
            }),

            // Workspace layout command
            vscode.commands.registerCommand('cradle.workspace', () => {
                console.log('🏢 Workspace layout command executed!');
                
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
        
        // Auto-open business dashboard for Cradle workspace
        console.log('✅ Cradle workspace detected, auto-opening business dashboard...');
        setTimeout(() => {
            console.log('🚀 Auto-executing cradle dashboard command...');
            vscode.commands.executeCommand('cradle.dashboard');
        }, 1000);
        
        console.log('✅ CRADLE BUSINESS EXTENSION ACTIVATION COMPLETED!');

    } catch (error) {
        console.error('❌ Extension activation failed:', error);
        vscode.window.showErrorMessage(`Cradle Business Extension activation failed: ${error}`);
    }
}

async function configureStrictBusinessUI(): Promise<void> {
    console.log('🔒 Applying strict UI configuration for business interface...');
    
    try {
        const config = vscode.workspace.getConfiguration();
        
        // Force hide terminal and panels completely
        await config.update('workbench.panel.visible', false, vscode.ConfigurationTarget.Global);
        await config.update('terminal.integrated.showOnStartup', 'never', vscode.ConfigurationTarget.Global);
        await config.update('workbench.view.terminal.visible', false, vscode.ConfigurationTarget.Global);
        
        // Hide all outline and timeline elements
        await config.update('outline.showFiles', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showModules', false, vscode.ConfigurationTarget.Global); 
        await config.update('outline.showPackages', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showClasses', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showMethods', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showProperties', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showFields', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showConstructors', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showEnums', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showInterfaces', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showFunctions', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showVariables', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showConstants', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showStrings', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showNumbers', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showBooleans', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showArrays', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showObjects', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showKeys', false, vscode.ConfigurationTarget.Global);
        await config.update('outline.showNull', false, vscode.ConfigurationTarget.Global);
        await config.update('timeline.excludeSources', ['git-history', 'timeline-source', 'extension-timeline'], vscode.ConfigurationTarget.Global);
        
        // Hide unwanted files and folders
        await config.update('files.exclude', {
            '**/.*': true,
            '**/.git': true,
            '**/.svn': true, 
            '**/.hg': true,
            '**/CVS': true,
            '**/.DS_Store': true,
            '**/node_modules': true,
            '**/.vscode': true,
            '**/install-gemini.sh': true
        }, vscode.ConfigurationTarget.Global);
        
        // Force close any open terminal panels
        vscode.commands.executeCommand('workbench.action.closePanel');
        
        // Hide specific extension views
        vscode.commands.executeCommand('setContext', 'cradle-business-nav:visible', true);
        vscode.commands.executeCommand('setContext', 'mezzpro-blockchain-nav:visible', false);
        vscode.commands.executeCommand('setContext', 'bizcradle-marketing-nav:visible', false);
        
        // Force close outline and timeline views
        vscode.commands.executeCommand('outline.collapse');
        vscode.commands.executeCommand('timeline.collapse');
        vscode.commands.executeCommand('workbench.view.explorer.openEditors.visible', false);
        
        console.log('✅ Strict UI configuration applied');
    } catch (error) {
        console.error('❌ Failed to apply strict UI configuration:', error);
    }
}

export function deactivate() {
    console.log('🏢 Cradle Business Extension deactivated');
}