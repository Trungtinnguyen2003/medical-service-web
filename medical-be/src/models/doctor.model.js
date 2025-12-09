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
      allowNull: true,
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
    clinic_room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Doctor.associate = (models) => {
    Doctor.belongsTo(models.ClinicRoom, {
      foreignKey: "clinic_room_id",
      as: "clinicRoom",
    });
    Doctor.hasMany(models.DoctorSchedule, {
      foreignKey: "doctor_id",
      as: "schedules",
    });
    Doctor.hasMany(models.CclsResult, {
      foreignKey: "doctor_id",
      as: "cclsResults",
    });
  };

  return Doctor;
};
