const departmentService = require("../services/department.service");
const db = require("../models");
const Department = db.Department;
const Service = db.Service;
const Doctor = db.Doctor;

const getDoctorsOfDepartment = async (req, res) => {
  try {
    const department = await db.Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Không tìm thấy chuyên khoa" });
    }

    const doctors = await department.getDoctors({
      include: [
        {
          model: db.User,
          required: true,
          where: { status: "approved" },
          attributes: ["id", "email", "name", "status"],
        },
      ],
    });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi lấy danh sách bác sĩ của chuyên khoa",
      error: err.message,
    });
  }
};

// Gán lại danh sách dịch vụ cho chuyên khoa
const setServices = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) {
      return res.status(404).json({ message: "Không tìm thấy chuyên khoa" });
    }
    await dept.setServices(req.body.serviceIds); // array of serviceId
    res.json({ message: "Đã cập nhật dịch vụ cho chuyên khoa." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật dịch vụ", error: err.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const list = await departmentService.getAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

const getDepartmentBySlug = async (req, res) => {
  try {
    const dept = await departmentService.getBySlug(req.params.slug);
    if (!dept)
      return res.status(404).json({ message: "Không tìm thấy chuyên khoa" });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: "Lỗi chi tiết", error: err.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const dept = await departmentService.create(req.body);
    res
      .status(201)
      .json({ message: "Tạo chuyên khoa thành công", department: dept });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo", error: err.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    await departmentService.update(req.params.id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    await departmentService.remove(req.params.id);
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

const getServicesOfDepartment = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id, {
      include: [{ model: Service, as: "services" }],
    });
    if (!dept)
      return res.status(404).json({ message: "Không tìm thấy chuyên khoa" });
    res.json(dept.services);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy dịch vụ", error: err.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  setServices,
  getDoctorsOfDepartment,
  getServicesOfDepartment,
};
