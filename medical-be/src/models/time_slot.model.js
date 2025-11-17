module.exports = (sequelize, DataTypes) => {
  const TimeSlot = sequelize.define(
    "TimeSlot",
    {
      label: { type: DataTypes.STRING, allowNull: false }, // "07:30 - 08:30"
      start_time: { type: DataTypes.TIME, allowNull: false }, // "07:30:00"
      end_time: { type: DataTypes.TIME, allowNull: false }, // "08:30:00"
      period: {
        // morning | afternoon
        type: DataTypes.ENUM("morning", "afternoon"),
        allowNull: false,
      },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: "time_slots" }
  );

  TimeSlot.associate = (models) => {
    TimeSlot.belongsToMany(models.DoctorSchedule, {
      through: "doctor_schedule_slots",
      foreignKey: "time_slot_id",
      otherKey: "schedule_id",
      as: "schedules",
    });
  };

  return TimeSlot;
};
