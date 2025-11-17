module.exports = (sequelize, DataTypes) => {
  const DoctorSchedule = sequelize.define(
    "DoctorSchedule",
    {
      doctor_id: { type: DataTypes.INTEGER, allowNull: false },
      day_of_week: { type: DataTypes.INTEGER, allowNull: false }, // 1=Mon ... 7=Sun
      session: {
        // morning | afternoon
        type: DataTypes.ENUM("morning", "afternoon"),
        allowNull: false,
      },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: "doctor_schedules" }
  );

  DoctorSchedule.associate = (models) => {
    DoctorSchedule.belongsTo(models.Doctor, {
      foreignKey: "doctor_id",
      as: "doctor",
    });

    DoctorSchedule.belongsToMany(models.TimeSlot, {
      through: "doctor_schedule_slots",
      foreignKey: "schedule_id",
      otherKey: "time_slot_id",
      as: "timeSlots",
    });
  };

  return DoctorSchedule;
};
