// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, checkAdmin } = require("../middlewares/verifyToken");

const upload = require("../middlewares/upload"); // tách multer ra riêng

router.post("/register", authController.register);
router.post("/login", authController.login);

// 👉 Route cần xác thực token
router.get("/profile", verifyToken, authController.profile);
router.put("/profile/:id", verifyToken, authController.updateProfile); // ✅ Thêm middleware xác thực
router.post(
  "/profile/avatar",
  verifyToken,
  upload.single("avatar"),
  authController.uploadAvatar
);
// 🩺 Đăng ký tài khoản bác sĩ
router.post(
  "/register-doctor",
  upload.single("avatar"), // ✅ THÊM DÒNG NÀY
  authController.registerDoctor
);

// Đăng ký tư vấn viên
router.post(
  "/admin/create-consultant",
  verifyToken,
  checkAdmin,
  authController.createConsultantAccount
);

module.exports = router;
