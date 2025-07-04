// src/models/doctor.model.js

module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define("doctor", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    degree: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    experience_years: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    work_history: {
      type: DataTypes.TEXT,
    },
    education_history: {
      type: DataTypes.TEXT,
    },
    extra_info: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true, // mỗi bác sĩ chỉ gắn với 1 user
    },
  });

  return Doctor;
};
