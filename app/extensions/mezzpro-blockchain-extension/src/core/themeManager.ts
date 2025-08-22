export class ThemeManager {
    
    getBlockchainThemeCSS(): string {
        return `
            :root {
                --mezzpro-primary: #00ff41;
                --mezzpro-secondary: #006600;
                --mezzpro-background: #000000;
                --mezzpro-text: #00ff41;
                --mezzpro-accent: #003300;
                --mezzpro-glow: 0 0 10px var(--mezzpro-primary);
                --mezzpro-border: rgba(0, 255, 65, 0.3);
                --mezzpro-hover: rgba(0, 255, 65, 0.1);
            }

            body {
                font-family: 'Courier New', 'Monaco', monospace;
                margin: 0;
                padding: 0;
                background: var(--mezzpro-background);
                color: var(--mezzpro-text);
                line-height: 1.5;
                overflow-x: hidden;
            }

            /* Blockchain Card Styles */
            .card {
                background: var(--mezzpro-background);
                border: 1px solid var(--mezzpro-border);
                border-radius: 8px;
                padding: 24px;
                margin-bottom: 20px;
                box-shadow: var(--mezzpro-glow);
                transition: all 0.3s ease;
            }

            .card:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 20px var(--mezzpro-primary);
            }

            /* Content Layout */
            .content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 24px;
            }

            .header {
                text-align: center;
                margin-bottom: 48px;
                padding: 32px 0;
                background: var(--mezzpro-background);
                border-bottom: 2px solid var(--mezzpro-border);
                box-shadow: 0 2px 10px var(--mezzpro-glow);
            }

            .header h1 {
                font-size: 2.5rem;
                font-weight: bold;
                margin: 0 0 16px 0;
                color: var(--mezzpro-primary);
                text-shadow: var(--mezzpro-glow);
            }

            .header p {
                font-size: 1.1rem;
                color: var(--mezzpro-text);
                opacity: 0.8;
                margin: 0;
            }

            /* Grid Layout */
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                margin-bottom: 32px;
            }

            .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }

            /* Blockchain Metrics */
            .metric {
                text-align: center;
                padding: 16px;
                border: 1px solid var(--mezzpro-border);
                border-radius: 8px;
                background: var(--mezzpro-accent);
                transition: all 0.3s ease;
            }

            .metric:hover {
                border-color: var(--mezzpro-primary);
                box-shadow: var(--mezzpro-glow);
            }

            .metric-value {
                font-size: 2rem;
                font-weight: bold;
                color: var(--mezzpro-primary);
                text-shadow: var(--mezzpro-glow);
                margin-bottom: 8px;
            }

            .metric-label {
                font-size: 0.875rem;
                color: var(--mezzpro-text);
                opacity: 0.7;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            /* Blockchain Buttons */
            .download-btn {
                background: var(--mezzpro-primary);
                color: var(--mezzpro-background);
                border: 1px solid var(--mezzpro-primary);
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                box-shadow: var(--mezzpro-glow);
                text-shadow: 0 0 5px currentColor;
            }

            .download-btn:hover {
                background: var(--mezzpro-secondary);
                box-shadow: 0 0 20px var(--mezzpro-primary);
                transform: translateY(-2px);
            }

            .btn-primary {
                background: var(--mezzpro-primary);
                color: var(--mezzpro-background);
                border: 1px solid var(--mezzpro-primary);
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: var(--mezzpro-glow);
            }

            .btn-primary:hover {
                background: var(--mezzpro-secondary);
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: transparent;
                color: var(--mezzpro-primary);
                border: 1px solid var(--mezzpro-border);
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-secondary:hover {
                background: var(--mezzpro-hover);
                border-color: var(--mezzpro-primary);
                box-shadow: var(--mezzpro-glow);
            }

            /* Matrix-style animation */
            @keyframes matrixGlow {
                0%, 100% { text-shadow: 0 0 5px var(--mezzpro-primary); }
                50% { text-shadow: 0 0 15px var(--mezzpro-primary), 0 0 25px var(--mezzpro-primary); }
            }
            
            .matrix-glow {
                animation: matrixGlow 2s ease-in-out infinite;
            }

            /* Chat Interface */
            .chat-container {
                height: 100vh;
                display: flex;
                flex-direction: column;
                background: var(--mezzpro-background);
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }

            .chat-input {
                padding: 24px;
                border-top: 1px solid var(--mezzpro-border);
                background: var(--mezzpro-background);
            }

            .message {
                max-width: 70%;
                margin-bottom: 16px;
                padding: 12px 16px;
                border-radius: 8px;
                word-wrap: break-word;
            }

            .message.user {
                background: var(--mezzpro-primary);
                color: var(--mezzpro-background);
                margin-left: auto;
                box-shadow: var(--mezzpro-glow);
            }

            .message.assistant {
                background: var(--mezzpro-accent);
                color: var(--mezzpro-text);
                border: 1px solid var(--mezzpro-border);
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