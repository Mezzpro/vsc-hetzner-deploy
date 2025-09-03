import * as vscode from 'vscode';

// TreeView Data Provider for BizCradle Downloads
class BizcradleDownloadsProvider implements vscode.TreeDataProvider<DownloadItem> {
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
                new DownloadItem('Marketing Apps', '🚀', vscode.TreeItemCollapsibleState.Expanded, 'category'),
                new DownloadItem('Analytics Suite', '📊', vscode.TreeItemCollapsibleState.Expanded, 'category')
            ]);
        } else {
            // Items within categories
            if (element.label === 'Marketing Apps') {
                return Promise.resolve([
                    new DownloadItem('Windows App', '💻', vscode.TreeItemCollapsibleState.None, 'download', 'bizcradle-marketing-windows.exe'),
                    new DownloadItem('Mac App', '🍎', vscode.TreeItemCollapsibleState.None, 'download', 'bizcradle-marketing-mac.dmg'),
                    new DownloadItem('Linux App', '🐧', vscode.TreeItemCollapsibleState.None, 'download', 'bizcradle-marketing-linux.deb')
                ]);
            } else if (element.label === 'Analytics Suite') {
                return Promise.resolve([
                    new DownloadItem('Analytics Dashboard', '📈', vscode.TreeItemCollapsibleState.None, 'download', 'marketing-analytics.zip'),
                    new DownloadItem('ROI Calculator', '🧮', vscode.TreeItemCollapsibleState.None, 'download', 'roi-calculator.zip')
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
                command: 'bizcradle.downloadItem',
                title: 'Download',
                arguments: [fileName]
            };
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('=== BIZCRADLE EXTENSION DEBUG ===');
    console.log('Extension ID:', context.extension.id);
    console.log('Extension Path:', context.extensionPath);
    
    // Check if we're in BizCradle workspace FIRST
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const isBizcradleWorkspace = workspaceFolders?.some(folder => 
        folder.name === 'bizcradle' || folder.uri.path.includes('/bizcradle') || folder.uri.path.includes('\\bizcradle')
    );

    if (!isBizcradleWorkspace) {
        console.log('ℹ️ Not in BizCradle workspace, extension will remain dormant');
        return;
    }

    console.log('✅ BizCradle workspace detected, initializing extension...');
    console.log('Global State Keys:', context.globalState.keys());
    console.log('Workspace State Keys:', context.workspaceState.keys());
    
    try {
        // Create TreeView provider
        const downloadsProvider = new BizcradleDownloadsProvider();
        const treeView = vscode.window.createTreeView('bizcradleDownloadsView', {
            treeDataProvider: downloadsProvider,
            showCollapseAll: true
        });
        context.subscriptions.push(treeView);
        console.log('✅ TreeView registered successfully');

        // Register download commands
        const downloadCommand = vscode.commands.registerCommand('bizcradle.downloads', () => {
            console.log('📥 Bizcradle Downloads command triggered');
            showDownloadCenter(downloadsProvider);
        });

        const downloadItemCommand = vscode.commands.registerCommand('bizcradle.downloadItem', (fileName: string) => {
            console.log('📥 Download item triggered:', fileName);
            vscode.window.showInformationMessage(`📥 Downloading: ${fileName}`);
        });

        const toggleSelectionCommand = vscode.commands.registerCommand('bizcradle.toggleSelection', (item: DownloadItem) => {
            console.log('🔄 Toggle selection:', item.label);
            downloadsProvider.toggleSelection(item);
        });

        context.subscriptions.push(downloadCommand, downloadItemCommand, toggleSelectionCommand);
        console.log('✅ Commands registered successfully');

        // Auto-show download center after short delay
        setTimeout(() => {
            console.log('🚀 Auto-opening download center...');
            vscode.commands.executeCommand('bizcradle.downloads');
        }, 2000);
        
        console.log('✅ BIZCRADLE EXTENSION ACTIVATED SUCCESSFULLY');
    } catch (error) {
        console.error('❌ BIZCRADLE EXTENSION ACTIVATION FAILED:', error);
        vscode.window.showErrorMessage(`Bizcradle Extension Error: ${error}`);
    }
}

function showDownloadCenter(provider?: BizcradleDownloadsProvider) {
    console.log('📱 Creating download center panel...');
    
    const selectedItems = provider?.getSelectedItems() || [];
    const selectedItemsText = selectedItems.length > 0 ? `Selected: ${selectedItems.join(', ')}` : 'No items selected';
    
    const panel = vscode.window.createWebviewPanel(
        'bizcradle-downloads',
        '🚀 Bizcradle Downloads',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bizcradle Downloads</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #1e1e1e; 
            color: #ffffff;
        }
        h1 { color: #ffffff; text-align: center; }
        .download-item { 
            background: #2d2d30; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px; 
            border: 1px solid #3e3e42;
        }
        button { 
            background: #007acc; 
            color: #ffffff; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 3px; 
            cursor: pointer; 
            margin: 5px;
        }
        button:hover { background: #005a9e; }
        .secondary { background: #3c3c3c; border: 1px solid #565656; }
        .secondary:hover { background: #4a4a4a; }
    </style>
</head>
<body>
    <h1>🚀 Bizcradle Downloads</h1>
    <div class="selection-info" style="background: #2d2d30; padding: 10px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #3e3e42;">
        <p><strong>Selection Status:</strong> ${selectedItemsText}</p>
        <p><em>Use the sidebar TreeView to select/deselect items</em></p>
    </div>
    <div class="download-item">
        <h3>Marketing Apps</h3>
        <button onclick="download('bizcradle-marketing-windows.exe')">Windows App</button>
        <button onclick="download('bizcradle-marketing-mac.dmg')">Mac App</button>
        <button onclick="download('bizcradle-marketing-linux.deb')">Linux App</button>
    </div>
    <div class="download-item">
        <h3>Analytics Suite</h3>
        <button onclick="download('marketing-analytics.zip')">Analytics Dashboard</button>
        <button class="secondary" onclick="download('roi-calculator.zip')">ROI Calculator</button>
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
            vscode.window.showInformationMessage(`📥 Downloading: ${message.file}`);
            console.log('📥 Download requested:', message.file);
        }
    });

    console.log('✅ Download center created successfully');
}

export function deactivate() {
    console.log('🔄 BIZCRADLE EXTENSION DEACTIVATED');
}