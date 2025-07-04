const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");

// ✅ Tách đúng middleware ra
const { verifyToken, checkDoctor } = require("../middlewares/verifyToken");

router.get(
  "/doctor",
  verifyToken,
  checkDoctor,
  appointmentController.getAppointmentsByDoctor
);

router.post("/", verifyToken, appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);
router.get("/my", verifyToken, appointmentController.getMyAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:id/status", appointmentController.updateAppointmentStatus);
router.delete("/:id", appointmentController.deleteAppointment);

// ✅ route cho bác sĩ xem lịch

module.exports = router;
