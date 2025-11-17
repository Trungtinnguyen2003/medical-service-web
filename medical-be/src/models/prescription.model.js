module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define("Prescription", {
    note: {
      type: DataTypes.TEXT,
    },
  });

  Prescription.associate = (models) => {
    Prescription.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
    });
    Prescription.belongsTo(models.User, {
      as: "doctor",
      foreignKey: "doctor_id",
    });
    // Prescription.hasMany(models.PrescriptionItem, {
    //   foreignKey: "prescription_id",
    //   as: "items",
    //   onDelete: "CASCADE",
    // });
  };

  return Prescription;
};
