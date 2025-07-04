// src/services/postCategory.service.js
const db = require("../models");
const PostCategory = db.PostCategory;

const getAll = async () => {
  return await PostCategory.findAll({ order: [["createdAt", "DESC"]] });
};

const getById = async (id) => {
  return await PostCategory.findByPk(id);
};

const create = async (data) => {
  const exists = await PostCategory.findOne({ where: { slug: data.slug } });
  if (exists) throw new Error("Slug đã tồn tại");
  return await PostCategory.create(data);
};

const update = async (id, data) => {
  const [affected] = await PostCategory.update(data, { where: { id } });
  if (affected === 0) throw new Error("Không tìm thấy danh mục để cập nhật");
};

const remove = async (id) => {
  const deleted = await PostCategory.destroy({ where: { id } });
  if (!deleted) throw new Error("Không tìm thấy danh mục để xoá");
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
