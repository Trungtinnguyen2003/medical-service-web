// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifyToken");

// ✅ Định nghĩa checkAdmin ở đây vì bạn không import từ file khác
const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Bạn không phải admin" });
  next();
};

router.get("/", verifyToken, checkAdmin, controller.getAllUsers);
router.put("/:id", verifyToken, checkAdmin, controller.updateUser);
router.delete("/:id", verifyToken, checkAdmin, controller.deleteUser);

// ✅ Route chuẩn cập nhật trạng thái tài khoản (approve/reject)
router.put("/:id/status", verifyToken, checkAdmin, controller.updateUserStatus);

module.exports = router;
