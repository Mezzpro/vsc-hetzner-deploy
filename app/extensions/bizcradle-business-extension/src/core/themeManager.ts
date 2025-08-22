export class ThemeManager {
    private static readonly ORANGE_THEME = {
        primaryOrange: '#FF6B35',
        secondaryOrange: '#F7931E',
        accentOrange: '#FFB000',
        darkOrange: '#CC8800',
        background: '#2B1810',
        darkBackground: '#1A0F06',
        lightBackground: '#3D251A',
        text: '#FFFFFF',
        lightText: '#E6A000'
    };

    public getOrangeCSS(): string {
        return `
            <style>
                :root {
                    --bizcradle-primary: ${ThemeManager.ORANGE_THEME.primaryOrange};
                    --bizcradle-secondary: ${ThemeManager.ORANGE_THEME.secondaryOrange};
                    --bizcradle-accent: ${ThemeManager.ORANGE_THEME.accentOrange};
                    --bizcradle-dark: ${ThemeManager.ORANGE_THEME.darkOrange};
                    --bizcradle-bg: ${ThemeManager.ORANGE_THEME.background};
                    --bizcradle-bg-dark: ${ThemeManager.ORANGE_THEME.darkBackground};
                    --bizcradle-bg-light: ${ThemeManager.ORANGE_THEME.lightBackground};
                    --bizcradle-text: ${ThemeManager.ORANGE_THEME.text};
                    --bizcradle-text-light: ${ThemeManager.ORANGE_THEME.lightText};
                    --bizcradle-gradient: linear-gradient(135deg, var(--bizcradle-primary), var(--bizcradle-secondary));
                    --bizcradle-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
                    --bizcradle-glow: 0 0 20px rgba(255, 176, 0, 0.4);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: var(--bizcradle-bg);
                    color: var(--bizcradle-text);
                    line-height: 1.6;
                    overflow-x: hidden;
                }

                .bizcradle-container {
                    min-height: 100vh;
                    background: var(--bizcradle-gradient);
                    padding: 20px;
                }

                .bizcradle-header {
                    text-align: center;
                    padding: 40px 20px;
                    background: rgba(26, 15, 6, 0.9);
                    border-radius: 15px;
                    margin-bottom: 30px;
                    box-shadow: var(--bizcradle-shadow);
                }

                .bizcradle-title {
                    font-size: 2.8em;
                    font-weight: 700;
                    color: var(--bizcradle-accent);
                    margin-bottom: 15px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                }

                .bizcradle-subtitle {
                    font-size: 1.3em;
                    color: var(--bizcradle-text-light);
                    opacity: 0.9;
                }

                .bizcradle-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 25px;
                    margin: 30px 0;
                }

                .bizcradle-card {
                    background: rgba(26, 15, 6, 0.95);
                    border-radius: 12px;
                    padding: 30px;
                    border: 2px solid var(--bizcradle-dark);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .bizcradle-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--bizcradle-gradient);
                }

                .bizcradle-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--bizcradle-glow);
                    border-color: var(--bizcradle-accent);
                }

                .bizcradle-card-title {
                    font-size: 1.5em;
                    color: var(--bizcradle-accent);
                    margin-bottom: 15px;
                    font-weight: 600;
                }

                .bizcradle-card-content {
                    color: var(--bizcradle-text);
                    line-height: 1.7;
                    margin-bottom: 20px;
                }

                .bizcradle-button {
                    background: var(--bizcradle-gradient);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1em;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    margin: 5px;
                }

                .bizcradle-button:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--bizcradle-shadow);
                    filter: brightness(1.1);
                }

                .bizcradle-stats {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    margin: 20px 0;
                }

                .bizcradle-stat {
                    text-align: center;
                    padding: 15px;
                }

                .bizcradle-stat-number {
                    font-size: 2.2em;
                    font-weight: 700;
                    color: var(--bizcradle-accent);
                    display: block;
                }

                .bizcradle-stat-label {
                    font-size: 0.9em;
                    color: var(--bizcradle-text-light);
                    opacity: 0.8;
                }

                .bizcradle-footer {
                    text-align: center;
                    padding: 40px 20px;
                    color: var(--bizcradle-text-light);
                    opacity: 0.7;
                    border-top: 1px solid var(--bizcradle-dark);
                    margin-top: 50px;
                }

                .bizcradle-action-bar {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin: 30px 0;
                }

                .bizcradle-professional-section {
                    background: rgba(61, 37, 26, 0.8);
                    border-radius: 10px;
                    padding: 25px;
                    margin: 20px 0;
                    border-left: 4px solid var(--bizcradle-accent);
                }

                .bizcradle-highlight {
                    color: var(--bizcradle-accent);
                    font-weight: 600;
                }

                .bizcradle-text-center {
                    text-align: center;
                }

                .bizcradle-mb-20 {
                    margin-bottom: 20px;
                }

                .bizcradle-mt-20 {
                    margin-top: 20px;
                }

                @media (max-width: 768px) {
                    .bizcradle-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .bizcradle-title {
                        font-size: 2.2em;
                    }
                    
                    .bizcradle-stats {
                        flex-direction: column;
                        align-items: center;
                    }
                }

                .bizcradle-pulse {
                    animation: bizcradlePulse 2s infinite;
                }

                @keyframes bizcradlePulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }

                .bizcradle-fade-in {
                    animation: bizcradleFadeIn 0.8s ease-in;
                }

                @keyframes bizcradleFadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;
    }

    public getColors() {
        return ThemeManager.ORANGE_THEME;
    }
}