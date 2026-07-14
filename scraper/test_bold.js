const crypto = require('crypto');

const SECRET = 'bf12U-RGC3gQTU_h8yMhzA';
const PEDIDO = '1baf1142-1f80-4c72-b64b-90b0b5cf4b6b';
const PRECIO = 90000;
const CANTIDAD = 2;
const MONTO_CENTAVOS = PRECIO * CANTIDAD * 100; // 18000000

// 1. Firma de integridad esperada (fórmula Bold: SHA256(order+monto+COP+secret))
const cadena = `${PEDIDO}${MONTO_CENTAVOS}COP${SECRET}`;
const firma = crypto.createHash('sha256').update(cadena).digest('hex');
console.log('Monto centavos:', MONTO_CENTAVOS);
console.log('Firma integridad:', firma);

// 2. Simular webhook SALE_APPROVED con firma HMAC válida
(async () => {
  const evento = {
    id: 'evt-test-1',
    type: 'SALE_APPROVED',
    subject: 'txn-123',
    time: 1783900000,
    data: {
      payment_id: 'BOLD-PAY-TEST-123',
      merchant_id: 'merch-1',
      payment_method: 'PSE',
      metadata: { reference: PEDIDO },
    },
  };
  const rawBody = JSON.stringify(evento);
  const base64Body = Buffer.from(rawBody, 'utf8').toString('base64');
  const hmac = crypto.createHmac('sha256', SECRET).update(base64Body).digest('hex');

  // Webhook con firma VÁLIDA
  const okResp = await fetch('http://localhost:3000/api/bold/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bold-signature': hmac },
    body: rawBody,
  });
  console.log('Webhook firma válida →', okResp.status, await okResp.text());

  // Webhook con firma INVÁLIDA (debe rechazar 401)
  const badResp = await fetch('http://localhost:3000/api/bold/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bold-signature': 'firmafalsa123' },
    body: rawBody,
  });
  console.log('Webhook firma inválida →', badResp.status, '(debe ser 401)');
})();
