#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import ClaudeAgentToolkit from './toolkit.js';

function initializeToolkit() {
  // Get API key from command line argument first, then environment variable
  const cmdApiKey = process.argv[2];
  const envApiKey = process.env.PAYBYRD_API_KEY;
  const apiKey = cmdApiKey || envApiKey;

  if (!apiKey || apiKey.trim() === "") {
    const errorMsg = "Authentication is required! Provide API key as command line argument, or set PAYBYRD_API_KEY environment variable."; 
    console.error(errorMsg);   
    throw new Error(errorMsg);
  }

  return new ClaudeAgentToolkit({
    authToken: apiKey,
    configuration: {
      actions: {
        paymentLinks: { create: true },
        refunds: { create: true },
        order: { read: true }
      },
    },
  });
}

const server = initializeToolkit();

async function main() {  
  const transport = new StdioServerTransport();  
  
  await server.connect(transport);  
}

main().catch((error: unknown) => {
  console.error('Server error:', error);
  process.exit(1);
});