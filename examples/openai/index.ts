import OpenAI from 'openai';
import { PaybyrdAgentToolkit } from '../../src/openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
});

// Initialize the Paybyrd toolkit
const toolkit = new PaybyrdAgentToolkit({
  apiKey: process.env.PAYBYRD_API_KEY || 'your-paybyrd-api-key',
  configuration: {
    actions: {
      paymentLinks: { create: true },
      refunds: { create: true },
      order: { read: true }
    },
  },
});

async function main() {
  try {
    console.log('Creating chat completion with tools...');
    
    // Get the tools for OpenAI
    const tools = toolkit.getTools();
    
    // Make a request to OpenAI with the tools
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Or gpt-3.5-turbo or any model that supports tools
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant that can create payment links and process refunds.' 
        },
        { 
          role: 'user', 
          content: 'Can you create a payment link for €50 for a customer named John Smith?' 
        }
      ],
      tools: tools,
    });
    
    const message = response.choices[0].message;
    console.log('Message received:', message);
    
    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log('Tool calls detected, processing...');
      
      // Process the tool calls
      const toolResults = await Promise.all(
        message.tool_calls.map(toolCall => toolkit.handleToolCall(toolCall))
      );
      
      console.log('Tool results:', toolResults);
      
      // Continue the conversation with the results
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that can create payment links and process refunds.' 
          },
          { 
            role: 'user', 
            content: 'Can you create a payment link for €50 for a customer named John Smith?' 
          },
          message,
          ...toolResults,
        ],
      });
      
      console.log('Final response:', finalResponse.choices[0].message);
    } else {
      console.log('No tool calls made.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();