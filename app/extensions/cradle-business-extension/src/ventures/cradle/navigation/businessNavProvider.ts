import * as vscode from 'vscode';
import { BusinessNavigationItem } from '../../../shared/types/interfaces';

export class BusinessItem extends vscode.TreeItem {
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

        // Set icons for clean business appearance
        this.iconPath = new vscode.ThemeIcon(icon);
    }
}

export class BusinessNavigationProvider implements vscode.TreeDataProvider<BusinessItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BusinessItem | undefined | null | void> = new vscode.EventEmitter<BusinessItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BusinessItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private navigationItems: BusinessNavigationItem[]) {}

    getTreeItem(element: BusinessItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: BusinessItem): Thenable<BusinessItem[]> {
        if (!element) {
            // Root level - return business navigation items
            return Promise.resolve(
                this.navigationItems.map(item => 
                    new BusinessItem(item.label, item.command, item.icon, item.description)
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

    updateNavigationItems(items: BusinessNavigationItem[]): void {
        this.navigationItems = items;
        this.refresh();
    }
}