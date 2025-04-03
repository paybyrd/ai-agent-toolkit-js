import { createPaymentLink, createRefund, retrieveOrder } from './functions.js';
import type { Context } from './configuration.js';

// Helper function to check if a string is in GUID format
const isGuid = (value: string): boolean => {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(value);
};

class PaybyrdAPI {
  private authToken: string;
  private isApiKey: boolean;
  private baseUrl: string;
  context: Context;

  constructor(authToken: string, context?: Context) {
    this.authToken = authToken;
    this.isApiKey = isGuid(authToken);
    this.baseUrl = context?.baseUrl || 'https://gateway.paybyrd.com/api/v2';
    this.context = context || {};
  }

  async run(method: string, arg: any) {
    const authInfo = {
      authToken: this.authToken,
      isApiKey: this.isApiKey
    };
    
    if (method === 'create_payment_link') {
      const output = JSON.stringify(
        await createPaymentLink(authInfo, this.baseUrl, arg)
      );
      return output;
    } else if (method === 'create_refund') {
      const output = JSON.stringify(
        await createRefund(authInfo, this.baseUrl, arg)
      );
      return output;
    } else if (method === 'retrieve_order') {
      const output = JSON.stringify(
        await retrieveOrder(authInfo, this.baseUrl, arg)
      );
      return output;
    } else {
      throw new Error('Invalid method ' + method);
    }
  }
}

export default PaybyrdAPI;