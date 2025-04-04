import { OpenAIAgentToolkit } from '@paybyrd/ai-agent-openai';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';

// Initialize OpenAI
const openaiApiKey = process.env.OPENAI_API_KEY || 'your-openai-api-key';

if (!openaiApiKey || openaiApiKey === "your-openai-api-key") {
  console.error("A valid 'OPENAI_API_KEY' is required!");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

// Initialize the Paybyrd toolkit
// Authentication can be done with either API Key or Bearer Token
const paybyrdAuthToken = process.env.PAYBYRD_BEARER_TOKEN || process.env.PAYBYRD_API_KEY || 'your-paybyrd-auth-token';

if (!paybyrdAuthToken || paybyrdAuthToken === "your-paybyrd-auth-token") {
  console.error("A valid 'PAYBYRD_BEARER_TOKEN' or 'PAYBYRD_API_KEY' is required!");
  process.exit(1);
}

const paybyrdAgentToolkit = new OpenAIAgentToolkit({
  authToken: paybyrdAuthToken,
  configuration: {
    actions: {
      paymentLinks: {
        create: true,
      },
      refunds: {
        create: true,
      },
      order: {
        read: true,
      },
    },
  },
});

(async (): Promise<void> => {
  let messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: 'Create a payment link for €50 for a yellow t-shirt purchase.',
    },
  ];

  while (true) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools: paybyrdAgentToolkit.getTools(),
    });

    const message = completion.choices[0].message;
    messages.push(message);

    if (message.tool_calls) {
      const toolMessages = await Promise.all(
        message.tool_calls.map((tc) => paybyrdAgentToolkit.handleToolCall(tc))
      );
      messages = [...messages, ...toolMessages];
    } else {
      console.log(message);
      break;
    }
  }
})();