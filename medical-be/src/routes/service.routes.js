// src/routes/service.routes.js
const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const doctorController = require("../controllers/doctor.controller"); // ✅ sử dụng controller lấy bác sĩ theo dịch vụ
const { verifyToken } = require("../middlewares/verifyToken");

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Chỉ admin mới thao tác" });
  next();
};

// ✅ ROUTE CỤ THỂ phải đặt trước route động /:id
router.get(
  "/:id/departments",
  verifyToken,
  checkAdmin,
  serviceController.getDepartmentsOfService
);

router.get("/:id/doctors", doctorController.getDoctorsByService); // ✅ lấy bác sĩ theo dịch vụ

// 🧠 Route động phải đặt sau cùng
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

// Các route thao tác có kiểm tra quyền admin
router.post("/", verifyToken, checkAdmin, serviceController.createService);
router.put("/:id", verifyToken, checkAdmin, serviceController.updateService);
router.delete("/:id", verifyToken, checkAdmin, serviceController.deleteService);

router.post(
  "/:id/departments",
  verifyToken,
  checkAdmin,
  serviceController.setDepartments
);

module.exports = router;
