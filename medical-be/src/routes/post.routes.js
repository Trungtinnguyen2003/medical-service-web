// src/routes/post.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");
const { verifyToken } = require("../middlewares/verifyToken");

function checkAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới thao tác" });
  }
  next();
}

// 🔁 Đặt trước để tránh bị bắt nhầm là :id
router.get("/pending", verifyToken, checkAdmin, controller.getPendingPosts);
router.put("/:id/status", verifyToken, checkAdmin, controller.updatePostStatus);
router.put("/:id", verifyToken, checkAdmin, controller.updatePost);

router.delete("/:id", verifyToken, checkAdmin, controller.deletePost);

// Public
router.get("/", controller.getAllPosts);
router.get("/:id", controller.getPostById);

// Doctor post
router.post("/", verifyToken, controller.createPost);
router.get("/by-category/:slug", controller.getPostsByCategorySlug);

module.exports = router;
