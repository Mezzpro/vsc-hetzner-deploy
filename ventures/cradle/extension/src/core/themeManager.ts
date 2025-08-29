import { VentureConfig } from '../shared/types/interfaces';

export class ThemeManager {
    private currentTheme: VentureConfig['theme'] | null = null;

    setTheme(theme: VentureConfig['theme']): void {
        this.currentTheme = theme;
        console.log('🎨 Theme set:', theme);
    }

    getCurrentTheme(): VentureConfig['theme'] {
        return this.currentTheme || {
            primary: '#000000',
            secondary: '#495057', 
            background: '#FFFFFF',
            text: '#000000',
            accent: '#E9ECEF'
        };
    }

    getCleanThemeCSS(): string {
        const theme = this.getCurrentTheme();
        
        return `
            :root {
                --cradle-primary: ${theme.primary};
                --cradle-secondary: ${theme.secondary};
                --cradle-background: ${theme.background};
                --cradle-text: ${theme.text};
                --cradle-accent: ${theme.accent};
                --cradle-shadow: rgba(0, 0, 0, 0.1);
                --cradle-border: rgba(0, 0, 0, 0.1);
                --cradle-hover: rgba(0, 0, 0, 0.05);
                
                /* MezzPro Blockchain Theme Variables */
                --mezzpro-primary: ${theme.primary === '#00ff41' ? theme.primary : '#00ff41'};
                --mezzpro-secondary: ${theme.secondary === '#006600' ? theme.secondary : '#006600'};
                --mezzpro-background: ${theme.background === '#000000' ? theme.background : '#000000'};
                --mezzpro-text: ${theme.text === '#00ff41' ? theme.text : '#00ff41'};
                --mezzpro-accent: ${theme.accent === '#003300' ? theme.accent : '#003300'};
                --mezzpro-glow: 0 0 10px var(--mezzpro-primary);
                --mezzpro-border: rgba(0, 255, 65, 0.3);
                --mezzpro-hover: rgba(0, 255, 65, 0.1);
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', system-ui, sans-serif;
                margin: 0;
                padding: 0;
                background: var(--cradle-background);
                color: var(--cradle-text);
                line-height: 1.5;
                overflow-x: hidden;
            }

            /* Clean Card Styles */
            .card {
                background: var(--cradle-background);
                border: 1px solid var(--cradle-border);
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 2px 8px var(--cradle-shadow);
                transition: all 0.2s ease;
                margin-bottom: 16px;
            }

            .card:hover {
                box-shadow: 0 4px 16px var(--cradle-shadow);
                transform: translateY(-2px);
            }

            /* Clean Button Styles */
            .btn-primary {
                background: var(--cradle-primary);
                color: var(--cradle-background);
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none;
            }

            .btn-primary:hover {
                background: var(--cradle-secondary);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px var(--cradle-shadow);
            }

            .btn-secondary {
                background: var(--cradle-accent);
                color: var(--cradle-text);
                border: 1px solid var(--cradle-border);
                padding: 12px 24px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .btn-secondary:hover {
                background: var(--cradle-hover);
                border-color: var(--cradle-secondary);
            }

            /* Clean Download Button */
            .download-btn {
                background: var(--cradle-primary);
                color: var(--cradle-background);
                border: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 12px;
                text-decoration: none;
                box-shadow: 0 2px 8px var(--cradle-shadow);
                margin: 16px 0;
            }

            .download-btn:hover {
                background: var(--cradle-secondary);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px var(--cradle-shadow);
            }

            /* Typography */
            h1, h2, h3, h4, h5, h6 {
                color: var(--cradle-primary);
                font-weight: 600;
                margin: 0 0 16px 0;
            }

            h1 { font-size: 2.5rem; }
            h2 { font-size: 2rem; }
            h3 { font-size: 1.5rem; }
            h4 { font-size: 1.25rem; }

            p {
                color: var(--cradle-secondary);
                margin: 0 0 16px 0;
            }

            /* Layout */
            .header {
                text-align: center;
                padding: 32px 24px;
                background: var(--cradle-background);
                border-bottom: 1px solid var(--cradle-border);
            }

            .content {
                padding: 24px;
                max-width: 1200px;
                margin: 0 auto;
            }

            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                margin-top: 24px;
            }

            .grid-2 {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }

            .grid-3 {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }

            /* Metrics */
            .metric {
                text-align: center;
                padding: 16px;
            }

            .metric-value {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--cradle-primary);
                margin-bottom: 8px;
            }

            .metric-label {
                font-size: 14px;
                color: var(--cradle-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Chat Styles */
            .chat-container {
                height: 100vh;
                display: flex;
                flex-direction: column;
                background: var(--cradle-background);
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }

            .chat-input {
                padding: 24px;
                border-top: 1px solid var(--cradle-border);
                background: var(--cradle-background);
            }

            .message {
                max-width: 70%;
                margin-bottom: 16px;
                padding: 12px 16px;
                border-radius: 8px;
                word-wrap: break-word;
            }

            .message.user {
                background: var(--cradle-primary);
                color: var(--cradle-background);
                margin-left: auto;
            }

            .message.assistant {
                background: var(--cradle-accent);
                color: var(--cradle-text);
                border: 1px solid var(--cradle-border);
            }

            /* Animations */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-fade-in {
                animation: fadeInUp 0.3s ease;
            }

            /* MezzPro Blockchain Theme Styles */
            .mezzpro-theme {
                background: var(--mezzpro-background) !important;
                color: var(--mezzpro-text) !important;
            }
            
            .mezzpro-theme .card {
                background: var(--mezzpro-background);
                border: 1px solid var(--mezzpro-border);
                box-shadow: var(--mezzpro-glow);
            }
            
            .mezzpro-theme .download-btn {
                background: var(--mezzpro-primary);
                color: var(--mezzpro-background);
                border: 1px solid var(--mezzpro-primary);
                box-shadow: var(--mezzpro-glow);
                text-shadow: 0 0 5px currentColor;
            }
            
            .mezzpro-theme .download-btn:hover {
                background: var(--mezzpro-secondary);
                box-shadow: 0 0 20px var(--mezzpro-primary);
                transform: translateY(-2px);
            }
            
            .mezzpro-theme .header {
                background: var(--mezzpro-background);
                border-bottom: 2px solid var(--mezzpro-border);
                box-shadow: 0 2px 10px var(--mezzpro-glow);
            }
            
            .mezzpro-theme .metric {
                border: 1px solid var(--mezzpro-border);
                background: var(--mezzpro-accent);
            }
            
            .mezzpro-theme .metric-value {
                color: var(--mezzpro-primary);
                text-shadow: var(--mezzpro-glow);
            }
            
            .mezzpro-theme .message.user {
                background: var(--mezzpro-primary);
                color: var(--mezzpro-background);
                box-shadow: var(--mezzpro-glow);
            }
            
            .mezzpro-theme .message.assistant {
                background: var(--mezzpro-accent);
                color: var(--mezzpro-text);
                border: 1px solid var(--mezzpro-border);
            }
            
            /* Matrix-style animation */
            @keyframes matrixGlow {
                0%, 100% { text-shadow: 0 0 5px var(--mezzpro-primary); }
                50% { text-shadow: 0 0 15px var(--mezzpro-primary), 0 0 25px var(--mezzpro-primary); }
            }
            
            .mezzpro-theme .matrix-glow {
                animation: matrixGlow 2s ease-in-out infinite;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .grid {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                
                .content {
                    padding: 16px;
                }
                
                .header {
                    padding: 24px 16px;
                }
            }
        `;
    }
}