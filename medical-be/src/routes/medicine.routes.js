const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicine.controller");
const { verifyToken, checkRole } = require("../middlewares/verifyToken");

// Admin quản lý thuốc
router.get("/", verifyToken, checkRole(["admin", "doctor"]), controller.getAll);
router.get(
  "/:id",
  verifyToken,
  checkRole(["admin", "doctor"]),
  controller.getById
);
router.post("/", verifyToken, checkRole(["admin"]), controller.create);
router.put("/:id", verifyToken, checkRole(["admin"]), controller.update);
router.delete("/:id", verifyToken, checkRole(["admin"]), controller.remove);

module.exports = router;
