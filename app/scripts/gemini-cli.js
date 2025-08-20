#!/usr/bin/env node

/**
 * Gemini CLI Wrapper (Node.js)
 * Simple command-line interface for Google Gemini API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const process = require('process');

async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    
    // Check for help
    if (args.includes('--help') || args.includes('-h')) {
        console.log('Gemini AI CLI');
        console.log('Usage: gemini "Your question here"');
        console.log('       gemini --model gemini-pro "Your question"');
        console.log('       gemini --api-key YOUR_KEY "Your question"');
        console.log('');
        console.log('Environment: Set GEMINI_API_KEY for automatic authentication');
        process.exit(0);
    }
    
    // Parse model argument
    let model = 'gemini-pro';
    let apiKey = null;
    let prompt = '';
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--model' && i + 1 < args.length) {
            model = args[i + 1];
            i++; // Skip next argument
        } else if (args[i] === '--api-key' && i + 1 < args.length) {
            apiKey = args[i + 1];
            i++; // Skip next argument
        } else if (!args[i].startsWith('--')) {
            prompt += args[i] + ' ';
        }
    }
    
    prompt = prompt.trim();
    
    // Get API key from argument or environment
    apiKey = apiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.log('❌ Error: No API key provided!');
        console.log('   Set GEMINI_API_KEY environment variable or use --api-key');
        console.log('   Get your free API key at: https://makersuite.google.com/app/apikey');
        process.exit(1);
    }
    
    if (!prompt) {
        console.log('❌ Error: No prompt provided!');
        console.log('   Usage: gemini "Your question here"');
        process.exit(1);
    }
    
    try {
        // Initialize the Google AI client
        const genAI = new GoogleGenerativeAI(apiKey);
        const genModel = genAI.getGenerativeModel({ model });
        
        console.log(`🤖 Gemini (${model}):`);
        console.log('-'.repeat(50));
        
        // Generate response
        const result = await genModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(text);
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('   Check your API key at: https://makersuite.google.com/app/apikey');
        }
        process.exit(1);
    }
}

main().catch(console.error);