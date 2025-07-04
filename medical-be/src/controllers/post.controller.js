const db = require("../models");
const slugify = require("slugify");

const getAllPosts = async (req, res) => {
  const posts = await db.Post.findAll({
    include: [
      { model: db.User, as: "author", attributes: ["id", "name", "email"] },
      { model: db.PostCategory, as: "category", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(posts);
};

const getPostById = async (req, res) => {
  const post = await db.Post.findByPk(req.params.id, {
    include: [
      { model: db.User, as: "author", attributes: ["id", "name"] },
      { model: db.PostCategory, as: "category", attributes: ["id", "name"] },
    ],
  });
  if (!post)
    return res.status(404).json({ message: "Không tìm thấy bài viết" });
  res.json(post);
};

const createPost = async (req, res) => {
  try {
    const { title, content, post_category_id, summary, image_url } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const newPost = await db.Post.create({
      title,
      slug,
      content,
      post_category_id,
      summary,
      image_url,
      userId: req.user.id,
      status: "pending",
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Lỗi tạo bài viết:", err);
    res.status(500).json({ message: "Lỗi server khi tạo bài viết" });
  }
};

const updatePost = async (req, res) => {
  await db.Post.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Đã cập nhật bài viết" });
};

const deletePost = async (req, res) => {
  await db.Post.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xoá bài viết" });
};

const updatePostStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" | "rejected"

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  const post = await db.Post.findByPk(id);
  if (!post)
    return res.status(404).json({ message: "Không tìm thấy bài viết" });

  post.status = status;
  await post.save();

  res.json({ message: `Đã cập nhật trạng thái bài viết: ${status}` });
};

const getPendingPosts = async (req, res) => {
  try {
    const posts = await db.Post.findAll({
      where: { status: "pending" },
      include: [
        { model: db.User, as: "author", attributes: ["id", "name", "email"] },
        { model: db.PostCategory, as: "category", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách bài viết chờ duyệt:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách pending" });
  }
};

const getPostsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await db.PostCategory.findOne({ where: { slug } });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    const posts = await db.Post.findAll({
      where: {
        post_category_id: category.id,
        status: "approved",
      },
      include: [
        { model: db.User, as: "author", attributes: ["id", "name"] },
        {
          model: db.PostCategory,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(posts);
  } catch (error) {
    console.error("❌ Lỗi khi lấy bài viết theo danh mục:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  updatePostStatus,
  getPendingPosts,
  getPostsByCategorySlug,
};
