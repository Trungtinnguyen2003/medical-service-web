// src/config/momo.js
const crypto = require("crypto");
const axios = require("axios");

const momoConfig = {
  endpoint:
    process.env.MOMO_ENDPOINT ||
    "https://test-payment.momo.vn/v2/gateway/api/create",
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  redirectUrl:
    process.env.MOMO_REDIRECT_URL ||
    "http://localhost:5000/api/payment/momo/return",
  ipnUrl:
    process.env.MOMO_IPN_URL || "http://localhost:5000/api/payment/momo/ipn",
};

async function createMoMoPayment({ orderId, requestId, amount, orderInfo }) {
  const rawSignature =
    "accessKey=" +
    momoConfig.accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    "" +
    "&ipnUrl=" +
    momoConfig.ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    momoConfig.partnerCode +
    "&redirectUrl=" +
    momoConfig.redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    "captureWallet";

  const signature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    accessKey: momoConfig.accessKey,
    requestId,
    amount: String(amount),
    orderId,
    orderInfo,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    extraData: "",
    requestType: "captureWallet",
    signature,
    lang: "vi",
  };

  const { data } = await axios.post(momoConfig.endpoint, requestBody);
  return data; // có payUrl, deeplink
}

module.exports = {
  momoConfig,
  createMoMoPayment,
};
