// src/models/post_category.model.js
module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define("post_category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  return PostCategory;
};
