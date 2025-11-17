const express = require("express");
const router = express.Router();
const db = require("../models");
const { verifyToken, checkAdmin } = require("../middlewares/verifyToken");

// 📋 Lấy tất cả khung giờ
router.get("/", async (req, res) => {
  try {
    const slots = await db.TimeSlot.findAll({
      order: [
        ["period", "ASC"],
        ["start_time", "ASC"],
      ],
    });
    res.json(slots);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách khung giờ",
      error: error.message,
    });
  }
});

// ➕ Thêm mới khung giờ
router.post("/", verifyToken, checkAdmin, async (req, res) => {
  try {
    const { label, start_time, end_time, period } = req.body;
    if (!label || !start_time || !end_time || !period) {
      return res.status(400).json({ message: "Thiếu thông tin khung giờ" });
    }

    const newSlot = await db.TimeSlot.create({
      label,
      start_time,
      end_time,
      period,
    });
    res.json(newSlot);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo khung giờ", error: error.message });
  }
});

// ✏️ Cập nhật khung giờ
router.put("/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    const { label, start_time, end_time, period } = req.body;
    await db.TimeSlot.update(
      { label, start_time, end_time, period },
      { where: { id: req.params.id } }
    );
    const updated = await db.TimeSlot.findByPk(req.params.id);
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật khung giờ", error: error.message });
  }
});

// 🗑 Xoá khung giờ
router.delete("/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    await db.TimeSlot.destroy({ where: { id: req.params.id } });
    res.json({ message: "Đã xoá khung giờ" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xoá khung giờ", error: error.message });
  }
});

module.exports = router;
