// src/components/Doctor/DoctorPostForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const DoctorPostForm = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [newPost, setNewPost] = useState(null); // 🌟 post vừa tạo

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/post-categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let image_url = "";
      if (imageFile) {
        const form = new FormData();
        form.append("avatar", imageFile);
        const res = await axios.post("http://localhost:5000/api/upload/image", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        image_url = res.data.url;
      }

      const res = await axios.post(
        "http://localhost:5000/posts",
        {
          title,
          summary,
          image_url,
          content,
          post_category_id: categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("📝 Bài viết đã được gửi chờ duyệt!");
      setNewPost(res.data); // lưu lại post vừa tạo
      setTitle("");
      setSummary("");
      setImageFile(null);
      setImagePreview(null);
      setContent("");
      setCategoryId("");
    } catch (err) {
      console.error("Lỗi khi gửi bài:", err);
      alert("Gửi bài viết thất bại!");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
     <h2 style={{ marginTop: "30px" }}>🩺 Đăng bài viết mới</h2>
      <form onSubmit={handleSubmit}>
        <label>Tiêu đề:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Mô tả ngắn:</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>Ảnh đại diện:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
        {imagePreview && (
          <div style={{ margin: "10px 0" }}>
            <img src={imagePreview} alt="Preview" width="150" />
          </div>
        )}

        <label>Danh mục bài viết:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Nội dung chi tiết:</label>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => {
            setContent(editor.getData());
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#6b21a8",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Gửi bài viết
        </button>
      </form>

      {newPost && (
        <div
          style={{
            marginTop: 40,
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 12,
            background: "#f9fafb",
          }}
        >
          <h3>✅ Bài viết vừa gửi</h3>
          <p><strong>Tiêu đề:</strong> {newPost.title}</p>
          <p><strong>Trạng thái:</strong> {newPost.status}</p>
          <p><strong>Slug:</strong> {newPost.slug}</p>
          {newPost.image_url && (
  <img
    src={`http://localhost:5000${newPost.image_url}`}
    alt="Ảnh bài"
    width="200"
    style={{ borderRadius: 8, marginTop: 8 }}
  />
)}

          <div style={{ marginTop: 10 }} dangerouslySetInnerHTML={{ __html: newPost.content }} />
        </div>
      )}
    </div>
  );
};

export default DoctorPostForm;
