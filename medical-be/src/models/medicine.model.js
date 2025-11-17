module.exports = (sequelize, DataTypes) => {
  const Medicine = sequelize.define("Medicine", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    generic_name: {
      type: DataTypes.STRING,
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: "viên",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    manufacturer: {
      type: DataTypes.STRING,
    },
    expiration_date: {
      type: DataTypes.DATE,
    },
    category: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  return Medicine;
};
