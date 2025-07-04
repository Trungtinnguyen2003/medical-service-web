const userService = require("../services/user.service");
const db = require("../models");
const User = db.User;

const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      include: [{ model: db.Doctor }], // ✅ include Doctor để dùng ở FE
      order: [["createdAt", "DESC"]],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [affected] = await userService.updateUser(id, req.body);
    if (affected === 0)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await userService.deleteUser(id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Đã xoá người dùng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá", error: err.message });
  }
};

const updateDoctorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    user.status = status;
    await user.save();

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await db.User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.status = status;
    await user.save();

    res.json({ message: "Cập nhật trạng thái thành công", user });
  } catch (err) {
    console.error("❌ Lỗi cập nhật trạng thái:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  updateDoctorStatus,
  updateUserStatus,
};
