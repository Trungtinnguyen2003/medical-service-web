// src/controllers/auth.controller.js
const db = require("../models");
const User = db.User;
const authService = require("../services/auth.service");
const bcrypt = require("bcryptjs");

const registerDoctor = async (req, res) => {
  try {
    // ⚠️ Fix Object: null prototype
    const cleanBody = JSON.parse(JSON.stringify(req.body));

    console.log("📥 Body nhận được:", cleanBody);

    const {
      name,
      email,
      password,
      title,
      degree,
      position,
      phone,
      experience_years,
      work_history,
      education_history,
      extra_info,
      display_name,
    } = cleanBody;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email đã được sử dụng bởi tài khoản khác." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      status: "pending",
    });

    const avatarPath = req.file ? "/uploads/" + req.file.filename : "";

    try {
      const createdDoctor = await db.Doctor.create({
        user_id: user.id,
        name: display_name || name,
        title,
        degree,
        position,
        phone,
        experience_years,
        work_history,
        education_history,
        extra_info,
        avatar: avatarPath,
      });

      console.log("✅ Tạo bản ghi Doctor thành công:", createdDoctor.id);
    } catch (err) {
      console.error("❌ Lỗi khi tạo bản ghi Doctor:", err);

      // rollback user nếu tạo doctor thất bại
      await user.destroy();
      return res
        .status(500)
        .json({ message: "Lỗi khi lưu thông tin bác sĩ. Vui lòng thử lại." });
    }

    res
      .status(201)
      .json({ message: "Đăng ký bác sĩ thành công. Chờ admin phê duyệt." });
  } catch (err) {
    console.error("❌ Lỗi đăng ký bác sĩ:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err); // ✅ log ra terminal
    res.status(500).json({ message: "Lỗi đăng ký", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(401).json({ message: err.message }); // ✨ Lấy đúng nội dung từ service
  }
};

const profile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy thông tin user", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated = await authService.updateProfile(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Upload thất bại", error: err.message });
  }
};

// 👉 Đăng ký tư vấn viên
const createConsultantAccount = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email đã được sử dụng bởi tài khoản khác." });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "consultant",
      status: "approved", // ✅ Có thể để pending nếu muốn duyệt thủ công
    });

    res.status(201).json({ message: "Đăng ký tư vấn viên thành công" });
  } catch (err) {
    console.error("❌ Lỗi đăng ký tư vấn viên:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  uploadAvatar,
  registerDoctor,
  createConsultantAccount,
};
