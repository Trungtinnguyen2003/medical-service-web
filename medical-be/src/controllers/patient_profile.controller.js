// src/controllers/patient_profile.controller.js

const db = require("../models");
const PatientProfile = db.PatientProfile;

module.exports = {
  // Lấy danh sách hồ sơ user hiện tại
  async getMyProfiles(req, res) {
    try {
      const userId = req.user.id;

      const profiles = await PatientProfile.findAll({
        where: { user_id: userId },
        order: [["createdAt", "DESC"]],
      });

      res.json(profiles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi lấy danh sách hồ sơ" });
    }
  },

  // Tạo hồ sơ mới
  async createProfile(req, res) {
    try {
      const userId = req.user.id;

      const profile = await PatientProfile.create({
        ...req.body,
        user_id: userId,
      });

      res.json({
        message: "Tạo hồ sơ bệnh nhân thành công",
        profile,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi tạo hồ sơ bệnh nhân" });
    }
  },

  // Cập nhật hồ sơ
  async updateProfile(req, res) {
    try {
      const { id } = req.params;

      const profile = await PatientProfile.findByPk(id);
      if (!profile)
        return res.status(404).json({ message: "Không tìm thấy hồ sơ" });

      await profile.update(req.body);

      res.json({
        message: "Cập nhật hồ sơ thành công",
        profile,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi cập nhật hồ sơ" });
    }
  },

  // Xóa hồ sơ
  async deleteProfile(req, res) {
    try {
      const { id } = req.params;

      const profile = await PatientProfile.findByPk(id);
      if (!profile)
        return res.status(404).json({ message: "Không tìm thấy hồ sơ" });

      await profile.destroy();

      res.json({
        message: "Xóa hồ sơ thành công",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi xóa hồ sơ" });
    }
  },
};
