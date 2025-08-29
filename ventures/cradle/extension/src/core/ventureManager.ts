import * as vscode from 'vscode';
import { VentureConfig } from '../shared/types/interfaces';

export class VentureManager {
    private currentVenture: string = 'cradle';
    private config: VentureConfig | null = null;

    constructor() {
        this.detectCurrentVenture();
    }

    public getCurrentVenture(): string {
        return this.currentVenture;
    }

    public async getConfig(): Promise<VentureConfig> {
        if (!this.config) {
            await this.loadConfig();
        }
        return this.config!;
    }

    private detectCurrentVenture(): void {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const workspacePath = workspaceFolders[0].uri.path;
            
            console.log('🔍 Detecting venture from workspace:', workspacePath);
            
            // Map workspace paths to ventures
            if (workspacePath.includes('cradle')) {
                this.currentVenture = 'cradle';
            } else if (workspacePath.includes('mezzpro')) {
                this.currentVenture = 'mezzpro';
            } else if (workspacePath.includes('minqro')) {
                this.currentVenture = 'minqro';
            } else if (workspacePath.includes('bizcradle')) {
                this.currentVenture = 'bizcradle';
            } else {
                this.currentVenture = 'cradle'; // default
            }
        } else {
            this.currentVenture = 'cradle'; // default
        }
        
        console.log('✅ Current venture detected:', this.currentVenture);
    }

    private async loadConfig(): Promise<void> {
        try {
            const fs = require('fs');
            const path = require('path');
            
            // Get the extension path
            const extensionPath = __dirname.replace(/[\\/]out[\\/].*/, '');
            const configPath = path.join(extensionPath, 'src', 'ventures', this.currentVenture, 'config.json');
            
            console.log('📋 Loading config from:', configPath);
            
            const configContent = fs.readFileSync(configPath, 'utf8');
            this.config = JSON.parse(configContent);
            
            console.log('✅ Config loaded for venture:', this.currentVenture);
        } catch (error) {
            console.error('❌ Failed to load config:', error);
            // Fallback to default config
            this.config = {
                name: 'Cradle Systems',
                workspace: 'cradle',
                theme: {
                    primary: '#000000',
                    secondary: '#495057',
                    background: '#FFFFFF',
                    text: '#000000',
                    accent: '#E9ECEF'
                },
                tabs: ['dashboard', 'analytics', 'downloads', 'tools', 'chatbot'],
                chatbot: {
                    position: 'rightmost',
                    toggleable: true,
                    simulation: true
                }
            };
        }
    }

    public async loadVentureModule(tabName: string): Promise<any> {
        try {
            const modulePath = `../ventures/${this.currentVenture}/tabs/${tabName}`;
            console.log('📦 Loading venture module:', modulePath);
            return await import(modulePath);
        } catch (error) {
            console.error(`❌ Failed to load module ${tabName} for venture ${this.currentVenture}:`, error);
            throw error;
        }
    }
}