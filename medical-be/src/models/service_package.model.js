// src/models/service_package.model.js

module.exports = (sequelize, DataTypes) => {
  const ServicePackage = sequelize.define("service_package", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    detail: {
      type: DataTypes.TEXT,
    },
    benefits: {
      type: DataTypes.TEXT,
    },
    precautions: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    price_json: {
      type: DataTypes.JSON, // dùng object như: { m_u60: 9900000, fm_u60: 12500000, ... }
    },
  });

  return ServicePackage;
};
