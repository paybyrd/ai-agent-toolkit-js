import axios from 'axios';
import { z } from 'zod';
import {
  createPaymentLinkParameters,
  createRefundParameters,
  retrieveOrderParameters,
} from './parameters.js';

interface AuthInfo {
  authToken: string;
  isApiKey: boolean;
}

export const createPaymentLink = async (
  auth: AuthInfo,
  baseUrl: string,
  params: z.infer<typeof createPaymentLinkParameters>
) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'      
    };
    
    if (auth.isApiKey) {
      headers['x-api-key'] = auth.authToken;
    } else {
      headers['Authorization'] = `Bearer ${auth.authToken}`;
    }
    
    const response = await axios.post(
      `${baseUrl}/orders`,
      params,
      { headers }
    );
    
    if (response.data.checkoutUrl) {
      return {
        checkoutUrl: response.data.checkoutUrl,
        orderId: response.data.orderId
      };
    } else {
      return 'Failed to create payment link: No checkout URL in response';
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return `Failed to create payment link: ${error.response?.data?.message || error.message}`;
    }
    return 'Failed to create payment link';
  }
};

export const createRefund = async (
  auth: AuthInfo,
  baseUrl: string,
  params: z.infer<typeof createRefundParameters>
) => {
  try {
    const { transactionId, ...requestBody } = params;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    };
    
    if (auth.isApiKey) {
      headers['x-api-key'] = auth.authToken;
    } else {
      headers['Authorization'] = `Bearer ${auth.authToken}`;
    }
    
    const response = await axios.post(
      `${baseUrl}/refund/${transactionId}`,
      requestBody,
      { headers }
    );

    if (response.data.code === 'BYRD200') {
      return {
        success: true,
        code: response.data.code,
        description: response.data.description
      };
    } else {
      return {
        success: false,
        code: response.data.code,
        description: response.data.description || 'Refund operation failed'
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return `Failed to create refund: ${error.response?.data?.message || error.message}`;
    }
    return 'Failed to create refund';
  }
};

export const retrieveOrder = async (
  auth: AuthInfo,
  baseUrl: string,
  params: z.infer<typeof retrieveOrderParameters>
) => {
  try {
    const { orderId } = params;
    
    const headers: Record<string, string> = {
      'accept': 'application/json',
    };
    
    if (auth.isApiKey) {
      headers['x-api-key'] = auth.authToken;
    } else {
      headers['Authorization'] = `Bearer ${auth.authToken}`;
    }
    
    const response = await axios.get(
      `${baseUrl}/orders/${orderId}`,
      { headers }
    );
    
    if (response.status === 200) {
      return response.data;
    } else {
      return 'Failed to retrieve order details';
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return `Failed to retrieve order: ${error.response?.data?.message || error.message}`;
    }
    return 'Failed to retrieve order';
  }
};