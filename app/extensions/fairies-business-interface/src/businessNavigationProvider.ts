import * as vscode from 'vscode';

export class BusinessItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly commandName: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(label, collapsibleState);
        
        this.tooltip = `Open ${label}`;
        this.command = {
            command: commandName,
            title: label,
            arguments: [this]
        };

        // Set icons based on the command
        switch (commandName) {
            case 'fairies.dashboard':
                this.iconPath = new vscode.ThemeIcon('dashboard');
                break;
            case 'fairies.analytics':
                this.iconPath = new vscode.ThemeIcon('graph');
                break;
            case 'fairies.downloads':
                this.iconPath = new vscode.ThemeIcon('cloud-download');
                break;
            case 'fairies.tools':
                this.iconPath = new vscode.ThemeIcon('tools');
                break;
            default:
                this.iconPath = new vscode.ThemeIcon('circle-filled');
        }
    }
}

export class BusinessNavigationProvider implements vscode.TreeDataProvider<BusinessItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BusinessItem | undefined | null | void> = new vscode.EventEmitter<BusinessItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BusinessItem | undefined | null | void> = this._onDidChangeTreeData.event;

    getTreeItem(element: BusinessItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: BusinessItem): Thenable<BusinessItem[]> {
        if (!element) {
            // Root level - return main business sections
            return Promise.resolve([
                new BusinessItem('🧚‍♀️ Business Dashboard', 'fairies.dashboard'),
                new BusinessItem('📈 Analytics Center', 'fairies.analytics'),
                new BusinessItem('📥 Download Center', 'fairies.downloads'),
                new BusinessItem('🔧 Business Tools', 'fairies.tools'),
                new BusinessItem('⚡ Quick Workspace', 'fairies.workspace')
            ]);
        } else {
            // No nested items for now
            return Promise.resolve([]);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}