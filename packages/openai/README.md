# Paybyrd AI Agent for OpenAI

OpenAI integration for Paybyrd's AI Agent Toolkit.

## Installation

```bash
npm install @paybyrd/ai-agent-openai openai
```

## Quick Start

This package provides tools for OpenAI's function calling API.

### Setup

```typescript
import OpenAI from 'openai';
import { OpenAIAgentToolkit } from '@paybyrd/ai-agent-openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the Paybyrd toolkit
const toolkit = new OpenAIAgentToolkit({
  apiKey: process.env.PAYBYRD_API_KEY,
  configuration: {
    actions: {
      paymentLinks: { create: true },
      refunds: { create: true },
      order: { read: true }
    },
  },
});
```

### Function Calling Example

```typescript
async function createPaymentLink() {
  // Get the tools for OpenAI
  const tools = toolkit.getTools();
  
  // Make a request to OpenAI with the tools
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
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
  
  // Handle tool calls if any were made
  if (message.tool_calls && message.tool_calls.length > 0) {
    // Process the tool calls
    const toolResults = await Promise.all(
      message.tool_calls.map(toolCall => toolkit.handleToolCall(toolCall))
    );
    
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
    
    return finalResponse.choices[0].message;
  }
  
  return message;
}
```

## Available Tools

The toolkit provides these tools to OpenAI:

- `create_payment_link`: Create a payment link for a customer
- `create_refund`: Process a refund for a transaction
- `retrieve_order`: Get details about an order

## License

MIT