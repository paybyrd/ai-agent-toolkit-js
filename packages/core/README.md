# Paybyrd AI Agent Toolkit Core

A toolkit for building AI agents with Paybyrd payment processing capabilities.

## Installation

```bash
npm install @paybyrd/ai-agent-toolkit
```

## Features

- Create payment links for customers
- Process refunds for transactions
- Retrieve order details
- Tool permissions system
- Compatible with OpenAI and Claude integrations

## Integrations

This core package is used by model-specific integrations:

- Claude: `@paybyrd/ai-agent-claude`
- OpenAI: `@paybyrd/ai-agent-openai`

## API Reference

### Configuration

```typescript
// Configuration example
const configuration = {
  actions: {
    paymentLinks: { create: true },
    refunds: { create: true },
    order: { read: true }
  },
  // Optional context
  context: {
    baseUrl: "https://api.paybyrd.com/v1"
  }
};
```

### Available Tools

- `create_payment_link`: Create a payment link for a customer
- `create_refund`: Process a refund for a transaction
- `retrieve_order`: Get details about an order

## License

MIT