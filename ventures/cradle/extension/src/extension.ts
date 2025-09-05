import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as http from 'http';

// TreeView Data Provider for Cradle Downloads
class CradleDownloadsProvider implements vscode.TreeDataProvider<DownloadItem> {
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
                new DownloadItem('Desktop Applications', '🖥️', vscode.TreeItemCollapsibleState.Expanded, 'category'),
                new DownloadItem('Business Tools', '🛠️', vscode.TreeItemCollapsibleState.Expanded, 'category')
            ]);
        } else {
            // Items within categories
            if (element.label === 'Desktop Applications') {
                return Promise.resolve([
                    new DownloadItem('Windows App', '💻', vscode.TreeItemCollapsibleState.None, 'download', 'CradleSystemsInstaller-v1.0.0.exe'),
                    new DownloadItem('Mac App', '🍎', vscode.TreeItemCollapsibleState.None, 'download', 'cradle-mac.dmg'),
                    new DownloadItem('Linux App', '🐧', vscode.TreeItemCollapsibleState.None, 'download', 'cradle-linux.deb')
                ]);
            } else if (element.label === 'Business Tools') {
                return Promise.resolve([
                    new DownloadItem('Business Suite', '📊', vscode.TreeItemCollapsibleState.None, 'download', 'business-suite.zip'),
                    new DownloadItem('Reports Package', '📋', vscode.TreeItemCollapsibleState.None, 'download', 'reports.zip')
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
                command: 'cradle.downloadItem',
                title: 'Download',
                arguments: [fileName]
            };
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('=== CRADLE EXTENSION DEBUG ===');
    console.log('Extension ID:', context.extension.id);
    console.log('Extension Path:', context.extensionPath);
    
    // Check if we're in Cradle workspace FIRST
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const isCradleWorkspace = workspaceFolders?.some(folder => 
        folder.name === 'cradle' || folder.uri.path.includes('/cradle') || folder.uri.path.includes('\\cradle')
    );

    if (!isCradleWorkspace) {
        console.log('ℹ️ Not in Cradle workspace, extension will remain dormant');
        return;
    }

    console.log('✅ Cradle workspace detected, initializing extension...');
    console.log('Global State Keys:', context.globalState.keys());
    console.log('Workspace State Keys:', context.workspaceState.keys());
    
    try {
        // Create TreeView provider
        const downloadsProvider = new CradleDownloadsProvider();
        const treeView = vscode.window.createTreeView('cradleDownloadsView', {
            treeDataProvider: downloadsProvider,
            showCollapseAll: true
        });
        context.subscriptions.push(treeView);
        console.log('✅ TreeView registered successfully');
        // Register download commands
        const downloadCommand = vscode.commands.registerCommand('cradle.downloads', () => {
            console.log('📥 Cradle Downloads command triggered');
            showDownloadCenter(downloadsProvider);
        });

        const downloadItemCommand = vscode.commands.registerCommand('cradle.downloadItem', (fileName: string) => {
            console.log('📥 Download item triggered:', fileName);
            vscode.window.showInformationMessage(`📥 Downloading: ${fileName}`);
        });

        const toggleSelectionCommand = vscode.commands.registerCommand('cradle.toggleSelection', (item: DownloadItem) => {
            console.log('🔄 Toggle selection:', item.label);
            downloadsProvider.toggleSelection(item);
        });

        context.subscriptions.push(downloadCommand, downloadItemCommand, toggleSelectionCommand);
        console.log('✅ Commands registered successfully');

        // Auto-show download center after short delay
        setTimeout(() => {
            console.log('🚀 Auto-opening download center...');
            vscode.commands.executeCommand('cradle.downloads');
        }, 2000);
        
        console.log('✅ CRADLE EXTENSION ACTIVATED SUCCESSFULLY');
    } catch (error) {
        console.error('❌ CRADLE EXTENSION ACTIVATION FAILED:', error);
        vscode.window.showErrorMessage(`Cradle Extension Error: ${error}`);
    }
}

function showDownloadCenter(provider?: CradleDownloadsProvider) {
    console.log('📱 Creating download center panel...');
    
    const selectedItems = provider?.getSelectedItems() || [];
    const selectedItemsText = selectedItems.length > 0 ? `Selected: ${selectedItems.join(', ')}` : 'No items selected';
    
    const panel = vscode.window.createWebviewPanel(
        'cradle-downloads',
        '📥 CradleSystem Downloads',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CradleSystem Downloads</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        h1 { color: #333; text-align: center; }
        .download-item { 
            background: white; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        button { 
            background: #000000; 
            color: #FFFFFF; 
            border: 2px solid #000000; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 8px;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        button:hover { 
            background: #FFFFFF; 
            color: #000000; 
            border: 2px solid #000000;
        }
    </style>
</head>
<body>
    <h1>🏢 CradleSystem Downloads</h1>
    <div class="download-item">
        <h3>Desktop Applications</h3>
        <button onclick="download('CradleSystemsInstaller-v1.0.0.exe')">Windows App</button>
        <button onclick="download('cradle-mac.dmg')">Mac App</button>
        <button onclick="download('cradle-linux.deb')">Linux App</button>
    </div>
    <div class="download-item">
        <h3>Business Tools</h3>
        <button onclick="download('business-suite.zip')">Business Suite</button>
        <button onclick="download('reports.zip')">Reports Package</button>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        
        function download(file) {
            console.log('Download requested:', file);
            vscode.postMessage({ command: 'download', file: file });
        }
        
        // No webview download handling needed - handled by extension host
    </script>
</body>
</html>`;

    panel.webview.onDidReceiveMessage(message => {
        if (message.command === 'download') {
            console.log('📥 Download requested:', message.file);
            downloadFile(message.file);
        }
    });

    console.log('✅ Download center created successfully');
}

function downloadFile(filename: string) {
    console.log(`🔽 Starting download: ${filename}`);
    vscode.window.showInformationMessage(`📥 Downloading ${filename}...`);
    
    // Get user's Downloads folder
    const downloadsPath = path.join(os.homedir(), 'Downloads', filename);
    
    // Create download URL (internal container network)
    const downloadUrl = `http://vsc-system-cradle:3001/downloads/${filename}`;
    
    // Create file write stream
    const fileStream = fs.createWriteStream(downloadsPath);
    
    // Download file
    http.get(downloadUrl, (response) => {
        if (response.statusCode === 200) {
            response.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✅ Download completed: ${downloadsPath}`);
                vscode.window.showInformationMessage(`✅ ${filename} downloaded to Downloads folder!`);
            });
            
            fileStream.on('error', (err) => {
                console.error(`❌ Download error: ${err.message}`);
                vscode.window.showErrorMessage(`❌ Download failed: ${err.message}`);
            });
        } else {
            console.error(`❌ Download failed: HTTP ${response.statusCode}`);
            vscode.window.showErrorMessage(`❌ Download failed: Server returned ${response.statusCode}`);
        }
    }).on('error', (err) => {
        console.error(`❌ Download request failed: ${err.message}`);
        vscode.window.showErrorMessage(`❌ Download failed: ${err.message}`);
    });
}

export function deactivate() {
    console.log('🔄 CRADLE EXTENSION DEACTIVATED');
}