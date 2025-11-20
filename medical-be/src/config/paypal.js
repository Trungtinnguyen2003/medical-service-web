// src/config/paypal.js
const paypal = require("@paypal/checkout-server-sdk");

function paypalClient() {
  const env =
    process.env.PAYPAL_MODE === "live"
      ? new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        )
      : new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        );

  return new paypal.core.PayPalHttpClient(env);
}

// Tạo order
async function createOrder({ amount }) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
    application_context: {
      return_url: `${process.env.SERVER_URL}/api/payment/paypal/return`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/paypal/cancel`,
    },
  });

  const client = paypalClient();
  const response = await client.execute(request);
  return response.result;
}

// Capture order
async function captureOrder(orderId) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const client = paypalClient();
  return await client.execute(request);
}

module.exports = { createOrder, captureOrder };
