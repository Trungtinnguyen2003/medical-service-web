"use strict";

module.exports = (sequelize, DataTypes) => {
  const PaymentTransaction = sequelize.define(
    "PaymentTransaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: DataTypes.INTEGER,

      service_id: DataTypes.INTEGER,
      package_id: DataTypes.INTEGER,
      doctor_id: DataTypes.INTEGER,

      // ⭐ PHẢI THÊM 3 FIELD NÀY
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      patient_profile_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      clinic_room_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      appointment_date: DataTypes.DATEONLY,
      slot_id: DataTypes.INTEGER,

      amount: DataTypes.INTEGER,

      method: DataTypes.ENUM("vnpay", "momo", "paypal"),

      status: {
        type: DataTypes.ENUM("initiated", "paid", "failed", "canceled"),
        defaultValue: "initiated",
      },
      flow_type: {
        type: DataTypes.STRING,
        allowNull: true, // "doctor" hoặc "department"
      },

      transaction_no: DataTypes.STRING,
      gateway_order_id: DataTypes.STRING,
      gateway_response: DataTypes.TEXT,
    },
    {
      tableName: "payment_transactions",
    }
  );

  PaymentTransaction.associate = (models) => {
    PaymentTransaction.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "transactionUser",
    });

    PaymentTransaction.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "transactionService",
    });

    PaymentTransaction.belongsTo(models.ServicePackage, {
      foreignKey: "package_id",
      as: "transactionPackage",
    });

    PaymentTransaction.belongsTo(models.Doctor, {
      foreignKey: "doctor_id",
      as: "transactionDoctor",
    });

    PaymentTransaction.hasOne(models.Appointment, {
      foreignKey: "payment_transaction_id",
      as: "transactionAppointment",
    });

    PaymentTransaction.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "transactionDepartment",
    });

    PaymentTransaction.belongsTo(models.PatientProfile, {
      foreignKey: "patient_profile_id",
      as: "transactionProfile",
    });
  };

  return PaymentTransaction;
};
