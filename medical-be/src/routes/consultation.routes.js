// src/routes/consultation.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/consultation.controller");
const { verifyToken } = require("../middlewares/verifyToken");

// ✅ kiểm tra controller load được chưa
// console.log("📂 Consultation controller keys:", Object.keys(controller));

const checkDoctor = (req, res, next) => {
  if (req.user.role !== "doctor")
    return res.status(403).json({ message: "Chỉ bác sĩ mới có thể truy cập" });
  next();
};

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Chỉ admin mới có thể truy cập" });
  next();
};

// 👩‍⚕️ Bệnh nhân gửi câu hỏi
router.post("/", verifyToken, controller.createConsultation);

// 👨‍⚕️ Bác sĩ xem câu hỏi của mình
router.get(
  "/doctor",
  verifyToken,
  checkDoctor,
  controller.getConsultationsForDoctor
);

// 👨‍⚕️ Bác sĩ trả lời
router.put(
  "/:id/answer",
  verifyToken,
  checkDoctor,
  controller.answerConsultation
);

// 🧑‍💼 Admin xem tất cả câu hỏi
router.get("/", verifyToken, checkAdmin, controller.getAllConsultations);
// 🟢 Lấy danh sách câu hỏi công khai (đã trả lời)
router.get("/public", controller.getPublicConsultations);

module.exports = router;
