const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = db.User;

const register = async ({ name, email, password, phone }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("Email đã tồn tại");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Email không tồn tại");

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) throw new Error("Sai mật khẩu");

  // ✅ Kiểm tra trạng thái bác sĩ
  if (user.role === "doctor") {
    if (user.status === "pending") {
      throw new Error("Tài khoản bác sĩ đang chờ phê duyệt");
    }
    if (user.status === "rejected") {
      throw new Error("Tài khoản bác sĩ đã bị từ chối");
    }
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
  return token;
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  return user;
};

const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("Không tìm thấy người dùng");

  const fields = [
    "name",
    "email",
    "phone",
    "address",
    "date_of_birth",
    "gender",
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  await user.save();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    date_of_birth: user.date_of_birth,
    gender: user.gender,
  };
};

module.exports = { register, login, getProfile, updateProfile };
