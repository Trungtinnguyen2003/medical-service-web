// src/models/user.model.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: "/uploads/default.png", // hoặc null nếu muốn rỗng ban đầu
    },
    gender: {
      type: DataTypes.ENUM("Nam", "Nữ", "Khác"),
    },
    address: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "doctor"),
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    status_old: {
      type: DataTypes.ENUM("active", "inactive"), // giữ lại nếu muốn
    },
  });

  return User;
};
