// src/models/ccls_result.js
module.exports = (sequelize, DataTypes) => {
  const CclsResult = sequelize.define(
    "CclsResult",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // FK tới yêu cầu CLS
      ccls_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Mô tả chi tiết (mô tả phim, mô tả hình ảnh, mô tả xét nghiệm...)
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      // Kết luận chuyên môn
      conclusion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      // Đường dẫn file kết quả (ảnh, pdf...)
      file_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "ccls_results",
      underscored: true,
    }
  );

  CclsResult.associate = (models) => {
    CclsResult.belongsTo(models.CclsRequest, {
      foreignKey: "ccls_request_id",
      as: "request",
    });
    CclsResult.belongsTo(models.Doctor, {
      foreignKey: "doctor_id",
      as: "doctor",
    });
  };

  return CclsResult;
};
