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

/* ============================
 * 1) ROUTES CỤ THỂ (đặt TRÊN)
 * ============================ */

// lấy bác sĩ theo chuyên khoa
router.get("/departments/:id/doctors", controller.getDoctorsByDepartment);

// lấy bác sĩ theo userId
router.get("/user/:userId", verifyToken, controller.getDoctorByUserId);

// lấy chuyên khoa của bác sĩ
router.get("/:id/departments", verifyToken, controller.getDepartmentsOfDoctor);

// lấy dịch vụ của bác sĩ
router.get("/:id/services", controller.getServicesOfDoctor);

// lấy slot trống
router.get("/:id/available-slots", controller.getAvailableSlots);

// lấy ngày làm việc
router.get("/:id/available-days", controller.getAvailableDays);

/* ============================
 * 2) CRUD routes
 * ============================ */

// lấy tất cả bác sĩ
router.get("/", controller.getAllDoctors);

// tạo bác sĩ kèm tài khoản
router.post(
  "/with-account",
  verifyToken,
  checkAdmin,
  controller.createDoctorWithAccount
);

// tạo bác sĩ
router.post("/", verifyToken, checkAdmin, controller.createDoctor);

// cập nhật
router.put(
  "/:id",
  verifyToken,
  checkDoctorSelfOrAdmin,
  controller.updateDoctor
);

// xoá bác sĩ
router.delete("/:id", verifyToken, checkAdmin, controller.deleteDoctor);

// gán chuyên khoa cho bác sĩ
router.post(
  "/:id/departments",
  verifyToken,
  checkAdmin,
  controller.setDepartments
);

// gán dịch vụ
router.post("/:id/services", verifyToken, checkAdmin, controller.setServices);

// route cũ lấy list user doctor (giữ nguyên)
router.get("/", verifyToken, async (req, res) => {
  try {
    const doctors = await db.User.findAll({
      where: { role: "doctor" },
      attributes: ["id", "name", "email", "phone", "avatar"],
      order: [["name", "ASC"]],
    });
    res.json(doctors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách bác sĩ", error: err.message });
  }
});

/* ============================
 * 3) ROUTE ĐỘNG (đặt CUỐI)
 * ============================ */

// lấy 1 bác sĩ theo id → phải đặt cuối cùng
router.get("/:id", controller.getDoctorById);

module.exports = router;
