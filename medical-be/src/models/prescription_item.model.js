module.exports = (sequelize, DataTypes) => {
  const PrescriptionItem = sequelize.define("PrescriptionItem", {
    dosage: {
      type: DataTypes.STRING, // 500mg, 250ml,...
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    frequency: {
      type: DataTypes.STRING, // 2 lần/ngày
    },
    duration: {
      type: DataTypes.STRING, // 5 ngày
    },
    note: {
      type: DataTypes.STRING,
    },
  });

  PrescriptionItem.associate = (models) => {
    PrescriptionItem.belongsTo(models.Prescription, {
      foreignKey: "prescription_id",
    });
    PrescriptionItem.belongsTo(models.Medicine, {
      foreignKey: "medicine_id",
    });
  };

  return PrescriptionItem;
};
