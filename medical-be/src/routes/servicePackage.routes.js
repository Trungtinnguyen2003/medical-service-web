const express = require("express");
const router = express.Router();
const servicePackageController = require("../controllers/servicePackage.controller");

// Tạo gói khám mới
router.post("/", servicePackageController.createPackage);

// Lấy tất cả gói khám
router.get("/", servicePackageController.getAllPackages);

// Lấy chi tiết gói theo slug
router.get("/:slug", servicePackageController.getPackageBySlug);

// Cập nhật gói
router.put("/:id", servicePackageController.updatePackage);

// Xoá gói
router.delete("/:id", servicePackageController.deletePackage);

// Gán dịch vụ vào gói khám
router.post("/:id/services", servicePackageController.assignServicesToPackage);

router.get("/id/:id", servicePackageController.getPackageById); // tránh trùng slug

router.get("/:id/doctors", servicePackageController.getDoctorsOfPackage);

module.exports = router;
