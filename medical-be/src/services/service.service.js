const db = require("../models");
const Service = db.Service;

const getAll = async () => {
  return await Service.findAll({
    include: ["departments"], // đảm bảo lấy cả chuyên khoa liên kết
  });
};

const getById = async (id) => {
  return await Service.findByPk(id, {
    include: ["departments"],
  });
};

const create = async (data) => {
  return await Service.create(data); // ✅ tạo mới dịch vụ
};

const update = async (id, data) => {
  const updated = await Service.update(data, { where: { id } });
  if (updated[0] === 0) throw new Error("Không tìm thấy để cập nhật");
};

const remove = async (id) => {
  const deleted = await Service.destroy({ where: { id } });
  if (!deleted) throw new Error("Không tìm thấy để xoá");
};

module.exports = { getAll, getById, create, update, remove };
