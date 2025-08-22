import * as vscode from 'vscode';
import { BusinessNavigationProvider, BusinessItem } from './businessNavigationProvider';
import { TabManager } from './tabManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('Cradle Business Suite extension is now active!');

    // Initialize managers
    const tabManager = new TabManager(context);
    
    // Register TreeView for business navigation
    const businessNavigationProvider = new BusinessNavigationProvider();
    vscode.window.createTreeView('cradle-business-nav', {
        treeDataProvider: businessNavigationProvider,
        showCollapseAll: false,
        canSelectMany: false
    });

    // Register commands for different business tabs
    const disposables = [
        // Dashboard command
        vscode.commands.registerCommand('cradle.dashboard', () => {
            tabManager.createOrFocusTab('dashboard', () => 
                tabManager.createDashboardTab()
            );
        }),

        // Analytics command  
        vscode.commands.registerCommand('cradle.analytics', () => {
            tabManager.createOrFocusTab('analytics', () =>
                tabManager.createAnalyticsTab()
            );
        }),

        // Downloads command
        vscode.commands.registerCommand('cradle.downloads', () => {
            tabManager.createOrFocusTab('downloads', () =>
                tabManager.createDownloadCenterTab()
            );
        }),

        // Tools command
        vscode.commands.registerCommand('cradle.tools', () => {
            tabManager.createOrFocusTab('tools', () =>
                tabManager.createToolsTab()
            );
        }),

        // Workspace layout command
        vscode.commands.registerCommand('cradle.workspace', () => {
            tabManager.createBusinessWorkspace();
        })
    ];

    context.subscriptions.push(...disposables);

    // Auto-create dashboard on activation if in Cradle workspace
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.some(folder => 
        folder.name.includes('workspace-admin') || folder.uri.path.includes('workspace-admin')
    )) {
        // Delay to ensure VS Code is fully loaded
        setTimeout(() => {
            vscode.commands.executeCommand('cradle.dashboard');
        }, 1000);
    }
}

export function deactivate() {
    console.log('Cradle Business Suite extension is now deactivated');
}