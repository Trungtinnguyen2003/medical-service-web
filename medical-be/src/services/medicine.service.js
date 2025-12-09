const db = require("../models");
const Medicine = db.Medicine;


const getAll = async () => {
  return await Medicine.findAll({ order: [["name", "ASC"]] });
};

const getById = async (id) => {
  return await Medicine.findByPk(id);
};

const create = async (data) => {
  return await Medicine.create(data);
};

const update = async (id, data) => {
  const [affected] = await Medicine.update(data, { where: { id } });
  if (affected === 0) throw new Error("Không tìm thấy thuốc để cập nhật");
};

const remove = async (id) => {
  const deleted = await Medicine.destroy({ where: { id } });
  if (!deleted) throw new Error("Không tìm thấy thuốc để xoá");
};

module.exports = { getAll, getById, create, update, remove };
