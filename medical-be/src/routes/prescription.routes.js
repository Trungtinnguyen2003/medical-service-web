const express = require("express");
const router = express.Router();
const controller = require("../controllers/prescription.controller");
const { verifyToken, checkRole } = require("../middlewares/verifyToken");

router.post(
  "/",
  verifyToken,
  checkRole(["doctor"]),
  controller.createPrescription
);
router.get(
  "/:id",
  verifyToken,
  checkRole(["doctor", "admin", "user"]),
  controller.getPrescription
);
router.get(
  "/appointment/:appointment_id",
  verifyToken,
  checkRole(["doctor", "admin", "user"]),
  controller.getByAppointment
);

module.exports = router;
