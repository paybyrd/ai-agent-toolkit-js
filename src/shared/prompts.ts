export const createPaymentLinkPrompt = `
This tool will create a payment link through the Paybyrd API that can be sent to customers.

Required arguments:
- isoAmount (number): The payment amount in the smallest currency unit (e.g. cents for EUR).
- currency (string): The currency code of the payment (e.g. EUR).

Optional arguments:
- orderRef (string): Your reference for this order, which has a default value dynamically generated (uuid).
- shopper (object): The shopper information with firstName and lastName.
- orderOptions (object): Configuration options including notification preferences, redirect URL, culture code, and expiration time.
- paymentOptions (object): Payment method configuration including allowedPaymentMethods.
`;

export const createRefundPrompt = `
This tool will create a refund for a specific transaction through the Paybyrd API.

Required arguments:
- transactionId (string): The ID of the transaction to refund.
- isoAmount (number): The amount to refund in the smallest currency unit (e.g. cents).
`;

export const retrieveOrderPrompt = `
This tool will retrieve the details of a specific order through the Paybyrd API.

Required arguments:
- orderId (string): The ID of the order to retrieve.

Additional knowlodge:
The field status represents the state of the order.
Created - Order has no payments associated to it or all payment attempts have failed.
Pending - Order has a payment associated to it which is in progress but not concluded.
Paid - Order has a payment associated to it with final status 'Success'.
Canceled - This status can occur by system routines, shopper action by clicking on 'cancel payment' button in the hosted page or by calling the order cancel endpoint.
Expired - This status occurs by system routines that checks for payment abandonment or in case an expiration date is sent in the create order request.
Refunded - In case a successful payment is refunded, its order will have the 'Refunded' status.
`;