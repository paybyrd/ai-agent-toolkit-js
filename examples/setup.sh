#!/bin/bash

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install TypeScript dependencies
echo "Installing dependencies in the main package..."
cd ../
npm install

# Install OpenAI example dependencies
echo "Setting up OpenAI example..."
cd examples/openai
npm install

# Install MCP example dependencies
echo "Setting up MCP example..."
cd ../modelcontextprotocol
npm install

echo
echo "Setup complete!"
echo
echo "To run the OpenAI example:"
echo "  cd examples/openai"
echo "  OPENAI_API_KEY=your_openai_key PAYBYRD_API_KEY=your_paybyrd_key npm start"
echo
echo "To run the Anthropic Claude example:"
echo "  cd examples/modelcontextprotocol"
echo "  ANTHROPIC_API_KEY=your_anthropic_key PAYBYRD_API_KEY=your_paybyrd_key npm start"