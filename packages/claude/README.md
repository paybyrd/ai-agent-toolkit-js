# Paybyrd AI Agent for Claude

Anthropic Claude integration for Paybyrd's AI Agent Toolkit.

## Installation

```bash
npm install @paybyrd/ai-agent-claude
```

## Quick Start

This package provides a server compatible with Anthropic's Model Context Protocol (MCP).

### Running the Agent

You can use npx to start the agent server:

```bash
npx -y @paybyrd/ai-agent-claude
```

### Authentication

You can authenticate using any of these methods:

- **Environment Variable**: `PAYBYRD_API_KEY`: Your Paybyrd API key (in GUID format)
- **Environment Variable**: `PAYBYRD_BEARER_TOKEN`: Your Paybyrd Bearer token
- **Command Argument**: Pass your API key or Bearer token directly as an argument

```bash
# With API Key
npx -y @paybyrd/ai-agent-claude YOUR_API_KEY

# With Bearer Token
npx -y @paybyrd/ai-agent-claude YOUR_BEARER_TOKEN
```

### Full Example

```typescript
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Anthropic } from "@anthropic-ai/sdk";

// Your Anthropic API key
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Your Paybyrd authentication token (API Key or Bearer Token)
const PAYBYRD_AUTH_TOKEN = process.env.PAYBYRD_BEARER_TOKEN || process.env.PAYBYRD_API_KEY;

async function main() {
  // Initialize the Anthropic client
  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  const mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });

  // Start the server process
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@paybyrd/ai-agent-claude"],
    env: {
      PAYBYRD_API_KEY: PAYBYRD_AUTH_TOKEN
    }
  });

  // Alternatively, you can pass the auth token directly as an argument:
  // args: ["-y", "@paybyrd/ai-agent-claude", PAYBYRD_AUTH_TOKEN],
  // env: {}

  mcp.connect(transport);

  const toolsResult = await mcp.listTools();
  const tools = toolsResult.tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
  }));

  // Make a request to Claude with the tools
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
  
  console.log("Claude response:", message.content);
}

main().catch(error => {
  console.error('Client error:', error);
});
```

## License

MIT