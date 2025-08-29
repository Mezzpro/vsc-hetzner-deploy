import * as vscode from 'vscode';

export interface VentureConfig {
    name: string;
    workspace: string;
    theme: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
    };
    tabs: string[];
    chatbot: {
        position: 'rightmost';
        toggleable: boolean;
        simulation: boolean;
    };
}

export interface VentureTab {
    getHTML(): string;
    handleMessage?(message: any): void;
}

export interface BusinessNavigationItem {
    label: string;
    command: string;
    icon: string;
    description: string;
}

export interface TabManager {
    createOrFocusTab(tabId: string, creator: () => vscode.WebviewPanel): void;
    createDashboardTab(): vscode.WebviewPanel;
    createAnalyticsTab(): vscode.WebviewPanel;
    createDownloadsTab(): vscode.WebviewPanel;
    createToolsTab(): vscode.WebviewPanel;
    createChatbotTab(): vscode.WebviewPanel;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

export interface ChatbotService {
    sendMessage(message: string): Promise<string>;
    getHistory(): ChatMessage[];
    clearHistory(): void;
}