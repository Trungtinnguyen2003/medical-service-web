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

      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      email: {
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
