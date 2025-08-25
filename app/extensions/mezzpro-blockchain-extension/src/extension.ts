import * as vscode from 'vscode';
import { ThemeManager } from './core/themeManager';
import { BlockchainTabManager } from './tabs/blockchainTabManager';
import { BlockchainNavigationProvider, BlockchainNavigationItem } from './navigation/blockchainNavProvider';

export async function activate(context: vscode.ExtensionContext) {
    console.log('⛓️ MEZZPRO BLOCKCHAIN EXTENSION ACTIVATION STARTED!');
    console.log('📍 Extension Context Path:', context.extensionPath);
    
    // Extension activating silently

    try {
        // Check if we're in MezzPro workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const isMezzProWorkspace = workspaceFolders?.some(folder => 
            folder.uri.path.includes('workspace-mezzpro')
        );

        if (!isMezzProWorkspace) {
            console.log('ℹ️ Not in MezzPro workspace, extension will remain dormant');
            return;
        }

        console.log('✅ MezzPro workspace detected, initializing blockchain interface...');

        // Initialize core managers
        const themeManager = new ThemeManager();
        const tabManager = new BlockchainTabManager(context, themeManager);
        
        // Configure VS Code UI for blockchain interface
        await configureBlockchainUI();
        
        // Force strict UI hiding
        await configureStrictBlockchainUI();
        
        // Create blockchain navigation
        const navigationItems: BlockchainNavigationItem[] = [
            {
                label: "⛓️ Blockchain Dashboard",
                command: "mezzpro.dashboard",
                icon: "pulse",
                description: "Network status and blockchain overview"
            },
            {
                label: "📊 Analytics Hub",
                command: "mezzpro.analytics", 
                icon: "graph",
                description: "Transaction analytics and network metrics"
            },
            {
                label: "🔗 Node Network",
                command: "mezzpro.network",
                icon: "server",
                description: "Node management and validator tools"
            },
            {
                label: "⚡ Smart Contracts",
                command: "mezzpro.contracts",
                icon: "code",
                description: "Contract deployment and testing tools"
            },
            {
                label: "💬 AI Assistant",
                command: "mezzpro.chatbot",
                icon: "comment",
                description: "Blockchain-focused AI assistant"
            }
        ];
        
        const blockchainNavigationProvider = new BlockchainNavigationProvider(navigationItems);
        
        console.log('🌳 Creating Blockchain Navigation TreeView...');
        const treeView = vscode.window.createTreeView('mezzpro-blockchain-nav', {
            treeDataProvider: blockchainNavigationProvider,
            showCollapseAll: false,
            canSelectMany: false
        });
        
        console.log('✅ Blockchain Navigation TreeView created, visible:', treeView.visible);

        // Register MezzPro blockchain commands
        const disposables = [
            // Blockchain Dashboard command
            vscode.commands.registerCommand('mezzpro.dashboard', () => {
                console.log('⛓️ Blockchain Dashboard command executed!');
                tabManager.createOrFocusTab('dashboard', () => 
                    tabManager.createDashboardTab()
                );
            }),

            // Analytics Hub command  
            vscode.commands.registerCommand('mezzpro.analytics', () => {
                console.log('📊 Analytics Hub command executed!');
                tabManager.createOrFocusTab('analytics', () =>
                    tabManager.createAnalyticsTab()
                );
            }),

            // Node Network command
            vscode.commands.registerCommand('mezzpro.network', () => {
                console.log('🔗 Node Network command executed!');
                tabManager.createOrFocusTab('network', () =>
                    tabManager.createNetworkTab()
                );
            }),

            // Smart Contracts command
            vscode.commands.registerCommand('mezzpro.contracts', () => {
                console.log('⚡ Smart Contracts command executed!');
                tabManager.createOrFocusTab('contracts', () =>
                    tabManager.createContractsTab()
                );
            }),

            // AI Assistant command
            vscode.commands.registerCommand('mezzpro.chatbot', () => {
                console.log('💬 AI Assistant command executed!');
                tabManager.createOrFocusTab('chatbot', () =>
                    tabManager.createChatbotTab()
                );
            }),

            // Blockchain Workspace layout command
            vscode.commands.registerCommand('mezzpro.workspace', () => {
                console.log('⛓️ Blockchain Workspace layout command executed!');
                
                // Create all tabs in sequence
                tabManager.createOrFocusTab('dashboard', () => tabManager.createDashboardTab());
                setTimeout(() => {
                    tabManager.createOrFocusTab('analytics', () => tabManager.createAnalyticsTab());
                }, 500);
                setTimeout(() => {
                    tabManager.createOrFocusTab('network', () => tabManager.createNetworkTab());
                }, 1000);
                setTimeout(() => {
                    tabManager.createOrFocusTab('contracts', () => tabManager.createContractsTab());
                }, 1500);
            })
        ];

        context.subscriptions.push(...disposables, treeView);
        console.log('✅ All MezzPro commands and TreeView registered successfully!');

        // Auto-open blockchain dashboard
        console.log('✅ MezzPro workspace detected, auto-opening blockchain dashboard...');
        setTimeout(() => {
            console.log('🚀 Auto-executing blockchain dashboard command...');
            vscode.commands.executeCommand('mezzpro.dashboard');
        }, 1000);
        
        console.log('✅ MEZZPRO BLOCKCHAIN EXTENSION ACTIVATION COMPLETED!');

    } catch (error) {
        console.error('❌ MezzPro extension activation failed:', error);
        vscode.window.showErrorMessage(`MezzPro Blockchain Extension activation failed: ${error}`);
    }
}

async function configureBlockchainUI(): Promise<void> {
    console.log('🎨 Configuring VS Code UI for blockchain interface...');
    
    try {
        const config = vscode.workspace.getConfiguration();
        
        // Hide unnecessary VS Code UI elements for clean blockchain interface
        await config.update('workbench.activityBar.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.statusBar.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.panel.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.editor.showTabs', true, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.editor.tabCloseButton', 'off', vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.startupEditor', 'none', vscode.ConfigurationTarget.Workspace);
        
        // Hide outline, timeline, search
        await config.update('outline.showFiles', false, vscode.ConfigurationTarget.Workspace);
        await config.update('outline.showModules', false, vscode.ConfigurationTarget.Workspace);
        await config.update('timeline.excludeSources', ['git-history', 'timeline-source', 'extension-timeline'], vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.view.search.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('explorer.openEditors.visible', 0, vscode.ConfigurationTarget.Workspace);
        await config.update('terminal.integrated.showOnStartup', 'never', vscode.ConfigurationTarget.Workspace);
        
        // Explorer settings
        await config.update('explorer.compactFolders', false, vscode.ConfigurationTarget.Workspace);
        
        // Clean blockchain appearance settings
        await config.update('workbench.tree.indent', 8, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.list.smoothScrolling', true, vscode.ConfigurationTarget.Workspace);
        
        console.log('✅ VS Code UI configured for blockchain interface');
    } catch (error) {
        console.error('❌ Failed to configure VS Code UI:', error);
    }
}

async function configureStrictBlockchainUI(): Promise<void> {
    console.log('🔒 Applying strict blockchain UI configuration...');
    
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
        
        console.log('✅ Strict blockchain UI configuration applied');
    } catch (error) {
        console.error('❌ Failed to apply strict blockchain UI configuration:', error);
    }
}

export function deactivate() {
    console.log('⛓️ MezzPro Blockchain Extension deactivated');
}