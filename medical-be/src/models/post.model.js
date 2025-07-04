// src/models/post.model.js
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    summary: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    content: DataTypes.TEXT("long"),
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  });

  Post.associate = (db) => {
    Post.belongsTo(db.PostCategory, {
      foreignKey: "post_category_id",
      as: "category",
    });
    Post.belongsTo(db.User, { foreignKey: "userId", as: "author" });
  };

  return Post;
};
