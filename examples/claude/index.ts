import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Anthropic } from "@anthropic-ai/sdk";
import colors from "colors";

// Your Anthropic API key
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY.trim() === "") {
  console.error(colors.red('Please set a valid ANTHROPIC_API_KEY environment variable'));
  process.exit(1);
}

// Your Paybyrd API key
const PAYBYRD_API_KEY = process.env.PAYBYRD_API_KEY || "";

if (!PAYBYRD_API_KEY || PAYBYRD_API_KEY.trim() === "") {
  console.error(colors.red('Please set a valid PAYBYRD_API_KEY environment variable'));
  process.exit(1);
}

async function main() {
  
  console.log(colors.cyan("Initializing client..."));

  // Initialize the Anthropic client
  const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  const mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });

  const command = "npx";

  const transport = new StdioClientTransport({
    command,
    args: ["-y", "@paybyrd/ai-agent-claude"],
    env: {
      PAYBYRD_API_KEY : PAYBYRD_API_KEY
    }
  });

  mcp.connect(transport);

  const toolsResult = await mcp.listTools();

  const tools = toolsResult.tools.map((tool) => {
    return {
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema,
    };
  });

  console.log(
    colors.green("Connected to server with tools:"),
    tools.map(({ name }) => colors.yellow(name)));
    
  // Example: Create a paybylink of 50 EUR and send to an email
  console.log(colors.cyan("Waiting 5 seconds before sending message to Anthropic..."));
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Example: Create a paybylink of 50 EUR and send to an email

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
  
  console.log(colors.green("Anthropic response:"), message.content);
}

main().catch(error => {
  console.error(colors.red('Client error:'), error);
  process.exit(1);
});