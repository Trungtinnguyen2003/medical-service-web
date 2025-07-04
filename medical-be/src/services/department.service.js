// src/services/department.service.js
const db = require("../models");
const Department = db.Department;
const Service = db.Service;

const getAll = async () => {
  return await Department.findAll();
};

const getBySlug = async (slug) => {
  return await Department.findOne({
    where: { slug },
    include: [{ model: Service, as: "services" }],
  });
};

const create = async (data) => {
  const exists = await Department.findOne({ where: { slug: data.slug } });
  if (exists) throw new Error("Slug đã tồn tại");
  return await Department.create(data);
};

const update = async (id, data) => {
  const updated = await Department.update(data, { where: { id } });
  if (updated[0] === 0)
    throw new Error("Không tìm thấy chuyên khoa để cập nhật");
};

const remove = async (id) => {
  const deleted = await Department.destroy({ where: { id } });
  if (!deleted) throw new Error("Không tìm thấy chuyên khoa để xoá");
};

module.exports = {
  getAll,
  getBySlug,
  create,
  update,
  remove,
};
