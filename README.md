# Paybyrd Agent Toolkit

Paybyrd Agent Toolkit is a library that enables AI models to interact with Paybyrd's payment processing API through various interfaces, including OpenAI's function calling and the Model Context Protocol (MCP).

## Features

- Integrate Paybyrd payment services with AI models
- Create payment links
- Process refunds
- Retrieve order information
- Support for multiple AI platforms:
  - OpenAI function calling
  - Anthropic's Claude via Model Context Protocol

## Installation

```bash
npm install @paybyrd/agent-toolkit
```

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Paybyrd API key
- OpenAI API key (for OpenAI integration) or Anthropic API key (for Claude integration)

### Using with OpenAI

```typescript
import { PaybyrdAgentToolkit } from '@paybyrd/agent-toolkit/openai';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Paybyrd toolkit for OpenAI
const toolkit = new PaybyrdAgentToolkit({
  apiKey: process.env.PAYBYRD_API_KEY,
  configuration: {
    actions: {
      paymentLinks: { create: true },
      refunds: { create: true },
      order: { read: true }
    },
  },
});

// Get the tool definitions
const tools = toolkit.getTools();

// Create a chat completion with the tools
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { 
      role: "user", 
      content: "Create a payment link for 50 EUR and send it to customer@example.com" 
    }
  ],
  tools: tools,
  tool_choice: "auto",
});

console.log(response);
```

### Using with Claude via Model Context Protocol

#### Server Setup

Create a server script:

```typescript
// server.ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PaybyrdAgentToolkit } from '@paybyrd/agent-toolkit/modelcontextprotocol';

function initializeToolkit() {
  if (!process.env.PAYBYRD_API_KEY) {
    throw new Error("'PAYBYRD_API_KEY' API key is required!");
  }

  return new PaybyrdAgentToolkit({
    apiKey: process.env.PAYBYRD_API_KEY,
    configuration: {
      actions: {
        paymentLinks: { create: true },
        refunds: { create: true },
        order: { read: true }
      },
    },
  });
}

async function main() {
  try {
    const toolkit = initializeToolkit();
    const transport = new StdioServerTransport();

    await toolkit.connect(transport);
    console.log("Connected!");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

main().catch((error) => {
  process.exit(1);
});
```

#### Client Setup

Create a client script:

```typescript
// client.ts
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Anthropic } from "@anthropic-ai/sdk";

async function main() {
  // Initialize the Anthropic client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const mcp = new Client({ name: "mcp-client", version: "1.0.0" });

  // Create a transport that will run your server script
  const transport = new StdioClientTransport({
    command: "node",
    args: ["server.js"]
  });

  // Connect to the server
  mcp.connect(transport);

  // List available tools
  const toolsResult = await mcp.listTools();
  const tools = toolsResult.tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
  }));

  console.log("Connected to server with tools:", tools.map(({ name }) => name));

  // Send a request to Claude with the tools
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: "Please retrieve the order '627f7c5c-b50b-412c-868f-bbae98c16b2e'"
      }
    ],
    tools: tools
  });
  
  console.log("Anthropic response:", message.content);
}

main().catch(error => {
  console.error('Client error:', error);
  process.exit(1);
});
```

### Running with Claude Desktop App

To use the toolkit with the Claude Desktop App:

1. Install the toolkit:
   ```bash
   npm install -g @paybyrd/agent-toolkit
   ```

2. Set your Paybyrd API key:
   ```bash
   export PAYBYRD_API_KEY="your-api-key-here"
   ```

3. Run the MCP server:
   ```bash
   claude-mcp
   ```

4. Configure Claude Desktop to use the MCP server:

   a. Open Claude Desktop
   
   b. Go to Settings > Advanced > Model Context Protocol
   
   c. Check "Enable Model Context Protocol"
   
   d. Set the Command to: `claude-mcp`
   
   e. Click "Save"

5. Now Claude Desktop will have access to Paybyrd payment tools

## API Reference

### `PaybyrdAgentToolkit` Options

```typescript
{
  apiKey: string;  // Your Paybyrd API key
  configuration: {
    actions: {
      paymentLinks: { create: boolean };
      refunds: { create: boolean };
      order: { read: boolean };
    }
  }
}
```

## Available Tools

- `create_payment_link`: Create payment links to send to customers
- `create_refund`: Process refunds for orders
- `get_order`: Retrieve order information by order ID

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm run test

# Run linter
npm run lint

# Format code
npm run prettier
```

## License

MIT