module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("appointment", {
    name: DataTypes.STRING,
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

    service_id: DataTypes.INTEGER,
    package_id: DataTypes.INTEGER,
    department_id: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,

    user_id: {
      type: DataTypes.INTEGER,
      field: "userId",
    },

    // ⭐⭐⭐ 3 TRƯỜNG QUAN TRỌNG BỊ THIẾU (PHẢI THÊM)
    patient_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    payment_transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    clinic_room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    doctor_note: DataTypes.TEXT,
  });

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

    Appointment.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "linkedDepartment",
    });

    Appointment.belongsTo(models.PatientProfile, {
      foreignKey: "patient_profile_id",
      as: "patientProfile",
    });

    Appointment.belongsTo(models.PaymentTransaction, {
      foreignKey: "payment_transaction_id",
      as: "paymentTransaction",
    });

    Appointment.belongsTo(models.ClinicRoom, {
      foreignKey: "clinic_room_id",
      as: "clinic_room",
    });
  };

  return Appointment;
};
