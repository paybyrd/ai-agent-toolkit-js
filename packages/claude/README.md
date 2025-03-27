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

### Required Environment Variables

- `PAYBYRD_API_KEY`: Your Paybyrd API key

### Full Example

```typescript
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Anthropic } from "@anthropic-ai/sdk";

// Your Anthropic API key
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Your Paybyrd API key
const PAYBYRD_API_KEY = process.env.PAYBYRD_API_KEY;

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
      PAYBYRD_API_KEY: PAYBYRD_API_KEY
    }
  });

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