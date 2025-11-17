const router = require("express").Router();
const ctrl = require("../controllers/doctor_schedule.controller");
const { verifyToken, checkAdmin } = require("../middlewares/verifyToken");

// Admin quản lý
router.get("/", verifyToken, checkAdmin, ctrl.list);
router.post("/", verifyToken, checkAdmin, ctrl.create);
router.put("/:id", verifyToken, checkAdmin, ctrl.update);
router.delete("/:id", verifyToken, checkAdmin, ctrl.remove);

// Gán khung giờ cho 1 schedule
router.put("/:id/slots", verifyToken, checkAdmin, ctrl.setSlots);

module.exports = router;
