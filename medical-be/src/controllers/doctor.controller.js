const db = require("../models");
const Doctor = db.Doctor;
const Department = db.Department;
const { generateUniqueSlug } = require("../utils/slugify");

const doctorService = require("../services/doctor.service");

const getAllDoctors = async (req, res) => {
  try {
    const result = await doctorService.getAll();

    // ✅ Chỉ lọc những bác sĩ có user.status = "approved"
    const approvedDoctors = result.filter(
      (doc) => doc.user && doc.user.status === "approved"
    );

    res.json(approvedDoctors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách bác sĩ", error: err.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorService.getById(req.params.id);
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Lỗi", error: err.message });
  }
};

const createDoctor = async (req, res) => {
  try {
    const { departmentIds = [], serviceIds = [], ...doctorData } = req.body;

    if (!doctorData.name)
      return res.status(400).json({ message: "Thiếu tên bác sĩ" });

    // Tự sinh slug
    doctorData.slug = await generateUniqueSlug(doctorData.name, Doctor);

    const newDoctor = await doctorService.create(doctorData);

    if (Array.isArray(departmentIds)) {
      await newDoctor.setDepartments(departmentIds);
    }

    if (Array.isArray(serviceIds)) {
      await newDoctor.setServices(serviceIds);
    }

    res
      .status(201)
      .json({ message: "Tạo bác sĩ thành công", doctor: newDoctor });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo bác sĩ", error: err.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { departmentIds = [], serviceIds = [], ...doctorData } = req.body;

    const doctor = await doctorService.update(req.params.id, doctorData);
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });

    if (Array.isArray(departmentIds)) {
      await doctor.setDepartments(departmentIds);
    }

    if (Array.isArray(serviceIds)) {
      await doctor.setServices(serviceIds);
    }

    res.json({ message: "Cập nhật bác sĩ thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const success = await doctorService.remove(req.params.id);
    if (!success)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json({ message: "Xoá bác sĩ thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

const setDepartments = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });

    const { departmentIds } = req.body;
    if (!Array.isArray(departmentIds)) {
      return res
        .status(400)
        .json({ message: "Dữ liệu chuyên khoa phải là mảng" });
    }

    await doctor.setDepartments(departmentIds);
    res.json({ message: "Đã cập nhật chuyên khoa cho bác sĩ." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật chuyên khoa", error: err.message });
  }
};

const getDepartmentsOfDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: Department, as: "departments" }],
    });
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json(doctor.departments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy chuyên khoa", error: err.message });
  }
};

// Lấy thông tin bác sĩ theo user_id
const getDoctorByUserId = async (req, res) => {
  try {
    const doctor = await db.Doctor.findOne({
      where: { user_id: req.params.userId },
      include: [
        {
          model: db.Department,
          as: "departments",
          through: { attributes: [] },
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Lỗi getDoctorByUserId:", err);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Lấy danh sách bác sĩ theo khoa (chỉ hiện đã phê duyệt)
// controller: doctor.controller.js
const getDoctorsByDepartment = async (req, res) => {
  try {
    const department = await db.Department.findByPk(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Không tìm thấy chuyên khoa" });

    const doctors = await department.getDoctors({
      include: [
        {
          model: db.User,
          required: true, // 🔴 Bắt buộc phải join được user
          where: { status: "approved" }, // 🔴 Chỉ lấy bác sĩ có user được duyệt
          attributes: ["id", "email", "name", "status"],
        },
      ],
    });

    res.json(doctors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách bác sĩ", error: err.message });
  }
};

// Gán danh sách dịch vụ cho bác sĩ
const setServices = async (req, res) => {
  try {
    const doctor = await db.Doctor.findByPk(req.params.id);
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });

    const { serviceIds } = req.body;
    if (!Array.isArray(serviceIds)) {
      return res
        .status(400)
        .json({ message: "Danh sách dịch vụ không hợp lệ" });
    }

    await doctor.setServices(serviceIds);
    res.json({ message: "Đã cập nhật dịch vụ cho bác sĩ." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật dịch vụ", error: err.message });
  }
};

const getServicesOfDoctor = async (req, res) => {
  try {
    const doctor = await db.Doctor.findByPk(req.params.id, {
      include: [
        {
          model: db.Service,
          as: "services",
          include: [
            {
              model: db.Department,
              as: "departments", // ✅ cần dòng này
              through: { attributes: [] },
            },
          ],
          through: { attributes: [] },
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    }

    res.json(doctor.services);
  } catch (err) {
    console.error("Lỗi getServicesOfDoctor:", err);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// ✅ Lấy danh sách bác sĩ thực hiện một dịch vụ
const getDoctorsByService = async (req, res) => {
  try {
    const service = await db.Service.findByPk(req.params.id, {
      include: [
        {
          model: db.Doctor,
          as: "doctors",
          include: [
            {
              model: db.User,
              required: true,
              where: { status: "approved" },
              attributes: ["id", "name", "email", "status"],
            },
          ],
          through: { attributes: [] },
        },
      ],
    });

    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    res.json(service.doctors);
  } catch (err) {
    console.error("Lỗi getDoctorsByService:", err);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  setDepartments,
  getDepartmentsOfDoctor,
  getDoctorByUserId,
  getDoctorsByDepartment,
  setServices,
  getServicesOfDoctor,
  getDoctorsByService,
};
