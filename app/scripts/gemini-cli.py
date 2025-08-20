#!/usr/bin/env python3
"""
Gemini CLI Wrapper
Simple command-line interface for Google Gemini API
"""
import os
import sys
import argparse
import google.generativeai as genai

def main():
    parser = argparse.ArgumentParser(description='Gemini AI CLI')
    parser.add_argument('prompt', nargs='*', help='Prompt to send to Gemini')
    parser.add_argument('--model', default='gemini-pro', help='Model to use (default: gemini-pro)')
    parser.add_argument('--api-key', help='API key (or set GEMINI_API_KEY env var)')
    
    args = parser.parse_args()
    
    # Get API key from argument or environment
    api_key = args.api_key or os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Error: No API key provided!")
        print("   Set GEMINI_API_KEY environment variable or use --api-key")
        print("   Get your free API key at: https://makersuite.google.com/app/apikey")
        sys.exit(1)
    
    # Join prompt arguments
    prompt = ' '.join(args.prompt)
    if not prompt:
        print("❌ Error: No prompt provided!")
        print("   Usage: gemini 'Your question here'")
        sys.exit(1)
    
    try:
        # Configure API
        genai.configure(api_key=api_key)
        
        # Create model
        model = genai.GenerativeModel(args.model)
        
        print(f"🤖 Gemini ({args.model}):")
        print("-" * 50)
        
        # Generate response
        response = model.generate_content(prompt)
        print(response.text)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()