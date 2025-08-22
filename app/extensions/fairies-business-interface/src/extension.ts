import * as vscode from 'vscode';
import { BusinessNavigationProvider, BusinessItem } from './businessNavigationProvider';
import { TabManager } from './tabManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 FAIRIES BUSINESS INTERFACE EXTENSION ACTIVATION STARTED!');
    console.log('📍 Extension Context Path:', context.extensionPath);
    console.log('📦 Extension URI:', context.extensionUri.toString());
    
    // Show activation notification
    vscode.window.showInformationMessage('🧚‍♀️ Fairies Business Interface Activated!');

    // Log package.json content for debugging
    const fs = require('fs');
    const path = require('path');
    const packagePath = path.join(context.extensionPath, 'package.json');
    try {
        const packageContent = fs.readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(packageContent);
        console.log('📋 Package.json activationEvents:', packageJson.activationEvents);
        console.log('📋 Package.json publisher:', packageJson.publisher);
        console.log('📋 Package.json version:', packageJson.version);
    } catch (error) {
        console.error('❌ Failed to read package.json:', error);
    }

    // Initialize managers
    const tabManager = new TabManager(context);
    
    // Register TreeView for business navigation
    const businessNavigationProvider = new BusinessNavigationProvider();
    console.log('🌳 Creating TreeView: fairies-business-nav');
    
    const treeView = vscode.window.createTreeView('fairies-business-nav', {
        treeDataProvider: businessNavigationProvider,
        showCollapseAll: false,
        canSelectMany: false
    });
    
    console.log('🌳 TreeView created successfully, visible:', treeView.visible);

    // Register commands for different business tabs
    const disposables = [
        // Dashboard command
        vscode.commands.registerCommand('fairies.dashboard', () => {
            console.log('🎯 Dashboard command executed!');
            vscode.window.showInformationMessage('Opening Business Dashboard...');
            tabManager.createOrFocusTab('dashboard', () => 
                tabManager.createDashboardTab()
            );
        }),

        // Analytics command  
        vscode.commands.registerCommand('fairies.analytics', () => {
            console.log('📊 Analytics command executed!');
            vscode.window.showInformationMessage('Opening Analytics Center...');
            tabManager.createOrFocusTab('analytics', () =>
                tabManager.createAnalyticsTab()
            );
        }),

        // Downloads command
        vscode.commands.registerCommand('fairies.downloads', () => {
            console.log('📥 Downloads command executed!');
            vscode.window.showInformationMessage('Opening Download Center...');
            tabManager.createOrFocusTab('downloads', () =>
                tabManager.createDownloadCenterTab()
            );
        }),

        // Tools command
        vscode.commands.registerCommand('fairies.tools', () => {
            console.log('🔧 Tools command executed!');
            vscode.window.showInformationMessage('Opening Business Tools...');
            tabManager.createOrFocusTab('tools', () =>
                tabManager.createToolsTab()
            );
        }),

        // Workspace layout command
        vscode.commands.registerCommand('fairies.workspace', () => {
            console.log('🏢 Workspace layout command executed!');
            vscode.window.showInformationMessage('Creating Business Workspace...');
            tabManager.createBusinessWorkspace();
        })
    ];

    context.subscriptions.push(...disposables);
    console.log('✅ All commands registered successfully!');

    // Auto-create dashboard on activation
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
            vscode.window.showInformationMessage('Admin workspace detected! Opening fairies dashboard...');
            
            setTimeout(() => {
                console.log('🚀 Auto-executing dashboard command...');
                vscode.commands.executeCommand('fairies.dashboard');
            }, 3000);
        } else {
            console.log('❌ Non-admin workspace detected');
            vscode.window.showInformationMessage('Extension loaded - Use Command Palette for fairies commands');
        }
    } else {
        console.log('❌ No workspace folders found');
        vscode.window.showInformationMessage('Fairies Interface loaded - No workspace folders');
    }
    
    console.log('✅ FAIRIES BUSINESS INTERFACE EXTENSION ACTIVATION COMPLETED!');
}

export function deactivate() {
    console.log('🧚‍♀️ Fairies Business Interface extension deactivated');
}