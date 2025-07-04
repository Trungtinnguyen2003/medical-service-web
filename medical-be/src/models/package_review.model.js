// src/models/package_review.model.js

module.exports = (sequelize, DataTypes) => {
  const PackageReview = sequelize.define("package_review", {
    name: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
  });

  return PackageReview;
};
