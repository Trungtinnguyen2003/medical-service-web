module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("appointment", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.ENUM("Nam", "Nữ", "Khác"),
    date_of_birth: DataTypes.DATEONLY,
    address: DataTypes.STRING,
    appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    appointment_time: DataTypes.STRING,
    symptoms: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "done"),
      defaultValue: "pending",
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: "userId",
      allowNull: true,
    },
    doctor_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  // ✅ THÊM ĐOẠN NÀY
  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Doctor, {
      foreignKey: "doctor_id",
      as: "appointedDoctor",
    });

    Appointment.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "patient",
    });

    Appointment.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "bookedService",
    });

    Appointment.belongsTo(models.ServicePackage, {
      foreignKey: "package_id",
      as: "servicePackage",
    });
  };

  return Appointment;
};
