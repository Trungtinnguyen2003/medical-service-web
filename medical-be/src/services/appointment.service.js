const db = require("../models");
const Appointment = db.Appointment;

const create = async (data) => {
  return await Appointment.create(data);
};

const getAll = async () => {
  return await Appointment.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      { model: db.Doctor, attributes: ["id", "name"] },
      { model: db.Department, attributes: ["id", "name"] },
      { model: db.Service, attributes: ["id", "name"] },
      { model: db.ServicePackage, attributes: ["id", "title"] },
      { model: db.User, attributes: ["id", "name", "email"] },
    ],
  });
};

const getById = async (id) => {
  return await Appointment.findByPk(id, {
    include: [
      { model: db.Doctor, attributes: ["id", "name"] },
      { model: db.Department, attributes: ["id", "name"] },
    ],
  });
};

const updateStatus = async (id, status) => {
  console.log("🛠 Cập nhật status:", id, status);
  const [affected] = await Appointment.update({ status }, { where: { id } });
  if (affected === 0) throw new Error("Không tìm thấy lịch hẹn");
};

const remove = async (id) => {
  const deleted = await Appointment.destroy({ where: { id } });
  if (!deleted) throw new Error("Không tìm thấy lịch hẹn để xoá");
};

module.exports = {
  create,
  getAll,
  getById,
  updateStatus,
  remove,
};
