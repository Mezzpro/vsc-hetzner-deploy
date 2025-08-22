import * as vscode from 'vscode';

export class BusinessItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly command: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(label, collapsibleState);
        
        this.tooltip = `Open ${label}`;
        this.command = {
            command: command,
            title: label,
            arguments: [this]
        };

        // Set icons based on the command
        switch (command) {
            case 'cradle.dashboard':
                this.iconPath = new vscode.ThemeIcon('dashboard');
                break;
            case 'cradle.analytics':
                this.iconPath = new vscode.ThemeIcon('graph');
                break;
            case 'cradle.downloads':
                this.iconPath = new vscode.ThemeIcon('cloud-download');
                break;
            case 'cradle.tools':
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
                new BusinessItem('📊 Business Dashboard', 'cradle.dashboard'),
                new BusinessItem('📈 Analytics Center', 'cradle.analytics'),
                new BusinessItem('📥 Download Center', 'cradle.downloads'),
                new BusinessItem('🔧 Business Tools', 'cradle.tools'),
                new BusinessItem('⚡ Quick Workspace', 'cradle.workspace')
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