// src/routes/postCategory.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/postCategory.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const db = require("../models"); // ✅ Thêm dòng này vào đầu file

function checkAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới thao tác" });
  }
  next();
}

router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", verifyToken, checkAdmin, controller.createCategory);
router.put("/:id", verifyToken, checkAdmin, controller.updateCategory);
router.delete("/:id", verifyToken, checkAdmin, controller.deleteCategory);
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ message: "Slug không hợp lệ" });
    }

    const category = await db.PostCategory.findOne({ where: { slug } });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    res.json(category);
  } catch (err) {
    console.error("❌ Lỗi server khi tìm category theo slug:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
module.exports = router;
