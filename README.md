# Paybyrd AI Agent Toolkit

A toolkit for integrating Paybyrd's payment processing capabilities with AI models like OpenAI and Anthropic Claude.

## Overview

This toolkit enables AI assistants to perform payment operations through the Paybyrd API:

- Create payment links for customers
- Process refunds
- Retrieve order information

The toolkit uses a modular architecture with support for different AI platforms.

## Repository Structure

This monorepo is organized into these packages:

- **core** (`@paybyrd/ai-agent-toolkit`): Core functionality and shared tools
- **claude** (`@paybyrd/ai-agent-claude`): Anthropic Claude integration using Model Context Protocol
- **openai** (`@paybyrd/ai-agent-openai`): OpenAI integration with function calling

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Paybyrd API key
- OpenAI API key (for OpenAI integration) or Anthropic API key (for Claude integration)

### Installation

Each package can be installed separately depending on which AI platform you're using:

```bash
# For the core functionality
npm install @paybyrd/ai-agent-toolkit

# For Claude integration
npm install @paybyrd/ai-agent-claude

# For OpenAI integration
npm install @paybyrd/ai-agent-openai
```

## Examples

See the `/examples` directory for complete implementation examples:

- `/examples/openai`: Example implementation with OpenAI
- `/examples/modelcontextprotocol`: Example implementation with Claude using the Model Context Protocol

## Available Tools

The toolkit provides these payment operations:

- **Create Payment Link**: Generate payment links to send to customers
- **Create Refund**: Process refunds for transactions
- **Retrieve Order**: Get details about an existing order

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

## License

MIT