const db = require("../models");
const Appointment = db.Appointment;

const create = async (data) => {
  return await Appointment.create(data);
};

const getAll = async () => {
  try {
    console.log("🔍 appointmentService.getAll() called");
    const result = await Appointment.findAll({
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "gender",
        "date_of_birth",
        "address",
        "appointment_date",
        "appointment_time",
        "symptoms",
        "status",
        // 👇 Thêm các ID gốc để FE có thể lấy
        "department_id",
        "service_id",
        "doctor_id",
      ],
      include: [
        { model: db.Doctor, as: "appointedDoctor", attributes: ["id", "name"] },
        { model: db.Department, as: "department", attributes: ["id", "name"] },
        { model: db.Service, as: "bookedService", attributes: ["id", "title"] },
        {
          model: db.ServicePackage,
          as: "servicePackage",
          attributes: ["id", "name"],
        },
        { model: db.User, as: "patient", attributes: ["id", "name", "email"] },
      ],
    });

    console.log("✅ getAll fetched:", result.length, "appointments");
    return result;
  } catch (err) {
    console.error("🔥 Lỗi trong appointmentService.getAll():", err);
    throw err; // đẩy lỗi ra ngoài để controller bắt được
  }
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
