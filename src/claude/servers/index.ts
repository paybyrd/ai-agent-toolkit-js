import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { PaybyrdAgentToolkit } from '../index.js';
import colors from 'colors';

function initializeToolkit() {
 
  if (!process.env.PAYBYRD_API_KEY){
    const errorMsg = "'PAYBYRD_API_KEY' API key is required!";    
    throw new Error(errorMsg);
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

    console.log(colors.green("Connected!"));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

main().catch((error: unknown) => {
  process.exit(1);
});