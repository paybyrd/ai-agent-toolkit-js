import {z} from 'zod';
import {v4 as uuidv4} from 'uuid';

// Payment Link Parameters (for Order creation API)
export const createPaymentLinkParameters = z.object({
  isoAmount: z
    .number()
    .int()
    .describe('The payment amount in the smallest currency unit (e.g. cents for EUR).'),
  currency: z.string().describe('The currency code of the payment (e.g. EUR).'),
  orderRef: z
    .string()
    .default(() => uuidv4())
    .describe('Your reference for this order.'),
  shopper: z
    .object({
      firstName: z.string().optional().describe('The shopper\'s first name.'),
      lastName: z.string().optional().describe('The shopper\'s last name.'),
    })
    .optional()
    .describe('The shopper information.'),
  orderOptions: z
    .object({
      notifyBy: z
        .object({
          email: z
            .object({
              address: z.string().email().describe('The email address to send notifications to.'),
            })
            .optional()
            .describe('Email notification settings.'),
          sms: z
            .object({
              phoneCountryCode: z.number().int().describe('The phone country code.'),
              phoneNumber: z.string().describe('The phone number.'),
            })
            .optional()
            .describe('SMS notification settings.'),
          whatsapp: z
            .object({
              phoneCountryCode: z.number().int().describe('The phone country code.'),
              phoneNumber: z.string().describe('The phone number.'),
            })
            .optional()
            .describe('WhatsApp notification settings.'),
        })
        .optional()
        .describe('Notification options for the payment link.'),
      redirectUrl: z
        .string()
        .url()
        .optional()
        .describe('URL to redirect the shopper after payment.'),
      culture: z
        .string()
        .optional()
        .describe('The culture code for the payment page (e.g. en-US).'),
      expiresIn: z
        .string()
        .optional()
        .describe('The duration for which the payment link is valid (format: hh:mm:ss).'),
    })
    .optional()
    .describe('Configuration options for the order.'),
  paymentOptions: z
    .object({
      allowedPaymentMethods: z
        .array(z.enum(['CARD', 'MBWAY']))
        .optional()
        .describe('List of payment methods that should be enabled.'),
    })
    .optional()
    .describe('Payment-specific options.'),
});

// Refund Parameters
export const createRefundParameters = z.object({
  transactionId: z
    .string()
    .describe('The ID of the transaction to refund.'),
  isoAmount: z
    .number()
    .int()
    .describe('The amount to refund in the smallest currency unit (e.g. cents).'),
});

// Retrieve Order Parameters
export const retrieveOrderParameters = z.object({
  orderId: z
    .string()
    .describe('The ID of the order to retrieve.')
});