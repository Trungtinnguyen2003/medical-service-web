// src/config/db.config.js

const { Sequelize } = require("sequelize");
require("dotenv").config(); // Đọc biến môi trường từ .env

const sequelize = new Sequelize(
  process.env.DB_NAME, // Tên database
  process.env.DB_USER, // Tài khoản
  process.env.DB_PASSWORD, // Mật khẩu
  {
    host: process.env.DB_HOST, // Máy chủ
    dialect: "mysql", // Loại cơ sở dữ liệu
    port: process.env.DB_PORT,
    logging: false, // Tắt log câu lệnh SQL
  }
);

module.exports = sequelize;
