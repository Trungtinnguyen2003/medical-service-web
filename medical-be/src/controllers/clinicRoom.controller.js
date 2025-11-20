const db = require("../models");
const ClinicRoom = db.ClinicRoom;

module.exports = {
  async getAll(req, res) {
    try {
      const rooms = await ClinicRoom.findAll({
        include: [
          { model: db.Department, as: "clinicDepartment" },
          { model: db.Doctor, as: "clinicDoctors" },
        ],
        order: [["name", "ASC"]],
      });
      res.json(rooms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi lấy danh sách phòng khám" });
    }
  },

  async getOne(req, res) {
    try {
      const room = await ClinicRoom.findByPk(req.params.id, {
        include: [{ model: db.Department, as: "clinicDepartment" }],
      });
      if (!room)
        return res.status(404).json({ message: "Không tìm thấy phòng khám" });
      res.json(room);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi lấy phòng khám" });
    }
  },

  async create(req, res) {
    try {
      const room = await ClinicRoom.create(req.body);
      res.json({ message: "Tạo phòng khám thành công", room });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi tạo phòng khám" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const room = await ClinicRoom.findByPk(id);
      if (!room)
        return res.status(404).json({ message: "Không tìm thấy phòng khám" });

      await room.update(req.body);
      res.json({ message: "Cập nhật phòng khám thành công", room });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi cập nhật phòng khám" });
    }
  },

  async delete(req, res) {
    try {
      const room = await ClinicRoom.findByPk(req.params.id);
      if (!room)
        return res.status(404).json({ message: "Không tìm thấy phòng khám" });

      await room.destroy();
      res.json({ message: "Xóa phòng khám thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi xóa phòng khám" });
    }
  },
};
