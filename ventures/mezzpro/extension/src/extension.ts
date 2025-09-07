import * as vscode from 'vscode';

// TreeView Data Provider for MezzPro Downloads
class MezzproDownloadsProvider implements vscode.TreeDataProvider<DownloadItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DownloadItem | undefined | null | void> = new vscode.EventEmitter<DownloadItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DownloadItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private selectedItems: Set<string> = new Set();

    getTreeItem(element: DownloadItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DownloadItem): Thenable<DownloadItem[]> {
        if (!element) {
            // Root categories
            return Promise.resolve([
                new DownloadItem('Blockchain Tools', '⛓️', vscode.TreeItemCollapsibleState.Expanded, 'category'),
                new DownloadItem('Smart Contracts', '📄', vscode.TreeItemCollapsibleState.Expanded, 'category')
            ]);
        } else {
            // Items within categories
            if (element.label === 'Blockchain Tools') {
                return Promise.resolve([
                    new DownloadItem('Windows Suite', '💻', vscode.TreeItemCollapsibleState.None, 'download', 'mezzpro-dev-suite-windows.exe'),
                    new DownloadItem('Mac Suite', '🍎', vscode.TreeItemCollapsibleState.None, 'download', 'mezzpro-dev-suite-mac.dmg'),
                    new DownloadItem('Linux Suite', '🐧', vscode.TreeItemCollapsibleState.None, 'download', 'mezzpro-dev-suite-linux.deb')
                ]);
            } else if (element.label === 'Smart Contracts') {
                return Promise.resolve([
                    new DownloadItem('Contract Compiler', '🔧', vscode.TreeItemCollapsibleState.None, 'download', 'contract-compiler.zip'),
                    new DownloadItem('Contract Templates', '📋', vscode.TreeItemCollapsibleState.None, 'download', 'contract-templates.zip')
                ]);
            }
        }
        return Promise.resolve([]);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    toggleSelection(item: DownloadItem) {
        if (item.fileName) {
            if (this.selectedItems.has(item.fileName)) {
                this.selectedItems.delete(item.fileName);
                item.contextValue = 'download';
            } else {
                this.selectedItems.add(item.fileName);
                item.contextValue = 'download-selected';
            }
            this.refresh();
        }
    }

    getSelectedItems(): string[] {
        return Array.from(this.selectedItems);
    }
}

class DownloadItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly icon: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public contextValue: string,
        public readonly fileName?: string
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}`;
        this.description = fileName ? '' : undefined;
        
        if (fileName) {
            this.command = {
                command: 'mezzpro.downloadItem',
                title: 'Download',
                arguments: [fileName]
            };
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('=== MEZZPRO EXTENSION DEBUG ===');
    console.log('Extension ID:', context.extension.id);
    console.log('Extension Path:', context.extensionPath);
    
    // Check if we're in MezzPro workspace FIRST
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const isMezzproWorkspace = workspaceFolders?.some(folder => 
        folder.name === 'mezzpro' || folder.uri.path.includes('/mezzpro') || folder.uri.path.includes('\\mezzpro')
    );

    if (!isMezzproWorkspace) {
        console.log('ℹ️ Not in MezzPro workspace, extension will remain dormant');
        return;
    }

    console.log('✅ MezzPro workspace detected, initializing extension...');
    console.log('Global State Keys:', context.globalState.keys());
    console.log('Workspace State Keys:', context.workspaceState.keys());
    
    try {
        // Create TreeView provider
        const downloadsProvider = new MezzproDownloadsProvider();
        const treeView = vscode.window.createTreeView('mezzproDownloadsView', {
            treeDataProvider: downloadsProvider,
            showCollapseAll: true
        });
        context.subscriptions.push(treeView);
        console.log('✅ TreeView registered successfully');

        // Register download commands
        const downloadCommand = vscode.commands.registerCommand('mezzpro.downloads', () => {
            console.log('📥 MezzPro Downloads command triggered');
            showDownloadCenter(downloadsProvider);
        });

        const downloadItemCommand = vscode.commands.registerCommand('mezzpro.downloadItem', (fileName: string) => {
            console.log('📥 Download item triggered:', fileName);
            vscode.window.showInformationMessage(`📥 Downloading: ${fileName}`);
        });

        const toggleSelectionCommand = vscode.commands.registerCommand('mezzpro.toggleSelection', (item: DownloadItem) => {
            console.log('🔄 Toggle selection:', item.label);
            downloadsProvider.toggleSelection(item);
        });

        // Theme selector status bar button for MezzPro
        const themeButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100 // High priority to appear on the right
        );
        
        // Get current theme for display
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme') || 'Default Dark Modern';
        const themeEmoji = currentTheme.toString().includes('Light') ? '☀️' : '🌙';
        
        themeButton.text = `$(color-mode) ${themeEmoji}`;
        themeButton.tooltip = 'Select MezzPro Theme';
        themeButton.command = 'mezzpro.selectTheme';
        themeButton.show();

        // Theme selection command with blockchain-focused themes
        const selectThemeCommand = vscode.commands.registerCommand('mezzpro.selectTheme', async () => {
            console.log('🎨 MezzPro theme selector triggered');
            
            const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            
            // Curated blockchain/tech-focused themes for MezzPro
            const themes = [
                { 
                    label: '🌙 Dark Modern', 
                    value: 'Default Dark Modern',
                    description: 'Professional dark theme (default)'
                },
                { 
                    label: '☀️ Light Modern', 
                    value: 'Default Light Modern',
                    description: 'Clean light theme for development'
                },
                { 
                    label: '🔵 Default Dark+', 
                    value: 'Default Dark+',
                    description: 'Blue-tinted dark theme'
                },
                { 
                    label: '💙 Default Light+', 
                    value: 'Default Light+',
                    description: 'Blue-tinted light theme'
                },
                { 
                    label: '🌌 Abyss', 
                    value: 'Abyss',
                    description: 'Deep space dark theme'
                },
                { 
                    label: '🎯 Monokai', 
                    value: 'Monokai',
                    description: 'Vibrant syntax highlighting'
                }
            ];
            
            // Mark current theme
            themes.forEach(theme => {
                if (theme.value === currentTheme) {
                    theme.label = `$(check) ${theme.label}`;
                }
            });
            
            const selected = await vscode.window.showQuickPick(themes, {
                placeHolder: 'Select theme for MezzPro workspace',
                matchOnDescription: true
            });
            
            if (selected && selected.value !== currentTheme) {
                try {
                    await vscode.workspace.getConfiguration('workbench').update(
                        'colorTheme', 
                        selected.value, 
                        vscode.ConfigurationTarget.Workspace
                    );
                    
                    // Update button display
                    const newEmoji = selected.value.includes('Light') ? '☀️' : '🌙';
                    themeButton.text = `$(color-mode) ${newEmoji}`;
                    
                    console.log(`✅ MezzPro theme changed to: ${selected.value}`);
                    vscode.window.showInformationMessage(`🎨 Theme changed to ${selected.label.replace('$(check) ', '')}`);
                } catch (error) {
                    console.error('❌ Failed to change MezzPro theme:', error);
                    vscode.window.showErrorMessage('Failed to change theme');
                }
            }
        });

        context.subscriptions.push(downloadCommand, downloadItemCommand, toggleSelectionCommand, selectThemeCommand, themeButton);
        console.log('✅ Commands and theme selector registered successfully');

        // Auto-show download center after short delay
        setTimeout(() => {
            console.log('🚀 Auto-opening download center...');
            vscode.commands.executeCommand('mezzpro.downloads');
        }, 2000);
        
        console.log('✅ MEZZPRO EXTENSION ACTIVATED SUCCESSFULLY');
    } catch (error) {
        console.error('❌ MEZZPRO EXTENSION ACTIVATION FAILED:', error);
        vscode.window.showErrorMessage(`MezzPro Extension Error: ${error}`);
    }
}

function showDownloadCenter(provider?: MezzproDownloadsProvider) {
    console.log('📱 Creating download center panel...');
    
    const selectedItems = provider?.getSelectedItems() || [];
    const selectedItemsText = selectedItems.length > 0 ? `Selected: ${selectedItems.join(', ')}` : 'No items selected';
    
    const panel = vscode.window.createWebviewPanel(
        'mezzpro-downloads',
        '⛓️ MezzPro Downloads',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MezzPro Downloads</title>
    <style>
        body { 
            font-family: var(--vscode-font-family); 
            padding: 20px; 
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        h1 { 
            color: var(--vscode-editor-foreground); 
            text-align: center; 
        }
        .download-item { 
            background: var(--vscode-panel-background); 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 4px; 
            border: 1px solid var(--vscode-panel-border);
        }
        button { 
            background: #8B5CF6 !important; 
            color: #ffffff !important; 
            border: 1px solid #8B5CF6; 
            padding: 8px 16px; 
            border-radius: 2px; 
            cursor: pointer; 
            margin: 5px;
            font-weight: bold;
            transition: background 0.2s ease;
        }
        button:hover { 
            background: #7c3aed !important; 
            border-color: #7c3aed;
        }
    </style>
</head>
<body>
    <h1>⛓️ MezzPro Downloads</h1>
    <div class="download-item">
        <h3>Blockchain Tools</h3>
        <button onclick="download('mezzpro-dev-suite-windows.exe')">Windows Suite</button>
        <button onclick="download('mezzpro-dev-suite-mac.dmg')">Mac Suite</button>
        <button onclick="download('mezzpro-dev-suite-linux.deb')">Linux Suite</button>
    </div>
    <div class="download-item">
        <h3>Smart Contracts</h3>
        <button onclick="download('contract-compiler.zip')">Contract Compiler</button>
        <button onclick="download('contract-templates.zip')">Contract Templates</button>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        function download(file) {
            console.log('Download requested:', file);
            vscode.postMessage({ command: 'download', file: file });
        }
    </script>
</body>
</html>`;

    panel.webview.onDidReceiveMessage(message => {
        if (message.command === 'download') {
            console.log('📥 Download requested:', message.file);
            // Redirect to MezzPro download page
            vscode.env.openExternal(vscode.Uri.parse('https://mezzpro.xyz/download'));
        }
    });

    console.log('✅ Download center created successfully');
}

export function deactivate() {
    console.log('🔄 MEZZPRO EXTENSION DEACTIVATED');
}