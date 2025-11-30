// src/controllers/payment.controller.js
const db = require("../models");
const { buildVnpayUrl, verifyVnpayReturn } = require("../config/vnpay");
const { createMoMoPayment } = require("../config/momo");
// PAYPAL
const { createOrder, captureOrder } = require("../config/paypal");

const PaymentTransaction = db.PaymentTransaction;
const Appointment = db.Appointment;
const { Op } = require("sequelize");

/**
 * POST /api/payment/vnpay/create
 * body: { service_id / package_id, doctor_id, appointment_date, slot_id, amount }
 */
const createVnpayPayment = async (req, res) => {
  try {
    const {
      service_id,
      package_id,
      doctor_id,
      appointment_date,
      slot_id,
      amount,
    } = req.body;
    const user_id = req.user.id;

    console.log("📌 CREATE PAYMENT BODY:", req.body);

    // VNPay yêu cầu TxnRef 6–12 ký tự
    const orderId = Math.floor(10000000 + Math.random() * 90000000).toString();

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    if (ipAddr.includes("::1") || ipAddr === "::1") {
      ipAddr = "127.0.0.1";
    }

    // Tạo URL VNPay
    const vnpayUrl = buildVnpayUrl({
      amount,
      orderId,
      ipAddr,
      orderInfo: `Thanh toan dich vu ${service_id || package_id || ""}`,
    });

    console.log("🔗 FINAL_URL:", vnpayUrl);

    // Lưu transaction vào DB, nhớ lưu gateway_order_id
    await PaymentTransaction.create({
      user_id,
      service_id: service_id || null,
      package_id: package_id || null,
      doctor_id: doctor_id || null,
      appointment_date,
      slot_id,
      amount,
      method: "vnpay",
      status: "initiated",
      gateway_order_id: orderId,
    });

    return res.json({ paymentUrl: vnpayUrl });
  } catch (err) {
    console.error("createVnpayPayment error:", err);
    res
      .status(500)
      .json({ message: "Tạo thanh toán VNPay thất bại", error: err.message });
  }
};

/**
 * GET /api/payment/vnpay/return
 */
const vnpayReturn = async (req, res) => {
  try {
    const query = { ...req.query };

    console.log("🔙 VNPay RETURN QUERY:", query);

    const isValid = verifyVnpayReturn({ ...query });
    const vnp_ResponseCode = query.vnp_ResponseCode;
    const gateway_order_id = query.vnp_TxnRef;
    const transaction_no = query.vnp_TransactionNo || null;

    const transaction = await PaymentTransaction.findOne({
      where: { gateway_order_id },
    });

    if (!transaction) {
      return res.redirect(
        `${process.env.CLIENT_BASE_URL}/booking/result?status=failed&reason=not_found`
      );
    }

    if (!isValid) {
      await transaction.update({
        status: "failed",
        gateway_response: JSON.stringify(query),
      });
      return res.redirect(
        `${process.env.CLIENT_BASE_URL}/booking/result?status=failed&reason=invalid_signature`
      );
    }

    if (vnp_ResponseCode === "00") {
      await transaction.update({
        status: "paid",
        transaction_no,
        gateway_response: JSON.stringify(query),
      });

      const existing = await Appointment.findOne({
        where: { payment_transaction_id: transaction.id },
      });

      if (!existing) {
        await Appointment.create({
          user_id: transaction.user_id,
          service_id: transaction.service_id,
          package_id: transaction.package_id,
          doctor_id: transaction.doctor_id,
          appointment_date: transaction.appointment_date,
          slot_id: transaction.slot_id,
          status: "confirmed",
          payment_status: "paid",
          payment_method: "vnpay",
          payment_transaction_id: transaction.id,
        });
      }

      return res.redirect(
        `${process.env.CLIENT_BASE_URL}/booking/result?status=success&code=${transaction.id}`
      );
    } else {
      await transaction.update({
        status: "failed",
        transaction_no,
        gateway_response: JSON.stringify(query),
      });

      return res.redirect(
        `${process.env.CLIENT_BASE_URL}/booking/result?status=failed&reason=${vnp_ResponseCode}`
      );
    }
  } catch (error) {
    console.error("vnpayReturn error:", error);
    return res.redirect(
      `${process.env.CLIENT_BASE_URL}/booking/result?status=failed&reason=server_error`
    );
  }
};

