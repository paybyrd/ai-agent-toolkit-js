#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import ClaudeAgentToolkit from './toolkit.js';

function initializeToolkit() {
 
  const apiKey = process.env.PAYBYRD_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    const errorMsg = "A valid 'PAYBYRD_API_KEY' is required!"; 
    console.error(errorMsg);   
    throw new Error(errorMsg);
  }

  return new ClaudeAgentToolkit({
    apiKey,
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