const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const controller = require("../controllers/department.controller");

// GET - public
router.get("/", departmentController.getAllDepartments);
router.get("/:slug", departmentController.getDepartmentBySlug);
router.post(
  "/:id/services",
  verifyToken,
  checkAdmin,
  departmentController.setServices
);

// POST - admin only
router.post(
  "/",
  verifyToken,
  checkAdmin,
  departmentController.createDepartment
);
router.put(
  "/:id",
  verifyToken,
  checkAdmin,
  departmentController.updateDepartment
);
router.delete(
  "/:id",
  verifyToken,
  checkAdmin,
  departmentController.deleteDepartment
);

router.get("/:id/doctors", controller.getDoctorsOfDepartment);
router.get("/:id/services", controller.getServicesOfDepartment);

// middleware kiểm tra admin
function checkAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới được phép" });
  }
  next();
}

module.exports = router;
