module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    "ChatMessage",
    {
      chat_id: { type: DataTypes.INTEGER, allowNull: false },
      sender_id: { type: DataTypes.INTEGER, allowNull: true }, // id user gửi
      sender_role: {
        type: DataTypes.ENUM("user", "consultant", "doctor", "system"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT("long"), // hỗ trợ tin nhắn dài / HTML (nếu cần)
        allowNull: false,
      },
    },
    {
      tableName: "chat_messages",
      timestamps: true,
    }
  );

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.ChatSession, {
      foreignKey: "chat_id",
      as: "session",
    });
    ChatMessage.belongsTo(models.User, {
      foreignKey: "sender_id",
      as: "sender",
    });
  };

  return ChatMessage;
};
