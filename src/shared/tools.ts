import {z} from 'zod';

import {
  createPaymentLinkPrompt,
  createRefundPrompt,
  retrieveOrderPrompt,
} from './prompts.js';

import {
  createPaymentLinkParameters,
  createRefundParameters,
  retrieveOrderParameters,
} from './parameters.js';

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

const tools: Tool[] = [
  {
    method: 'create_payment_link',
    name: 'Create Payment Link',
    description: createPaymentLinkPrompt,
    parameters: createPaymentLinkParameters,
    actions: {
      paymentLinks: {
        create: true,
      },
    },
  },
  {
    method: 'create_refund',
    name: 'Create Refund',
    description: createRefundPrompt,
    parameters: createRefundParameters,
    actions: {
      refunds: {
        create: true,
      },
    },
  },
  {
    method: 'retrieve_order',
    name: 'Retrieve Order',
    description: retrieveOrderPrompt,
    parameters: retrieveOrderParameters,
    actions: {
      order: {
        read: true,
      },
    },
  },
];

export default tools;