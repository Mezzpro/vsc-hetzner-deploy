import * as vscode from 'vscode';
import { ThemeManager } from './core/themeManager';
import { MarketingTabManager } from './tabs/marketingTabManager';
import { MarketingNavProvider } from './navigation/marketingNavProvider';

export async function activate(context: vscode.ExtensionContext) {
    console.log('🚀 BIZCRADLE MARKETING PLATFORM EXTENSION ACTIVATION STARTED!');
    console.log('📍 Extension Context Path:', context.extensionPath);
    
    // Extension activating silently

    try {
        // Check if we're in Bizcradle workspace
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const isBizcradleWorkspace = workspaceFolders?.some(folder => 
            folder.uri.path.includes('workspace-bizcradle')
        );

        if (!isBizcradleWorkspace) {
            console.log('ℹ️ Not in Bizcradle workspace, extension will remain dormant');
            return;
        }

        console.log('✅ Bizcradle workspace detected, initializing marketing platform...');

        // Initialize core managers
        const themeManager = new ThemeManager();
        const tabManager = new MarketingTabManager(context);
        
        // Configure VS Code UI for clean marketing interface
        await configureMarketingUI();
        
        // Force strict UI hiding
        await configureStrictMarketingUI();
        
        // Create marketing navigation
        const marketingNavProvider = new MarketingNavProvider();
        
        console.log('🌳 Creating Bizcradle Marketing Navigation TreeView...');
        const treeView = vscode.window.createTreeView('bizcradle-marketing-nav', {
            treeDataProvider: marketingNavProvider,
            showCollapseAll: false,
            canSelectMany: false
        });
        
        console.log('✅ Marketing Navigation TreeView created, visible:', treeView.visible);

        // Register Bizcradle marketing commands
        const disposables = [
            // Marketing Dashboard command
            vscode.commands.registerCommand('bizcradle.dashboard', () => {
                console.log('📊 Marketing Dashboard command executed!');
                tabManager.openDashboard();
            }),

            // Campaign Manager command  
            vscode.commands.registerCommand('bizcradle.campaigns', () => {
                console.log('📢 Campaign Manager command executed!');
                tabManager.openCampaigns();
            }),

            // Content Studio command
            vscode.commands.registerCommand('bizcradle.content', () => {
                console.log('📝 Content Studio command executed!');
                tabManager.openContent();
            }),

            // Analytics Hub command
            vscode.commands.registerCommand('bizcradle.analytics', () => {
                console.log('📈 Analytics Hub command executed!');
                tabManager.openAnalytics();
            }),

            // Download Desktop command
            vscode.commands.registerCommand('bizcradle.download', () => {
                console.log('💻 Download Desktop command executed!');
                tabManager.openDownload();
            }),

            // Web Portal command
            vscode.commands.registerCommand('bizcradle.weblink', () => {
                console.log('🔗 Open Web Portal command executed!');
                tabManager.openWebPortal();
            })
        ];

        context.subscriptions.push(...disposables, treeView);
        console.log('✅ All Bizcradle commands and TreeView registered successfully!');

        // Auto-open marketing dashboard
        console.log('✅ Bizcradle workspace detected, auto-opening marketing dashboard...');
        setTimeout(() => {
            console.log('🚀 Auto-executing marketing dashboard command...');
            vscode.commands.executeCommand('bizcradle.dashboard');
        }, 1000);
        
        console.log('✅ BIZCRADLE MARKETING PLATFORM EXTENSION ACTIVATION COMPLETED!');

    } catch (error) {
        console.error('❌ Bizcradle extension activation failed:', error);
        vscode.window.showErrorMessage(`Bizcradle Marketing Platform activation failed: ${error}`);
    }
}

async function configureMarketingUI(): Promise<void> {
    console.log('🎨 Configuring VS Code UI for marketing platform...');
    
    try {
        const config = vscode.workspace.getConfiguration();
        
        // Hide unnecessary VS Code UI elements for clean marketing interface
        await config.update('workbench.activityBar.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.statusBar.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.panel.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.editor.showTabs', true, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.editor.tabCloseButton', 'right', vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.startupEditor', 'none', vscode.ConfigurationTarget.Workspace);
        
        // Hide outline, timeline, search
        await config.update('outline.showFiles', false, vscode.ConfigurationTarget.Workspace);
        await config.update('outline.showModules', false, vscode.ConfigurationTarget.Workspace);
        await config.update('timeline.excludeSources', ['git-history', 'timeline-source', 'extension-timeline'], vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.view.search.visible', false, vscode.ConfigurationTarget.Workspace);
        await config.update('explorer.openEditors.visible', 0, vscode.ConfigurationTarget.Workspace);
        await config.update('terminal.integrated.showOnStartup', 'never', vscode.ConfigurationTarget.Workspace);
        
        // Hide outline, timeline, and terminal panel for clean interface
        await config.update('outline.showFiles', false, vscode.ConfigurationTarget.Workspace);
        await config.update('outline.showModules', false, vscode.ConfigurationTarget.Workspace);
        await config.update('timeline.excludeSources', ['git-history', 'timeline-source'], vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.panel.defaultLocation', 'bottom', vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.panel.opensMaximized', 'never', vscode.ConfigurationTarget.Workspace);
        
        // Explorer and sidebar settings
        await config.update('explorer.compactFolders', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.sideBar.location', 'left', vscode.ConfigurationTarget.Workspace);
        
        // Clean professional appearance settings
        await config.update('workbench.tree.indent', 12, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.list.smoothScrolling', true, vscode.ConfigurationTarget.Workspace);
        await config.update('editor.minimap.enabled', false, vscode.ConfigurationTarget.Workspace);
        
        // Enable multi-column editor layout support
        await config.update('workbench.editor.enablePreview', false, vscode.ConfigurationTarget.Workspace);
        await config.update('workbench.editor.enablePreviewFromQuickOpen', false, vscode.ConfigurationTarget.Workspace);
        
        console.log('✅ VS Code UI configured for marketing platform');
    } catch (error) {
        console.error('❌ Failed to configure VS Code UI:', error);
    }
}

async function configureStrictMarketingUI(): Promise<void> {
    console.log('🔒 Applying strict marketing UI configuration...');
    
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
        
        console.log('✅ Strict marketing UI configuration applied');
    } catch (error) {
        console.error('❌ Failed to apply strict marketing UI configuration:', error);
    }
}

export function deactivate() {
    console.log('🚀 Bizcradle Marketing Platform Extension deactivated');
}