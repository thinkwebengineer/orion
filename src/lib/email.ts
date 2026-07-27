import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  name?: string
  quantity?: number
  price?: number
}

export async function sendOrderConfirmation(params: {
  email: string
  orderId: string
  items: OrderItem[]
  shipping: { firstName: string; lastName: string }
}) {
  const itemsHtml = params.items
    .map(
      (i) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(i.name || 'Item')}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity || 1}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(i.price || 0).toFixed(2)}</td></tr>`,
    )
    .join('')

  await resend.emails.send({
    from: 'Golden Mycology <orders@goldenmycology.com>',
    to: params.email,
    subject: `Order #${params.orderId.slice(0, 8)} confirmed`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#FFD700;">Order Confirmed!</h1>
      <p>Hi ${escapeHtml(params.shipping.firstName)}, thanks for your order.</p>
      <p><strong>Order #${escapeHtml(params.orderId.slice(0, 8))}</strong></p>
      <table style="width:100%;border-collapse:collapse">
        <tr><th style="text-align:left;padding:8px;border-bottom:2px solid #333">Item</th><th style="padding:8px;border-bottom:2px solid #333">Qty</th><th style="padding:8px;border-bottom:2px solid #333;text-align:right">Price</th></tr>
        ${itemsHtml}
      </table>
      <p>We'll notify you when it ships. Questions? Reply to this email.</p>
      <p style="color:#666;font-size:12px">Golden Mycology — goldenmycology.com</p>
    </div>`,
  })
}

export async function sendShippingUpdate(params: {
  email: string
  orderId: string
  trackingNumber: string
  shippingName: string
}) {
  await resend.emails.send({
    from: 'Golden Mycology <orders@goldenmycology.com>',
    to: params.email,
    subject: `Order #${params.orderId.slice(0, 8)} has shipped!`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#FFD700;">On its way!</h1>
      <p>Hi ${escapeHtml(params.shippingName)}, your order has shipped.</p>
      <p><strong>Order #${escapeHtml(params.orderId.slice(0, 8))}</strong></p>
      <p>Tracking: <strong>${escapeHtml(params.trackingNumber)}</strong></p>
      <p style="color:#666;font-size:12px">Golden Mycology — goldenmycology.com</p>
    </div>`,
  })
}

export async function sendPasswordResetEmail(params: {
  email: string
  resetUrl: string
}) {
  await resend.emails.send({
    from: 'Golden Mycology <delivered@resend.dev>',
    to: params.email,
    subject: 'Reset your Golden Mycology password',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#FFD700;">Reset your password</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${escapeHtml(params.resetUrl)}" style="display:inline-block;background:#FFD700;color:black;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Reset Password</a>
      <p style="color:#666;font-size:12px">If you didn't request this, ignore this email.</p>
      <p style="color:#666;font-size:12px">Golden Mycology — goldenmycology.com</p>
    </div>`,
  })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
