// src/models/clinic_room.model.js
module.exports = (sequelize, DataTypes) => {
  const ClinicRoom = sequelize.define(
    "ClinicRoom",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // VD: "PK Thần kinh"
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true, // VD: "P012"
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // phòng có thể gán cho 1 chuyên khoa chính
      },
      floor: {
        type: DataTypes.STRING,
        allowNull: true, // Tầng 2, Lầu 3,...
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: true, // mô tả chi tiết hướng dẫn tìm phòng
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "clinic_rooms",
      timestamps: true,
    }
  );

  ClinicRoom.associate = (models) => {
    ClinicRoom.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "clinicDepartment",
    });

    // 1 phòng có thể có nhiều bác sĩ (nếu sau này cần)
    ClinicRoom.hasMany(models.Doctor, {
      foreignKey: "clinic_room_id",
      as: "clinicDoctors",
    });

    // 1 phòng có thể có nhiều lịch hẹn
    ClinicRoom.hasMany(models.Appointment, {
      foreignKey: "clinic_room_id",
      as: "appointments",
    });
  };

  return ClinicRoom;
};
