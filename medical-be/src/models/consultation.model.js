// src/models/consultation.model.js
module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define("Consultation", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "answered"),
      defaultValue: "pending",
    },
    answer: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  });

  Consultation.associate = (models) => {
    Consultation.belongsTo(models.User, {
      as: "patient",
      foreignKey: "user_id",
    });
    Consultation.belongsTo(models.Doctor, {
      as: "doctor",
      foreignKey: "doctor_id",
    });
    Consultation.belongsTo(models.Department, {
      as: "department",
      foreignKey: "department_id",
    });
    Consultation.belongsTo(models.Doctor, {
      as: "answeredBy",
      foreignKey: "answered_by",
    });
  };

  return Consultation;
};
