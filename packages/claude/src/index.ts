#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import ClaudeAgentToolkit from './toolkit.js';

function initializeToolkit() {
  // Get auth token from command line argument first, then environment variables
  const cmdAuthToken = process.argv[2];
  const envApiKey = process.env.PAYBYRD_API_KEY;
  const envBearerToken = process.env.PAYBYRD_BEARER_TOKEN;
  const authToken = cmdAuthToken || envBearerToken || envApiKey;

  if (!authToken || authToken.trim() === "") {
    const errorMsg = "Authentication is required! Provide API key or Bearer token as command line argument, or set PAYBYRD_API_KEY or PAYBYRD_BEARER_TOKEN environment variable."; 
    console.error(errorMsg);   
    throw new Error(errorMsg);
  }

  return new ClaudeAgentToolkit({
    authToken,
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