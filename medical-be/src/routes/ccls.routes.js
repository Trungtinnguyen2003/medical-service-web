// src/routes/ccls.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/ccls.controller");
const { verifyToken } = require("../middlewares/verifyToken");

// Tuỳ bạn có muốn chặn chỉ bác sĩ dùng, tạm ví dụ checkDoctor:
const checkDoctor = (req, res, next) => {
  if (req.user.role !== "doctor" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Chỉ bác sĩ hoặc admin mới được thao tác" });
  }
  next();
};

// =======================
// Bác sĩ khám ban đầu tạo yêu cầu CLS
// POST /ccls/requests
// =======================
router.post(
  "/requests",
  verifyToken,
  checkDoctor,
  controller.createCclsRequest
);

// =======================
// Bác sĩ CLS xem yêu cầu được giao
// GET /ccls/requests/assigned?doctor_id=1
// =======================
router.get(
  "/requests/assigned",
  verifyToken,
  checkDoctor,
  controller.getMyAssignedRequests
);

// =======================
// Bác sĩ khám ban đầu xem CLS theo appointment
// GET /ccls/requests/by-appointment/:appointment_id
// =======================
router.get(
  "/requests/by-appointment/:appointment_id",
  verifyToken,
  // checkDoctor,
  controller.getRequestsByAppointment
);

// =======================
// Bác sĩ CLS gửi kết quả
// POST /ccls/results
// =======================
router.post("/results", verifyToken, checkDoctor, controller.submitCclsResult);

module.exports = router;
