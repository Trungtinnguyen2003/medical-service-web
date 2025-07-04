import React, { useEffect, useState } from "react";
import axios from "axios";

const initialCategory = {
  name: "",
  slug: "",
  description: "",
};

const PostCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialCategory);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/post-categories");
    setCategories(res.data);
  };

  const handleOpenAdd = () => {
    setFormData(initialCategory);
    setEditingId(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setFormData(category);
    setEditingId(category.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá danh mục này?")) {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/post-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    if (isEditing) {
      await axios.put(
        `http://localhost:5000/post-categories/${editingId}`,
        formData,
        { headers }
      );
      alert("✅ Đã cập nhật danh mục.");
    } else {
      await axios.post("http://localhost:5000/post-categories", formData, {
        headers,
      });
      alert("✅ Đã thêm danh mục.");
    }

    setShowForm(false);
    fetchCategories();
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>Quản lý Danh mục Tin tức</h2>
      <button onClick={handleOpenAdd}>➕ Thêm danh mục</button>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm danh mục..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ width: "50%", padding: 6, margin: "20px 0" }}
      />

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Tên danh mục</th>
            <th>Slug</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c.description?.slice(0, 100)}...</td>
              <td>
                <button onClick={() => handleEdit(c)}>Sửa</button>{" "}
                <button onClick={() => handleDelete(c.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={{ marginTop: 30, padding: 20, border: "1px solid #ccc" }}>
          <h3>{isEditing ? "🛠 Sửa danh mục" : "➕ Thêm danh mục"}</h3>

          {["name", "slug", "description"].map((field) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ width: 120, display: "inline-block" }}>
                {field === "name"
                  ? "Tên danh mục"
                  : field === "slug"
                  ? "Slug"
                  : "Mô tả"}
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  rows={4}
                  style={{ width: "60%" }}
                  value={formData[field] || ""}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  style={{ width: "60%" }}
                  value={formData[field] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}

          <button onClick={handleSubmit}>
            {isEditing ? "Lưu thay đổi" : "Thêm mới"}
          </button>
          <button onClick={() => setShowForm(false)} style={{ marginLeft: 10 }}>
            Huỷ
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCategoryManager;
