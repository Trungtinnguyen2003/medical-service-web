// src/models/patient_profile.model.js
module.exports = (sequelize, DataTypes) => {
  const PatientProfile = sequelize.define(
    "PatientProfile",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // 🆕 Nghề nghiệp
      job: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // 🆕 Loại giấy tờ (CCCD/CMND/Passport)
      id_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // 🆕 Mã số định danh
      id_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // 🆕 Quốc gia
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // 🆕 Dân tộc
      ethnicity: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // 🆕 Địa chỉ
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      relationship: {
        type: DataTypes.STRING,
        defaultValue: "self",
      },
    },
    {
      tableName: "patient_profiles",
      timestamps: true,
    }
  );

  return PatientProfile;
};
