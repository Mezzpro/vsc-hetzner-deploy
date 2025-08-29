import * as vscode from 'vscode';
import { VentureConfig } from '../shared/types/interfaces';

export class ConfigManager {
    private configs: Map<string, VentureConfig> = new Map();

    async getConfig(venture: string): Promise<VentureConfig> {
        if (!this.configs.has(venture)) {
            const config = await this.loadConfig(venture);
            this.configs.set(venture, config);
        }
        return this.configs.get(venture)!;
    }

    private async loadConfig(venture: string): Promise<VentureConfig> {
        try {
            const fs = require('fs');
            const path = require('path');
            
            // Get the extension path
            const extensionPath = __dirname.replace(/[\\/]out[\\/].*/, '');
            const configPath = path.join(extensionPath, 'src', 'ventures', venture, 'config.json');
            
            console.log(`📋 Loading config for ${venture} from:`, configPath);
            
            const configContent = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configContent);
            
            console.log(`✅ Config loaded for ${venture}:`, config.name);
            return config;
        } catch (error) {
            console.error(`❌ Failed to load config for ${venture}:`, error);
            throw error;
        }
    }

    async getAllVentures(): Promise<string[]> {
        try {
            const fs = require('fs');
            const path = require('path');
            
            const extensionPath = __dirname.replace(/[\\/]out[\\/].*/, '');
            const venturesDir = path.join(extensionPath, 'src', 'ventures');
            
            const ventures = fs.readdirSync(venturesDir, { withFileTypes: true })
                .filter((dirent: any) => dirent.isDirectory())
                .map((dirent: any) => dirent.name);
            
            console.log('📁 Available ventures:', ventures);
            return ventures;
        } catch (error) {
            console.error('❌ Failed to get ventures list:', error);
            return ['cradle']; // fallback
        }
    }

    clearCache(): void {
        this.configs.clear();
        console.log('🗑️ Config cache cleared');
    }
}