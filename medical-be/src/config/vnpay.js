// src/config/vnpay.js
const qs = require("qs");
const crypto = require("crypto");

const vnpConfig = {
  vnp_TmnCode: process.env.VNP_TMN_CODE,
  vnp_HashSecret: process.env.VNP_HASH_SECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_ReturnUrl: process.env.VNP_RETURN_URL,
};

// ===== Sort object A-Z =====
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((k) => {
    sorted[k] = obj[k];
  });
  return sorted;
}

// ===== BUILD VNPay PAYMENT URL =====
function buildVnpayUrl({ amount, orderId, ipAddr, orderInfo }) {
  const date = new Date();
  const pad = (n) => (n < 10 ? "0" + n : n);

  const createDate =
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds());

  let params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpConfig.vnp_TmnCode,
    vnp_Amount: amount * 100, // VNPay yêu cầu nhân 100
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl: vnpConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
    vnp_Locale: "vn",
    // ❌ KHÔNG gửi vnp_SecureHashType trong chuỗi ký
  };

  // Sort A-Z
  params = sortObject(params);

  // Chuỗi để ký: KHÔNG encode
  const signData = qs.stringify(params, { encode: false });

  const hmac = crypto.createHmac("sha512", vnpConfig.vnp_HashSecret);
  const secureHash = hmac.update(signData).digest("hex");

  // Gắn chữ ký vào params
  params.vnp_SecureHash = secureHash;

  // Tạo URL thanh toán: encode khi gửi đi
  const paymentUrl =
    vnpConfig.vnp_Url + "?" + qs.stringify(params, { encode: true });

  return paymentUrl;
}

// ===== VERIFY RETURN / IPN =====
function verifyVnpayReturn(query) {
  // Lấy hash VNPay gửi về
  const secureHash = query.vnp_SecureHash;

  // Xoá 2 field này khỏi object trước khi ký lại
  delete query.vnp_SecureHash;
  delete query.vnp_SecureHashType; // nếu có thì xóa luôn cho chắc

  const sorted = sortObject(query);

  const signData = qs.stringify(sorted, { encode: false });

  const hmac = crypto.createHmac("sha512", vnpConfig.vnp_HashSecret);
  const checkHash = hmac.update(signData).digest("hex");

  return secureHash === checkHash;
}

module.exports = {
  buildVnpayUrl,
  verifyVnpayReturn,
};
