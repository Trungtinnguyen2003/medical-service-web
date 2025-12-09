import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFolder,
  FaTimes,
  FaSave,
} from "react-icons/fa";

//
// ===================== PREMIUM MEDICAL BLUE STYLE =====================
//

// Page wrapper
const wrapper = {
  padding: "32px",
  display: "flex",
  justifyContent: "center",
  background: "#f3f6f9", // nền xanh xám nhẹ chuẩn bệnh viện
};

const container = {
  maxWidth: "1200px",
  width: "100%",
};

// Header text
const headerText = {
  fontSize: "32px",
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  gap: 14,
  color: "#2a6c9bff",
};

// Button xanh nhạt
const gradientBtn = {
  padding: "10px 18px",
  borderRadius: 10,
  background: "linear-gradient(135deg, #d9ecff, #3c56b4ff)", // xanh dương chuẩn y tế
  color: "white",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 600,
  boxShadow: "0 6px 16px rgba(37,99,235,0.35)",
  transition: "0.25s",
};

// Cancel button
const cancelBtn = {
  padding: "10px 18px",
  borderRadius: 10,
  background: "#f1f5f9",
  border: "1px solid #cdd5df",
  cursor: "pointer",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#475569",
};

// Search input
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #cfd8e3",
  outline: "none",
  fontSize: 14,
  background: "white",
};

// Table
const tableWrapper = {
  marginTop: 28,
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid #d8e4f0",
  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
};

const thStyle = {
  background: "#d9ecff", // xanh nhạt pastel
  padding: "14px",
  color: "#0b3c60",
  fontWeight: 700,
  textAlign: "left",
  fontSize: 14,
};

const tdStyle = {
  padding: "14px",
  fontSize: 14,
  borderBottom: "1px solid #e8eff6",
  color: "#374151",
};

// Drawer overlay
const drawerOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 9999,
};

// Drawer panel
const drawer = {
  width: "420px",
  height: "100vh",
  background: "white",
  padding: "28px",
  borderTopLeftRadius: "18px",
  borderBottomLeftRadius: "18px",
  borderLeft: "1px solid #cfd8e3",
  boxShadow: "-6px 0 20px rgba(0,0,0,0.12)",
  animation: "slideIn 0.35s ease",
};

const title = {
  fontSize: "22px",
  fontWeight: 800,
  color: "#0b3c60",
  marginBottom: 20,
};

//
// ===================== COMPONENT =====================
//

const PostCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/post-categories");
    setCategories(res.data);
  };

  const openAddForm = () => {
    setFormData({ name: "", slug: "", description: "" });
    setEditingId(null);
    setIsEditing(false);
    setShowDrawer(true);
  };

  const openEditForm = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsEditing(true);
    setShowDrawer(true);
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
      alert("✔️ Đã cập nhật danh mục!");
    } else {
      await axios.post("http://localhost:5000/post-categories", formData, {
        headers,
      });
      alert("✔️ Thêm danh mục thành công!");
    }

    setShowDrawer(false);
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá danh mục này?")) return;

    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:5000/post-categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCategories();
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div style={wrapper}>
      <div style={container}>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div style={headerText}>
            <FaFolder size={26} />
            Danh mục tin tức
          </div>

          <button style={gradientBtn} onClick={openAddForm}>
            <FaPlus /> Thêm danh mục
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-[50%] mb-4">
          <input
            placeholder="Tìm kiếm danh mục..."
            style={{ ...inputStyle, marginTop: 10 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div style={tableWrapper}>
          <table className="w-full">
            <thead>
              <tr>
                <th style={thStyle}>Tên danh mục</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Mô tả</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c, idx) => (
                <tr
                  key={c.id}
                  style={{
                    background: idx % 2 === 0 ? "white" : "#f6fbff",
                  }}
                  className="hover:bg-blue-50 transition"
                >
                  <td style={tdStyle}>{c.name}</td>
                  <td style={tdStyle}>{c.slug}</td>
                  <td style={tdStyle}>{c.description?.slice(0, 80)}...</td>

                  <td style={{ ...tdStyle, display: "flex", gap: 12 }}>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => openEditForm(c)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(c.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Không có danh mục nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= DRAWER FORM ================= */}
        {showDrawer && (
          <div style={drawerOverlay}>
            <div style={drawer}>

              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">
                <div style={title}>
                  {isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </div>

                <button
                  onClick={() => setShowDrawer(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* FORM FIELDS */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-medium">Tên danh mục</label>
                  <input
                    style={inputStyle}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="font-medium">Slug</label>
                  <input
                    style={inputStyle}
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="font-medium">Mô tả</label>
                  <textarea
                    style={{ ...inputStyle, height: 100 }}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button style={gradientBtn} onClick={handleSubmit}>
                  <FaSave /> {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                </button>

                <button style={cancelBtn} onClick={() => setShowDrawer(false)}>
                  <FaTimes /> Huỷ
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostCategoryManager;
