interface AbandonedCartEmailProps {
  customerName?: string;
  items: Array<{ product: { name: string; images?: Array<{ url: string }>; }; quantity: number; price: number; selectedVariant?: any; }>;
  subtotal: number;
  currency: string;
  currencySymbol: string;
  storeName: string;
  storeWhatsapp?: string;
  checkoutUrl: string;
  logoUrl?: string;
}

function formatPrice(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString()}`;
}

export function buildAbandonedCartEmailHTML(props: AbandonedCartEmailProps): string {
  const {
    customerName, items, subtotal, currencySymbol, storeName,
    checkoutUrl, logoUrl, storeWhatsapp
  } = props;

  const firstName = customerName?.split(' ')[0] || 'Customer';
  const waLink = storeWhatsapp
    ? `https://wa.me/${storeWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! I want to complete my order at ${storeName}`)}`
    : null;

  const itemRows = items.map(item => {
    const imgUrl = item.product.images?.[0]?.url || '';
    const variantText = item.selectedVariant
      ? Object.values(item.selectedVariant).filter(Boolean).join(', ')
      : '';
    return `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${imgUrl ? `<td width="64" style="padding-right:12px;vertical-align:top;">
                <img src="${imgUrl}" width="64" height="64" style="border-radius:8px;object-fit:cover;display:block;" />
              </td>` : ''}
              <td style="vertical-align:top;">
                <div style="font-weight:700;color:#1a1a2e;font-size:14px;margin-bottom:4px;">${item.product.name}</div>
                ${variantText ? `<div style="color:#6b7280;font-size:12px;margin-bottom:4px;">${variantText}</div>` : ''}
                <div style="color:#6b7280;font-size:13px;">Qty: ${item.quantity}</div>
              </td>
              <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                <div style="font-weight:700;color:#1a1a2e;font-size:14px;">${formatPrice(item.price * item.quantity, currencySymbol)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You left something behind!</title>
</head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              ${logoUrl
                ? `<img src="${logoUrl}" alt="${storeName}" height="48" style="display:block;margin:0 auto;" />`
                : `<div style="font-size:24px;font-weight:900;color:#1a1a2e;">${storeName}</div>`
              }
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

              <!-- Banner -->
              <div style="background:linear-gradient(135deg,#1a1a2e 0%,#e94560 100%);padding:32px 32px 28px;text-align:center;">
                <div style="font-size:40px;margin-bottom:12px;">🛒</div>
                <h1 style="margin:0;font-size:22px;font-weight:900;color:#ffffff;line-height:1.3;">
                  You left something behind, ${firstName}!
                </h1>
                <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">
                  Your cart is waiting — don't miss out!
                </p>
              </div>

              <!-- Body -->
              <div style="padding:28px 32px;">
                <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
                  Hey ${firstName}, you started shopping but didn't complete your order.
                  Your items are reserved — grab them before they run out!
                </p>

                <!-- Items -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  ${itemRows}
                </table>

                <!-- Subtotal -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-top:2px solid #f0f0f0;padding-top:16px;">
                  <tr>
                    <td style="font-size:15px;font-weight:700;color:#1a1a2e;">Cart Total</td>
                    <td align="right" style="font-size:18px;font-weight:900;color:#e94560;">${formatPrice(subtotal, currencySymbol)}</td>
                  </tr>
                </table>

                <!-- CTA -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                  <tr>
                    <td align="center">
                      <a href="${checkoutUrl}"
                        style="display:inline-block;background:#e94560;color:#ffffff;font-size:16px;font-weight:800;
                               padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">
                        Complete My Order →
                      </a>
                    </td>
                  </tr>
                </table>

                ${waLink ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                  <tr>
                    <td align="center">
                      <a href="${waLink}"
                        style="display:inline-block;background:#25D366;color:#ffffff;font-size:14px;font-weight:700;
                               padding:12px 32px;border-radius:12px;text-decoration:none;">
                        💬 Order via WhatsApp
                      </a>
                    </td>
                  </tr>
                </table>` : ''}

                <p style="margin:20px 0 0;font-size:13px;color:#9ca3af;text-align:center;line-height:1.5;">
                  If you have any questions, just reply to this email or contact us on WhatsApp.<br/>
                  We're happy to help! 🙏
                </p>
              </div>

              <!-- Footer -->
              <div style="background:#f8f8f8;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">
                  © ${new Date().getFullYear()} ${storeName}. You're receiving this because you added items to your cart.
                </p>
                <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">
                  <a href="${checkoutUrl}" style="color:#e94560;text-decoration:none;">View Cart</a>
                </p>
              </div>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildAbandonedCartEmailText(props: AbandonedCartEmailProps): string {
  const { customerName, items, subtotal, currencySymbol, storeName, checkoutUrl } = props;
  const firstName = customerName?.split(' ')[0] || 'Customer';
  const itemLines = items.map(i => `- ${i.product.name} x${i.quantity} = ${formatPrice(i.price * i.quantity, currencySymbol)}`).join('\n');
  return `Hi ${firstName},\n\nYou left items in your cart at ${storeName}!\n\nYour items:\n${itemLines}\n\nCart Total: ${formatPrice(subtotal, currencySymbol)}\n\nComplete your order here:\n${checkoutUrl}\n\nThanks,\n${storeName}`;
}
