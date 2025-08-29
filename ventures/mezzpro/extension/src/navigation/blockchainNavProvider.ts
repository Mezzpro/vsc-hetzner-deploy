import * as vscode from 'vscode';

export interface BlockchainNavigationItem {
    label: string;
    command: string;
    icon: string;
    description: string;
}

export class BlockchainItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly commandName: string,
        public readonly icon: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(label, collapsibleState);
        
        this.tooltip = description;
        this.command = {
            command: commandName,
            title: label,
            arguments: [this]
        };

        // Set icons for blockchain appearance
        this.iconPath = new vscode.ThemeIcon(icon);
    }
}

export class BlockchainNavigationProvider implements vscode.TreeDataProvider<BlockchainItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BlockchainItem | undefined | null | void> = new vscode.EventEmitter<BlockchainItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BlockchainItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private navigationItems: BlockchainNavigationItem[]) {}

    getTreeItem(element: BlockchainItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: BlockchainItem): Thenable<BlockchainItem[]> {
        if (!element) {
            // Root level - return blockchain navigation items
            return Promise.resolve(
                this.navigationItems.map(item => 
                    new BlockchainItem(item.label, item.command, item.icon, item.description)
                )
            );
        } else {
            // No nested items for clean interface
            return Promise.resolve([]);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    updateNavigationItems(items: BlockchainNavigationItem[]): void {
        this.navigationItems = items;
        this.refresh();
    }
}