// src/routes/doctor.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctor.controller");
const {
  verifyToken,
  checkDoctorSelfOrAdmin,
} = require("../middlewares/verifyToken");

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Chỉ admin được thao tác" });
  next();
};

router.get("/", controller.getAllDoctors);
router.get("/:id", controller.getDoctorById);
router.post("/", verifyToken, checkAdmin, controller.createDoctor);
router.put(
  "/:id",
  verifyToken,
  checkDoctorSelfOrAdmin,
  controller.updateDoctor
);
router.delete("/:id", verifyToken, checkAdmin, controller.deleteDoctor);
router.post(
  "/:id/departments",
  verifyToken,
  checkAdmin,
  controller.setDepartments
);
router.post("/:id/services", verifyToken, checkAdmin, controller.setServices);

router.get("/:id/departments", verifyToken, controller.getDepartmentsOfDoctor);
router.get("/user/:userId", verifyToken, controller.getDoctorByUserId);
router.get("/departments/:id/doctors", controller.getDoctorsByDepartment);
router.get("/:id/services", controller.getServicesOfDoctor);

module.exports = router;
