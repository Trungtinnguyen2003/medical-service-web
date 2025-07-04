// models/service.model.js

module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define("service", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    detail: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    appliesTo: {
      type: DataTypes.JSON,
      // allowNull: true,
      defaultValue: [],
    },
    slug: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER, // giá mặc định áp dụng chung
      allowNull: true,
    },
  });

  return Service;
};
