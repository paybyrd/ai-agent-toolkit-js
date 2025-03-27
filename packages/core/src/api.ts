import { createPaymentLink, createRefund, retrieveOrder } from './functions.js';
import type { Context } from './configuration.js';

class PaybyrdAPI {
  private apiKey: string;
  private baseUrl: string;
  context: Context;

  constructor(apiKey: string, context?: Context) {
    this.apiKey = apiKey;
    this.baseUrl = context?.baseUrl || 'https://gateway.paybyrd.com/api/v2';
    this.context = context || {};
  }

  async run(method: string, arg: any) {
    if (method === 'create_payment_link') {
      const output = JSON.stringify(
        await createPaymentLink(this.apiKey, this.baseUrl, arg)
      );
      return output;
    } else if (method === 'create_refund') {
      const output = JSON.stringify(
        await createRefund(this.apiKey, this.baseUrl, arg)
      );
      return output;
    } else if (method === 'retrieve_order') {
      const output = JSON.stringify(
        await retrieveOrder(this.apiKey, this.baseUrl, arg)
      );
      return output;
    } else {
      throw new Error('Invalid method ' + method);
    }
  }
}

export default PaybyrdAPI;