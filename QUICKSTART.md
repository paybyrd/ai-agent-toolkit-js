# Paybyrd Agent Toolkit - Quick Start Guide

This guide will help you get started with the Paybyrd Agent Toolkit, a library that enables AI models to interact with Paybyrd's payment processing API.

## Installation

Install the Paybyrd Agent Toolkit package:

```bash
npm install @paybyrd/ai-agent-toolkit
```

## Environment Setup

You'll need a Paybyrd API key to use this toolkit:

```bash
export PAYBYRD_API_KEY="your-paybyrd-api-key"
```

## OpenAI Integration

### Step 1: Install dependencies

```bash
npm install openai @paybyrd/ai-agent-toolkit
```

### Step 2: Create your OpenAI integration script

```typescript
// openai-integration.ts
import { PaybyrdAgentToolkit } from '@paybyrd/ai-agent-toolkit/openai';
import OpenAI from 'openai';

async function main() {
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

  console.log("Response:", response.choices[0].message);
}

main().catch(console.error);
```

### Step 3: Run your script

```bash
ts-node openai-integration.ts
```

## Claude Integration with Model Context Protocol (MCP)

The Model Context Protocol allows Claude to access external tools. This integration requires both a server component (to provide the tools) and a client component (to communicate with Claude).

### Method 1: Using Claude Desktop App

#### Step 1: Install the toolkit globally

```bash
npm install -g @paybyrd/ai-agent-toolkit
```

#### Step 2: Set your Paybyrd API key

```bash
export PAYBYRD_API_KEY="your-paybyrd-api-key"
```

#### Step 3: Run the Claude MCP server

```bash
claude-mcp-server
```

You should see "Connected!" if the server starts successfully.

#### Step 4: Configure Claude Desktop

1. Open the Claude Desktop App
2. Navigate to Settings > Advanced > Model Context Protocol
3. Check "Enable Model Context Protocol"
4. Set the Command to: `claude-mcp-server`
5. Click "Save"

![Claude Desktop MCP Configuration](https://modelcontextprotocol.io/assets/images/claude-desktop-mcp-settings-70c4a46aca4ab6ef52a60fa9cb4ed6d9.png)

Now you can interact with Claude and ask it to perform Paybyrd-related tasks such as:
- "Create a payment link for 50 EUR and send it to customer@example.com"
- "Retrieve order information for order ID 627f7c5c-b50b-412c-868f-bbae98c16b2e"
- "Process a refund for order 627f7c5c-b50b-412c-868f-bbae98c16b2e"

### Method 2: Using the Anthropic API with MCP

#### Step 1: Install dependencies

```bash
npm install @anthropic-ai/sdk @modelcontextprotocol/sdk @paybyrd/ai-agent-toolkit
```

#### Step 2: Create the MCP server script

```typescript
// mcp-server.ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PaybyrdAgentToolkit } from '@paybyrd/ai-agent-toolkit/modelcontextprotocol';

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

#### Step 3: Create the MCP client script

```typescript
// mcp-client.ts
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Anthropic } from "@anthropic-ai/sdk";

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Please set the ANTHROPIC_API_KEY environment variable');
    process.exit(1);
  }

  // Initialize the Anthropic client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const mcp = new Client({ name: "mcp-client", version: "1.0.0" });

  // Create a transport that will run the server script
  const transport = new StdioClientTransport({
    command: "ts-node",
    args: ["mcp-server.ts"]
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

  // Example: Request order information
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

#### Step 4: Run the client

```bash
export ANTHROPIC_API_KEY="your-anthropic-api-key"
export PAYBYRD_API_KEY="your-paybyrd-api-key"
ts-node mcp-client.ts
```

## Available Features

The Paybyrd Agent Toolkit currently supports:

1. **Creating Payment Links**
   - Generate payment links with custom amounts and currencies
   - Send payment links via email
   - Set payment link expirations

2. **Processing Refunds**
   - Issue full or partial refunds for orders
   - Add refund reasons and notes

3. **Retrieving Order Information**
   - Get detailed order information by order ID
   - Check order status, amounts, customer info, etc.

## Troubleshooting

### Common Issues

1. **"PAYBYRD_API_KEY API key is required!"**
   - Ensure you've set the PAYBYRD_API_KEY environment variable

2. **Connection Issues with Claude Desktop**
   - Verify the claude-mcp-server command is installed and in your PATH
   - Check that your API key is valid
   - Restart the Claude Desktop App

3. **No Tools Available in Claude Desktop**
   - Ensure the MCP server is running before opening Claude Desktop
   - Check the MCP server logs for any connection errors

4. **API Key Issues**
   - Make sure your API keys are correctly formatted and valid
   - Check for extra spaces or line breaks in environment variables

For additional help, please contact Paybyrd support.