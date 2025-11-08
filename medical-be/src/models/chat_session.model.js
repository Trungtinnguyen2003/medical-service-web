module.exports = (sequelize, DataTypes) => {
  const ChatSession = sequelize.define(
    "ChatSession",
    {
      // ai tạo phiên chat (bệnh nhân)
      patient_id: { type: DataTypes.INTEGER, allowNull: false },

      // tư vấn viên đang phụ trách (có thể null khi pending)
      consultant_id: { type: DataTypes.INTEGER, allowNull: true },

      // bác sĩ được gán (có thể null)
      doctor_id: { type: DataTypes.INTEGER, allowNull: true },

      department_id: { type: DataTypes.INTEGER, allowNull: true },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "active",
          "assigned",
          "transferred",
          "closed"
        ),
        defaultValue: "pending",
      },

      started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      closed_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "chat_sessions",
      timestamps: true,
    }
  );

  ChatSession.associate = (models) => {
    // Nếu bạn có model User: tham chiếu soft (không bắt buộc FK cứng)
    ChatSession.belongsTo(models.User, {
      foreignKey: "patient_id",
      as: "patient",
    });
    ChatSession.belongsTo(models.User, {
      foreignKey: "consultant_id",
      as: "consultant",
    });
    ChatSession.belongsTo(models.User, {
      foreignKey: "doctor_id",
      as: "doctor",
    });
    // Nếu bạn có model Department
    ChatSession.belongsTo(models.Department, {
      foreignKey: "department_id",
      as: "department",
    });

    // Quan hệ 1-n messages
    ChatSession.hasMany(models.ChatMessage, {
      foreignKey: "chat_id",
      as: "messages",
      onDelete: "CASCADE",
    });
  };

  return ChatSession;
};
