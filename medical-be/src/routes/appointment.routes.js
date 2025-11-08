const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");

// ✅ Tách đúng middleware ra
const {
  verifyToken,
  checkDoctor,
  checkAdmin,
} = require("../middlewares/verifyToken");

router.get(
  "/doctor",
  verifyToken,
  checkDoctor,
  appointmentController.getAppointmentsByDoctor
);
router.put(
  "/:id/approve",
  verifyToken,
  checkAdmin,
  appointmentController.approveAppointment
);
router.put(
  "/:id/reject",
  verifyToken,
  checkAdmin,
  appointmentController.rejectAppointment
);

router.put(
  "/doctor/:id/status",
  verifyToken,
  checkDoctor,
  appointmentController.doctorUpdateStatus
);

router.post("/", verifyToken, appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);
router.get("/my", verifyToken, appointmentController.getMyAppointments);
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:id/status", appointmentController.updateAppointmentStatus);
router.delete("/:id", appointmentController.deleteAppointment);
router.put(
  "/:id",
  verifyToken,
  checkAdmin,
  appointmentController.updateAppointment
);

// ✅ route cho bác sĩ xem lịch

module.exports = router;
