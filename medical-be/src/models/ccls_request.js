// src/models/ccls_request.js
module.exports = (sequelize, DataTypes) => {
  const CclsRequest = sequelize.define(
    "CclsRequest",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // Lịch khám gốc
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Dịch vụ CLS (xét nghiệm, siêu âm, nội soi...)
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Bác sĩ khám ban đầu (ID bác sĩ - bạn có thể dùng doctor_id)
      requested_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Bác sĩ cận lâm sàng được phân công
      assigned_doctor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Ghi chú / lý do chỉ định
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // pending | completed
      status: {
        type: DataTypes.ENUM("pending", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      tableName: "ccls_requests",
      underscored: true,
    }
  );

  CclsRequest.associate = (models) => {
    // 1 yêu cầu thuộc 1 appointment
    CclsRequest.belongsTo(models.Appointment, {
      foreignKey: "appointment_id",
      as: "appointment",
    });

    // 1 yêu cầu thuộc 1 dịch vụ CLS
    CclsRequest.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "service",
    });

    // Bác sĩ khám ban đầu
    CclsRequest.belongsTo(models.Doctor, {
      foreignKey: "requested_by",
      as: "requestDoctor",
    });

    // Bác sĩ cận lâm sàng thực hiện
    CclsRequest.belongsTo(models.Doctor, {
      foreignKey: "assigned_doctor",
      as: "assignedDoctor",
    });

    // Kết quả của yêu cầu này
    CclsRequest.hasOne(models.CclsResult, {
      foreignKey: "ccls_request_id",
      as: "result",
    });
  };

  return CclsRequest;
};
