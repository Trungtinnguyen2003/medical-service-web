const db = require("../models");
const Doctor = db.Doctor;
const Department = db.Department;

const getAll = async () => {
  return await Doctor.findAll({
    include: [
      {
        model: db.Department,
        as: "departments",
        through: { attributes: [] },
      },
      {
        model: db.Service,
        as: "services",
        through: { attributes: [] },
      },
      {
        model: db.User, // thêm quan hệ với user
        attributes: ["id", "email", "status", "name"],
      },
    ],
  });
};

const getById = async (id) => {
  return await Doctor.findByPk(id, {
    include: [
      {
        model: db.Department,
        as: "departments",
        through: { attributes: [] },
      },
      {
        model: db.Service,
        as: "services",
        through: { attributes: [] },
      },
    ],
  });
};

const create = async (data) => {
  return await Doctor.create(data);
};

const update = async (id, data) => {
  const [updated] = await Doctor.update(data, { where: { id } });
  if (updated === 0) throw new Error("Không tìm thấy bác sĩ để cập nhật");
  return await getById(id); // trả về bản ghi sau cập nhật
};

const remove = async (id) => {
  const deleted = await Doctor.destroy({ where: { id } });
  if (!deleted) throw new Error("Không tìm thấy bác sĩ để xoá");
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