/**
 * POST /api/payment/momo/create
 */
const createMomoPayment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      service_id,
      package_id,
      doctor_id,
      appointment_date,
      slot_id,
      amount,
    } = req.body;

    if (
      !appointment_date ||
      !slot_id ||
      (!service_id && !package_id) ||
      !amount
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const transaction = await PaymentTransaction.create({
      user_id,
      service_id: service_id || null,
      package_id: package_id || null,
      doctor_id: doctor_id || null,
      appointment_date,
      slot_id,
      amount,
      method: "momo",
      status: "initiated",
    });

    const orderId = Math.floor(10000000 + Math.random() * 90000000).toString();

    const requestId = `REQ_${transaction.id}_${Date.now()}`;
    await transaction.update({ gateway_order_id: orderId });

    const momoRes = await createMoMoPayment({
      amount,
      orderId,
      requestId,
      orderInfo: `Thanh toan don #${transaction.id}`,
    });

    if (momoRes.resultCode === 0) {
      return res.json({
        paymentUrl: momoRes.payUrl,
        transactionId: transaction.id,
      });
    } else {
      await transaction.update({
        status: "failed",
        gateway_response: JSON.stringify(momoRes),
      });
      return res
        .status(400)
        .json({ message: "Không tạo được thanh toán MoMo", detail: momoRes });
    }
  } catch (error) {
    console.error("createMomoPayment error:", error);
    res
      .status(500)
      .json({ message: "Lỗi tạo thanh toán MoMo", error: error.message });
  }
};

/**
 * GET /api/payment/momo/return
 */
const momoReturn = async (req, res) => {
  try {
    const {
      orderId,
      requestId,
      resultCode,
      message,
      extraData,
      amount,
      transId,
      signature,
    } = req.query;

    const transaction = await PaymentTransaction.findOne({
      where: { gateway_order_id: orderId },
    });

    if (!transaction) {
      return res.redirect(
        `${process.env.CLIENT_BASE_URL}/booking/result?status=failed&reason=not_found`
      );
    }

    if (String(resultCode) === "0") {
      await transaction.update({
        status: "paid",
        transaction_no: transId,
        gateway_response: JSON.stringify(req.query),
      });

      const existing = await Appointment.findOne({
        where: { payment_transaction_id: transaction.id },
      });

      if (!existing) {
        await Appointment.create({
          user_id: transaction.user_id,
          service_id: transaction.service_id,
          package_id: transaction.package_id,
          doctor_id: transaction.doctor_id,
          appointment_date: transaction.appointment_date,
          slot_id: transaction.slot_id,
          status: "confirmed",
          payment_status: "paid",
          payment_method: "momo",
          payment_transaction_id: transaction.id,
        });
      }

      return res.redirect(
        `${process.env.CLIENT_BASE_URL}/booking/result?status=success&code=${transaction.id}`
      );
    } else {
      await transaction.update({
        status: "failed",
        gateway_response: JSON.stringify(req.query),
      });

      return res.redirect(
        `${process.env.CLIENT_BASE_URL}/booking/result?status=failed&reason=${resultCode}`
      );
    }
  } catch (error) {
    console.error("momoReturn error:", error);
    return res.redirect(
      `${process.env.CLIENT_BASE_URL}/booking/result?status=failed&reason=server_error`
    );
  }
};

// ==========================
// 🔵 CREATE PAYPAL PAYMENT
// ==========================
const createPayPalPayment = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      amount,
      service_id,
      package_id,
      doctor_id,
      appointment_date,
      slot_id,
      department_id,
      patient_profile_id,
      clinic_room_id,
      flow_type, // ⭐ thêm vào
    } = req.body;

    // Validate
    if (!flow_type) {
      return res
        .status(400)
        .json({ message: "Thiếu flow_type (doctor/department)" });
    }

    // Lưu transaction
    const transaction = await PaymentTransaction.create({
      user_id,
      service_id: service_id || null,
      package_id: package_id || null,
      doctor_id: doctor_id || null,
      department_id: department_id || null,
      appointment_date,
      slot_id,
      patient_profile_id,
      clinic_room_id,
      amount,
      flow_type, // ⭐ LƯU FLOW
      method: "paypal",
      status: "initiated",
    });

    // Tạo PayPal order
    const order = await createOrder({
      amount: (amount / 24000).toFixed(2),
    });

    await transaction.update({
      gateway_order_id: order.id,
    });

    const approvalUrl = order.links.find((l) => l.rel === "approve").href;

    return res.json({
      paymentUrl: approvalUrl,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi tạo thanh toán PayPal" });
  }
};

