const servicePackageService = require("../services/servicePackage.service");
const { ServicePackage, Service, Department, Doctor } = require("../models");
const db = require("../models"); // ✅ thêm dòng này

// controllers/servicePackage.controller.js
const getDoctorsOfPackage = async (req, res) => {
  try {
    const pkg = await db.ServicePackage.findByPk(req.params.id, {
      include: [
        {
          model: db.Service,
          as: "services",
          include: [
            {
              model: db.Department,
              as: "departments", // ✅ alias đúng
              include: [
                {
                  model: db.Doctor,
                  as: "doctors", // ✅ alias đúng
                },
              ],
            },
          ],
        },
      ],
    });

    const doctorMap = {}; // { departmentName: [doctor, ...] }

    pkg.services.forEach((service) => {
      service.departments.forEach((dept) => {
        if (!doctorMap[dept.name]) doctorMap[dept.name] = [];
        dept.doctors.forEach((doc) => {
          if (!doctorMap[dept.name].some((d) => d.id === doc.id)) {
            doctorMap[dept.name].push(doc);
          }
        });
      });
    });

    // Flatten thành array để dễ xử lý
    const result = [];
    for (let deptName in doctorMap) {
      doctorMap[deptName].forEach((doc) => {
        if (!result.find((r) => r.id === doc.id)) {
          result.push({ ...doc.toJSON(), departments: [{ name: deptName }] });
        }
      });
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi lấy bác sĩ của gói:", err);
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách bác sĩ", error: err.message });
  }
};

// ✅ 2. Các hàm controller khác
const createPackage = async (req, res) => {
  try {
    const newPackage = await servicePackageService.create(req.body);
    res.status(201).json({
      message: "Tạo gói khám thành công",
      package: newPackage,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo gói khám", error: err.message });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await servicePackageService.getAll();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

const getPackageBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const pkg = await servicePackageService.getBySlug(slug);
    if (!pkg)
      return res.status(404).json({ message: "Không tìm thấy gói dịch vụ" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: "Lỗi", error: err.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    await servicePackageService.update(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    await servicePackageService.remove(id);
    res.json({ message: "Xoá gói khám thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

const assignServicesToPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { services } = req.body;

    if (!Array.isArray(services)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    await servicePackageService.assignServices(id, services);
    res.json({ message: "Gán dịch vụ thành công vào gói khám" });
  } catch (err) {
    console.error("❌ Gán dịch vụ thất bại:", err);
    res.status(500).json({
      message: "Lỗi khi gán dịch vụ",
      error: err.message,
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const pkg = await servicePackageService.getById(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Không tìm thấy gói" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: "Lỗi", error: err.message });
  }
};

// ✅ Export tất cả hàm controller
module.exports = {
  createPackage,
  getAllPackages,
  getPackageBySlug,
  updatePackage,
  deletePackage,
  assignServicesToPackage,
  getPackageById,
  getDoctorsOfPackage, // ✅ cần có dòng này
};
