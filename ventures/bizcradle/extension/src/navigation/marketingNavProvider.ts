import * as vscode from 'vscode';

export interface MarketingNavItem {
    label: string;
    command: string;
    icon: string;
    description: string;
}

export class MarketingNavProvider implements vscode.TreeDataProvider<MarketingNavItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<MarketingNavItem | undefined | null | void> = new vscode.EventEmitter<MarketingNavItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<MarketingNavItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private navigationItems: MarketingNavItem[] = [
        {
            label: "📊 Marketing Dashboard",
            command: "bizcradle.dashboard",
            icon: "dashboard",
            description: "Overview of marketing metrics and KPIs"
        },
        {
            label: "📢 Campaign Manager",
            command: "bizcradle.campaigns",
            icon: "megaphone",
            description: "Create and manage marketing campaigns"
        },
        {
            label: "📝 Content Studio",
            command: "bizcradle.content",
            icon: "edit",
            description: "Content creation and automation tools"
        },
        {
            label: "📈 Analytics Hub",
            command: "bizcradle.analytics",
            icon: "graph",
            description: "Performance analytics and insights"
        },
        {
            label: "💻 Download Desktop",
            command: "bizcradle.download",
            icon: "desktop-download",
            description: "Download Bizcradle desktop application"
        },
        {
            label: "🔗 Open Web Portal",
            command: "bizcradle.weblink",
            icon: "link-external",
            description: "Open platform in new browser window"
        }
    ];

    constructor() {
        console.log('🌳 Marketing Navigation Provider initialized');
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: MarketingNavItem): vscode.TreeItem {
        const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
        
        item.command = {
            command: element.command,
            title: element.label,
            arguments: []
        };
        
        item.tooltip = element.description;
        item.contextValue = 'marketingNavItem';
        
        // Use built-in VS Code icons
        item.iconPath = new vscode.ThemeIcon(element.icon);
        
        return item;
    }

    getChildren(element?: MarketingNavItem): Thenable<MarketingNavItem[]> {
        if (!element) {
            // Return root items
            return Promise.resolve(this.navigationItems);
        }
        
        // No children for leaf items
        return Promise.resolve([]);
    }

    getParent(element: MarketingNavItem): vscode.ProviderResult<MarketingNavItem> {
        // All items are at root level
        return null;
    }
}