const db = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { doctor_id, day_of_week, session, is_active = true } = req.body;
    if (!doctor_id || !day_of_week || !session)
      return res
        .status(400)
        .json({ message: "Thiếu doctor_id / day_of_week / session" });

    const exists = await db.DoctorSchedule.findOne({
      where: { doctor_id, day_of_week, session },
    });
    if (exists) return res.status(409).json({ message: "Lịch này đã tồn tại" });

    const schedule = await db.DoctorSchedule.create({
      doctor_id,
      day_of_week,
      session,
      is_active,
    });
    res.json(schedule);
  } catch (e) {
    res.status(500).json({ message: "Lỗi tạo lịch", error: e.message });
  }
};

const list = async (req, res) => {
  try {
    const { doctor_id } = req.query;
    const where = {};
    if (doctor_id) where.doctor_id = doctor_id;

    const data = await db.DoctorSchedule.findAll({
      where,
      include: [
        { model: db.Doctor, as: "doctor", attributes: ["id", "name"] },
        {
          model: db.TimeSlot,
          as: "timeSlots",
          attributes: ["id", "label", "period"],
        },
      ],
      order: [
        ["day_of_week", "ASC"],
        ["session", "ASC"],
      ],
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: e.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = (({ doctor_id, day_of_week, session, is_active }) => ({
      doctor_id,
      day_of_week,
      session,
      is_active,
    }))(req.body);

    await db.DoctorSchedule.update(payload, { where: { id } });
    const schedule = await db.DoctorSchedule.findByPk(id, {
      include: [{ model: db.TimeSlot, as: "timeSlots" }],
    });
    res.json(schedule);
  } catch (e) {
    res.status(500).json({ message: "Lỗi cập nhật", error: e.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await db.DoctorSchedule.destroy({ where: { id } });
    res.json({ message: "Đã xoá" });
  } catch (e) {
    res.status(500).json({ message: "Lỗi xoá", error: e.message });
  }
};

// Gán danh sách timeSlot cho 1 schedule
const setSlots = async (req, res) => {
  try {
    const { id } = req.params; // schedule_id
    const { timeSlotIds } = req.body; // [1,2,3]
    const schedule = await db.DoctorSchedule.findByPk(id);
    if (!schedule)
      return res.status(404).json({ message: "Không tìm thấy schedule" });

    const slots = await db.TimeSlot.findAll({
      where: { id: { [Op.in]: timeSlotIds || [] } },
    });
    await schedule.setTimeSlots(slots); // replace all
    const reload = await db.DoctorSchedule.findByPk(id, {
      include: [{ model: db.TimeSlot, as: "timeSlots" }],
    });
    res.json(reload);
  } catch (e) {
    res.status(500).json({ message: "Lỗi gán khung giờ", error: e.message });
  }
};

module.exports = { create, list, update, remove, setSlots };
