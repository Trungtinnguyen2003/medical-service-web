// src/models/doctor_review.model.js

module.exports = (sequelize, DataTypes) => {
  const DoctorReview = sequelize.define("doctor_review", {
    name: {
      type: DataTypes.STRING, // tên người đánh giá
    },
    rating: {
      type: DataTypes.INTEGER, // 1 đến 5
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

  return DoctorReview;
};
