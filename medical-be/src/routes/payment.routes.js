// src/routes/payment.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken");
const paymentController = require("../controllers/payment.controller.js");

// Tạo thanh toán VNPay
router.post("/vnpay/create", verifyToken, paymentController.createVnpayPayment);

// VNPay redirect về
router.get("/vnpay/return", paymentController.vnpayReturn);

// Tạo thanh toán MoMo
router.post("/momo/create", verifyToken, paymentController.createMomoPayment);

// MoMo redirect về
router.get("/momo/return", paymentController.momoReturn);

router.post(
  "/paypal/create",
  verifyToken,
  paymentController.createPayPalPayment
);
router.get("/paypal/return", paymentController.paypalReturn);
router.get("/paypal/cancel", paymentController.paypalCancel);

module.exports = router;
