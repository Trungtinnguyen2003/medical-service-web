const db = require("../models");
const serviceService = require("../services/service.service");
const Service = db.Service;
const Department = db.Department;
const { generateUniqueSlug } = require("../utils/slugify");

const getAllServices = async (req, res) => {
  try {
    const list = await Service.findAll({
      include: [
        { model: Department, as: "departments", attributes: ["id", "name"] },
      ],
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Lỗi", error: err.message });
  }
};

const createService = async (req, res) => {
  try {
    console.log("📦 Payload nhận được:", req.body);

    const { departmentIds = [], ...data } = req.body;

    if (!data.title)
      return res.status(400).json({ message: "Thiếu tiêu đề dịch vụ" });

    // ✅ Làm sạch slug nếu có
    data.slug = data.slug?.trim();

    if (!data.slug) {
      // ✅ Nếu không có slug → tự sinh từ title
      data.slug = await generateUniqueSlug(data.title, Service);
    } else {
      // ✅ Nếu có slug → kiểm tra trùng
      const exists = await Service.findOne({ where: { slug: data.slug } });
      if (exists) return res.status(400).json({ message: "Slug đã tồn tại." });
    }

    // ✅ Tạo dịch vụ
    const newService = await serviceService.create(data);

    // ✅ Gán chuyên khoa nếu có
    if (Array.isArray(departmentIds)) {
      await newService.setDepartments(departmentIds);
    }

    res.status(201).json({
      message: "Tạo dịch vụ thành công",
      service: newService,
    });
  } catch (err) {
    console.error("❌ Lỗi tạo dịch vụ:", err);
    res.status(500).json({ message: "Lỗi tạo dịch vụ", error: err.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { departmentIds = [], ...data } = req.body;

    const updated = await serviceService.update(req.params.id, data);
    const service = await Service.findByPk(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });

    if (Array.isArray(departmentIds)) {
      await service.setDepartments(departmentIds);
    }

    res.json({ message: "Cập nhật dịch vụ thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await serviceService.remove(req.params.id);
    res.json({ message: "Xoá dịch vụ thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

const setDepartments = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });

    const { departmentIds } = req.body;
    if (!Array.isArray(departmentIds)) {
      return res
        .status(400)
        .json({ message: "Dữ liệu chuyên khoa phải là mảng" });
    }

    await service.setDepartments(departmentIds);
    res.json({ message: "Cập nhật chuyên khoa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const getDepartmentsOfService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{ model: Department, as: "departments" }],
    });
    if (!service)
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    res.json(service.departments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách khoa", error: err.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  setDepartments,
  getDepartmentsOfService,
};