// PayPal redirect RETURN_URL
// PayPal redirect RETURN_URL
// ==========================
// 🔵 PAYPAL RETURN
// ==========================
const paypalReturn = async (req, res) => {
  try {
    const orderId = req.query.token;

    // 1. Capture order từ PayPal
    const capture = await captureOrder(orderId);

    // 2. Lấy transaction
    const transaction = await PaymentTransaction.findOne({
      where: { gateway_order_id: orderId },
    });

    if (!transaction) {
      return res.redirect(
        `${process.env.CLIENT_URL}/step-failed?reason=transaction_not_found`
      );
    }

    // 3. Nếu thanh toán thành công
    // ⭐ Nếu thanh toán thành công
    if (capture.result.status === "COMPLETED") {
      await transaction.update({
        status: "paid",
        transaction_no: capture.result.id,
        gateway_response: JSON.stringify(capture.result),
      });

      // Lấy label giờ khám
      const slot = await db.TimeSlot.findByPk(transaction.slot_id);
      const appointment_time = slot ? slot.label : null;

      // ⭐ FLOW CHUYÊN KHOA - Tạo lịch duy nhất tại đây
      if (transaction.flow_type === "department") {
        const existed = await Appointment.findOne({
          where: { payment_transaction_id: transaction.id },
        });

        let appointment = existed;

        if (!appointment) {
          appointment = await Appointment.create({
            user_id: transaction.user_id,
            service_id: transaction.service_id,
            doctor_id: transaction.doctor_id,
            department_id: transaction.department_id,

            patient_profile_id: transaction.patient_profile_id,
            clinic_room_id: transaction.clinic_room_id,

            appointment_date: transaction.appointment_date,
            appointment_time,
            slot_id: transaction.slot_id,

            status: "pending",
            payment_status: "paid",
            payment_method: "paypal",
            payment_transaction_id: transaction.id,
          });
        }

        return res.redirect(
          `${process.env.CLIENT_URL}/dat-lich-thanh-cong-khoa?appointment_id=${appointment.id}`
        );
      }

      // ⭐ FLOW BÁC SĨ – GIỮ NGUYÊN
      // ⭐⭐ FLOW BÁC SĨ – TẠO APPOINTMENT ⭐⭐
      let existedDoctor = await Appointment.findOne({
        where: { payment_transaction_id: transaction.id },
      });

      if (!existedDoctor) {
        existedDoctor = await Appointment.create({
          user_id: transaction.user_id,
          service_id: transaction.service_id,
          package_id: transaction.package_id,
          doctor_id: transaction.doctor_id,
          department_id: transaction.department_id,

          patient_profile_id: transaction.patient_profile_id,
          clinic_room_id: transaction.clinic_room_id,

          appointment_date: transaction.appointment_date,
          appointment_time,
          slot_id: transaction.slot_id,

          status: "pending",
          payment_status: "paid",
          payment_method: "paypal",
          payment_transaction_id: transaction.id,
        });
      }

      return res.redirect(
        `${process.env.CLIENT_URL}/dat-lich-thanh-cong?appointment_id=${existedDoctor.id}`
      );
    }

    // ❌ Nếu thất bại
    await transaction.update({
      status: "failed",
      gateway_response: JSON.stringify(capture),
    });

    return res.redirect(`${process.env.CLIENT_URL}/step-failed`);
  } catch (err) {
    console.error("🔥 PayPal Return error:", err);
    return res.redirect(`${process.env.CLIENT_URL}/step-failed`);
  }
};

const paypalCancel = (req, res) => {
  return res.redirect(`${process.env.CLIENT_URL}/step-cancel`);
};

module.exports = {
  createVnpayPayment,
  vnpayReturn,
  createMomoPayment,
  momoReturn,
  createPayPalPayment,
  paypalReturn,
  paypalCancel,
};
