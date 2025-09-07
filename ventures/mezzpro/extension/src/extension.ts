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

        context.subscriptions.push(downloadCommand, downloadItemCommand, toggleSelectionCommand);
        console.log('✅ Commands registered successfully');

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
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f8f9fa; 
            color: #333;
        }
        h1 { color: #8B5CF6; text-align: center; }
        .download-item { 
            background: white; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px; 
            border: 1px solid #E5E7EB;
            box-shadow: 0 2px 4px rgba(139, 92, 246, 0.1);
        }
        button { 
            background: #8B5CF6; 
            color: #ffffff; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 3px; 
            cursor: pointer; 
            margin: 5px;
            font-weight: bold;
        }
        button:hover { background: #7c3aed; }
        .desktop-download { 
            background: #8B5CF6; 
            font-size: 16px; 
            font-weight: bold; 
            padding: 12px 24px; 
            margin: 20px auto; 
            display: block; 
            width: fit-content;
        }
        .desktop-download:hover { background: #7c3aed; }
    </style>
</head>
<body>
    <h1>⛓️ MezzPro Downloads</h1>
    <button class="desktop-download" onclick="downloadDesktop()">💻 Download Desktop Version</button>
    <div class="selection-info" style="background: #f5f3ff; padding: 10px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #e9d5ff;">
        <p><strong>Selection Status:</strong> ${selectedItemsText}</p>
        <p><em>Use the sidebar TreeView to select/deselect items</em></p>
    </div>
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
        function downloadDesktop() {
            console.log('Desktop version download requested');
            vscode.postMessage({ command: 'downloadDesktop' });
        }
    </script>
</body>
</html>`;

    panel.webview.onDidReceiveMessage(message => {
        if (message.command === 'download') {
            vscode.window.showInformationMessage(`📥 Downloading: ${message.file}`);
            console.log('📥 Download requested:', message.file);
        } else if (message.command === 'downloadDesktop') {
            console.log('🖥️ Desktop download requested, opening download page');
            vscode.env.openExternal(vscode.Uri.parse('https://vscode.coder.ventures/download-mezzpro'));
        }
    });

    console.log('✅ Download center created successfully');
}

export function deactivate() {
    console.log('🔄 MEZZPRO EXTENSION DEACTIVATED');
}