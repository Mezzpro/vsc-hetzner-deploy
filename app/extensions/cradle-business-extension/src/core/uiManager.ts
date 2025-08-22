import * as vscode from 'vscode';

export class UIManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async hideVSCodeUI(): Promise<void> {
        console.log('🎨 Configuring VS Code UI for business interface...');
        
        try {
            const config = vscode.workspace.getConfiguration();
            
            // Hide unnecessary VS Code UI elements
            await config.update('workbench.activityBar.visible', false, vscode.ConfigurationTarget.Workspace);
            await config.update('workbench.statusBar.visible', false, vscode.ConfigurationTarget.Workspace);
            await config.update('workbench.editor.showTabs', true, vscode.ConfigurationTarget.Workspace);
            await config.update('workbench.editor.tabCloseButton', 'off', vscode.ConfigurationTarget.Workspace);
            await config.update('workbench.startupEditor', 'none', vscode.ConfigurationTarget.Workspace);
            
            // Explorer settings to hide unnecessary sections
            await config.update('explorer.compactFolders', false, vscode.ConfigurationTarget.Workspace);
            await config.update('timeline.excludeSources', ['git-history'], vscode.ConfigurationTarget.Workspace);
            
            // Clean appearance settings
            await config.update('workbench.tree.indent', 8, vscode.ConfigurationTarget.Workspace);
            await config.update('workbench.list.smoothScrolling', true, vscode.ConfigurationTarget.Workspace);
            
            console.log('✅ VS Code UI configured for business interface');
        } catch (error) {
            console.error('❌ Failed to configure VS Code UI:', error);
        }
    }

    async showBusinessInterface(): Promise<void> {
        console.log('🏢 Showing business interface...');
        
        try {
            // Ensure explorer is visible for business navigation
            await vscode.commands.executeCommand('workbench.view.explorer');
            
            // Focus on the explorer to show business navigation
            setTimeout(() => {
                vscode.commands.executeCommand('workbench.explorer.fileView.focus');
            }, 500);
            
            console.log('✅ Business interface shown');
        } catch (error) {
            console.error('❌ Failed to show business interface:', error);
        }
    }

    async restoreVSCodeUI(): Promise<void> {
        console.log('🔄 Restoring default VS Code UI...');
        
        try {
            const config = vscode.workspace.getConfiguration();
            
            // Restore default VS Code UI
            await config.update('workbench.activityBar.visible', true, vscode.ConfigurationTarget.Workspace);
            await config.update('workbench.statusBar.visible', true, vscode.ConfigurationTarget.Workspace);
            await config.update('workbench.editor.tabCloseButton', 'right', vscode.ConfigurationTarget.Workspace);
            
            console.log('✅ VS Code UI restored to defaults');
        } catch (error) {
            console.error('❌ Failed to restore VS Code UI:', error);
        }
    }

    getBusinessSettings(): any {
        return {
            'workbench.colorTheme': 'Default Light+',
            'workbench.iconTheme': 'vs-minimal',
            'editor.fontFamily': 'Consolas, "Courier New", monospace',
            'editor.fontSize': 14,
            'editor.lineHeight': 22,
            'editor.minimap.enabled': false,
            'editor.scrollBeyondLastLine': false,
            'workbench.editor.enablePreview': false,
            'workbench.tree.renderIndentGuides': 'always'
        };
    }
}