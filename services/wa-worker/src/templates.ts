export interface MessageData {
  customerName: string;
  orderNumber: string;
  total?: number;
  trackingId?: string;
  trackingUrl?: string;
  itemsSummary?: string;
}

export const TEMPLATES = {
  order_confirmation: (data: MessageData) => `
✨ *Namaste ${data.customerName}!*

Thank you for choosing *CIRAAYA Jewellery*. Your order *#${data.orderNumber}* has been confirmed!

💰 *Total Amount:* ₹${data.total?.toLocaleString('en-IN') || ''}
📦 *Items:* ${data.itemsSummary || 'Handcrafted Jewellery'}

Our master artisans are preparing and packing your pieces with love. We will update you as soon as your parcel is dispatched!

With warmth,
*Pooja & Team CIRAAYA*
https://ciraaya.com
`.trim(),

  tracking_id: (data: MessageData) => `
🚚 *Your CIRAAYA Order is on its way!*

Dear ${data.customerName}, order *#${data.orderNumber}* has been dispatched via Express Insured Courier.

📍 *Tracking ID:* ${data.trackingId || 'In Transit'}
🔗 *Track Live:* ${data.trackingUrl || 'https://ciraaya.com/account/orders'}

Please keep this handy when receiving your parcel.
`.trim(),

  delivered: (data: MessageData) => `
💖 *Delivered with Love!*

Dear ${data.customerName}, your CIRAAYA package for order *#${data.orderNumber}* has been delivered!

We hope you adore your new jewellery. Tag us *@ciraaya* on Instagram for a chance to be featured in our royal lookbook!

Need any help? Just reply to this message.
`.trim(),
};
