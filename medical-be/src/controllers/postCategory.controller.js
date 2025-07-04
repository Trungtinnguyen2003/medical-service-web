// src/controllers/postCategory.controller.js
const postCategoryService = require("../services/postCategory.service");

const getAllCategories = async (req, res) => {
  try {
    const list = await postCategoryService.getAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const data = await postCategoryService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi chi tiết", error: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = await postCategoryService.create(req.body);
    res.status(201).json({ message: "Tạo thành công", category: data });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo", error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    await postCategoryService.update(req.params.id, req.body);
    res.json({ message: "Đã cập nhật danh mục" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await postCategoryService.remove(req.params.id);
    res.json({ message: "Đã xoá danh mục" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
