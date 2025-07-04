// src/models/doctor_department.model.js
module.exports = (sequelize, DataTypes) => {
  const DoctorDepartment = sequelize.define(
    "DoctorDepartment",
    {
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      tableName: "doctor_departments", // ⚠️ khớp đúng tên bảng trong DB
    }
  );

  return DoctorDepartment;
};
