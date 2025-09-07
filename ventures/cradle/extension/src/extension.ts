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

        // Theme selector status bar button for CradleSystems  
        const themeButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100 // High priority to appear on the right
        );
        
        // Get current theme for display
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme') || 'Default Dark Modern';
        const themeEmoji = currentTheme.toString().includes('Light') ? '☀️' : '🌙';
        
        themeButton.text = `$(color-mode) ${themeEmoji}`;
        themeButton.tooltip = 'Select CradleSystems Theme';
        themeButton.command = 'cradle.selectTheme';
        themeButton.show();

        // Theme selection command with comprehensive developer themes
        const selectThemeCommand = vscode.commands.registerCommand('cradle.selectTheme', async () => {
            console.log('🎨 CradleSystems theme selector triggered');
            
            const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            
            // Comprehensive developer-focused themes for CradleSystems
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
                    label: '🔴 Red', 
                    value: 'Red',
                    description: 'Dark theme with red accents'
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
                    label: '🌅 Solarized Light', 
                    value: 'Solarized Light',
                    description: 'Warm tones light theme'
                },
                { 
                    label: '🌊 Solarized Dark', 
                    value: 'Solarized Dark',
                    description: 'Warm tones dark theme'
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
                placeHolder: 'Select theme for CradleSystems workspace',
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
                    
                    console.log(`✅ CradleSystems theme changed to: ${selected.value}`);
                    vscode.window.showInformationMessage(`🎨 Theme changed to ${selected.label.replace('$(check) ', '')}`);
                } catch (error) {
                    console.error('❌ Failed to change CradleSystems theme:', error);
                    vscode.window.showErrorMessage('Failed to change theme');
                }
            }
        });

        context.subscriptions.push(downloadCommand, downloadItemCommand, toggleSelectionCommand, selectThemeCommand, themeButton);
        console.log('✅ Commands and theme selector registered successfully');

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
            background: var(--vscode-button-background); 
            color: var(--vscode-button-foreground); 
            border: 1px solid var(--vscode-button-background); 
            padding: 10px 20px; 
            border-radius: 2px; 
            cursor: pointer; 
            margin: 8px;
            font-weight: bold;
            font-size: 14px;
            transition: background 0.2s ease;
        }
        button:hover { 
            background: var(--vscode-button-hoverBackground); 
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
            // Redirect to simple download page
            vscode.env.openExternal(vscode.Uri.parse('https://cradlesystems.xyz/download'));
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