// src/models/blog_post.model.js

module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define("blog_post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING, // ảnh đại diện
    },
    summary: {
      type: DataTypes.TEXT, // mô tả ngắn / trích đoạn
    },
    content: {
      type: DataTypes.TEXT("long"), // nội dung HTML dài
    },
    tags: {
      type: DataTypes.JSON, // mảng tag ["ung thư", "tim mạch"]
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },
  });

  return BlogPost;
};
