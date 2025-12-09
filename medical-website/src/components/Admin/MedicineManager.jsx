import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaPills,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlusCircle,
  FaSearch,
} from "react-icons/fa";

// ===================== API =====================
const API_URL = "http://localhost:5000/api/medicines";

const initialMedicine = {
  name: "",
  generic_name: "",
  unit: "viên",
  price: "",
  stock: "",
  manufacturer: "",
  expiration_date: "",
  category: "",
  description: "",
};

// ===================== STYLE (PREMIUM) =====================
const pageStyle = {
  padding: "20px 1px",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff, #e0e7ff)",
};

const cardStyle = {
  background: "rgba(255,255,255,0.88)",
  borderRadius: 22,
  padding: "22px 26px",
  boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  border: "1px solid rgba(203,213,225,0.55)",
  marginBottom: 30,
};

const headerIcon = {
  width: 50,
  height: 50,
  borderRadius: 16,
  background: "linear-gradient(135deg,#6366f1,#7c3aed)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
};

const gradientBtn = {
  background: "linear-gradient(135deg,#7c3aed,#6366f1,#4f46e5)",
  color: "white",
  padding: "10px 18px",
  fontWeight: 600,
  borderRadius: 14,
  border: "none",
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(79,70,229,0.3)",
};

const inputStyle = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  padding: "10px 12px",
  fontSize: 14,
  outline: "none",
};

const tableWrapper = {
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const theadStyle = {
  background: "linear-gradient(135deg,#6366f1,#4f46e5)",
  color: "white",
};

const thTd = {
  padding: "10px 14px",
  fontSize: 13.5,
  borderBottom: "1px solid #e5e7eb",
};

// ===================== MAIN COMPONENT =====================
const MedicineManager = () => {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState(initialMedicine);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const formRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch danh sách thuốc
  const fetchMedicines = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách thuốc:", err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAddNew = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialMedicine);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchMedicines();
      setFormData(initialMedicine);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi lưu thuốc:", err);
    }
  };

  const handleEdit = (med) => {
    setFormData(med);
    setEditingId(med.id);
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thuốc này không?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedicines();
    } catch (err) {
      console.error("Lỗi xóa thuốc:", err);
    }
  };

  const handleCancel = () => {
    setFormData(initialMedicine);
    setIsEditing(false);
    setEditingId(null);
  };

  // ===================== RENDER =====================
  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={headerIcon}>
            <FaPills />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#4338ca" }}>
            Quản lý Thuốc
          </h2>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <FaSearch
              style={{ position: "absolute", top: 13, left: 12, color: "#94a3b8" }}
            />
            <input
              style={{
                ...inputStyle,
                paddingLeft: 38,
                width: 260,
              }}
              placeholder="Tìm thuốc, hoạt chất..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add new */}
          <button style={gradientBtn} onClick={handleAddNew}>
            <FaPlusCircle /> Thêm thuốc
          </button>
        </div>
      </div>

      {/* FORM */}
      <div ref={formRef} style={cardStyle}>
        <h3 style={{ fontSize: 19, fontWeight: 700, color: "#334155", marginBottom: 16 }}>
          {isEditing ? "✏️ Cập nhật thuốc" : "➕ Thêm thuốc mới"}
        </h3>

       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
  {/* Tên thuốc */}
  <div>
    <label className="font-medium">Tên thuốc</label>
    <input
      type="text"
      style={inputStyle}
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      required
    />
  </div>

  {/* Hoạt chất */}
  <div>
    <label className="font-medium">Hoạt chất</label>
    <input
      type="text"
      style={inputStyle}
      value={formData.generic_name}
      onChange={(e) =>
        setFormData({ ...formData, generic_name: e.target.value })
      }
    />
  </div>

  {/* Đơn vị */}
  <div>
    <label className="font-medium">Đơn vị</label>
    <input
      type="text"
      style={inputStyle}
      value={formData.unit}
      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
    />
  </div>

  {/* Giá */}
  <div>
    <label className="font-medium">Giá bán (VNĐ)</label>
    <input
      type="number"
      style={inputStyle}
      value={formData.price}
      onChange={(e) =>
        setFormData({ ...formData, price: e.target.value })
      }
    />
  </div>

  {/* Tồn kho */}
  <div>
    <label className="font-medium">Tồn kho</label>
    <input
      type="number"
      style={inputStyle}
      value={formData.stock}
      onChange={(e) =>
        setFormData({ ...formData, stock: e.target.value })
      }
    />
  </div>

  {/* Hãng sản xuất */}
  <div>
    <label className="font-medium">Hãng sản xuất</label>
    <input
      type="text"
      style={inputStyle}
      value={formData.manufacturer}
      onChange={(e) =>
        setFormData({ ...formData, manufacturer: e.target.value })
      }
    />
  </div>

  {/* Hạn sử dụng */}
  <div>
    <label className="font-medium">Hạn sử dụng</label>
    <input
      type="date"
      style={inputStyle}
      value={formData.expiration_date}
      onChange={(e) =>
        setFormData({ ...formData, expiration_date: e.target.value })
      }
    />
  </div>

  {/* Nhóm thuốc */}
  <div>
    <label className="font-medium">Nhóm thuốc</label>
    <input
      type="text"
      style={inputStyle}
      value={formData.category}
      onChange={(e) =>
        setFormData({ ...formData, category: e.target.value })
      }
    />
  </div>

  {/* Mô tả */}
  <div className="col-span-2">
    <label className="font-medium">Mô tả / Hướng dẫn sử dụng</label>
    <textarea
      style={inputStyle}
      rows={3}
      value={formData.description}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
    ></textarea>
  </div>

  {/* BUTTONS */}
  <div className="col-span-2 flex justify-end gap-4 mt-2">
    <button type="submit" style={gradientBtn}>
      <FaSave />
      {isEditing ? "Lưu thay đổi" : "Thêm thuốc"}
    </button>

    {isEditing && (
      <button
        type="button"
        onClick={handleCancel}
        className="bg-gray-300 px-4 py-2 rounded-lg shadow"
      >
        <FaTimes /> Hủy
      </button>
    )}
  </div>
</form>

      </div>

      {/* TABLE */}
      <div style={tableWrapper}>
        <table className="w-full text-sm">
          <thead style={theadStyle}>
            <tr>
              {[
                "#",
                "Tên thuốc",
                "Hoạt chất",
                "Đơn vị",
                "Giá",
                "Tồn kho",
                "Hãng",
                "Hạn dùng",
                "Nhóm",
                "Mô tả",
                "Thao tác",
              ].map((h) => (
                <th key={h} style={{ ...thTd, color: "white" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {medicines.map((med, idx) => (
              <tr
                key={med.id}
                style={{
                  background: idx % 2 === 0 ? "white" : "#f8fafc",
                }}
              >
                <td style={thTd}>{idx + 1}</td>
                <td style={thTd}>{med.name}</td>
                <td style={thTd}>{med.generic_name || "-"}</td>
                <td style={thTd}>{med.unit}</td>
                <td style={thTd}>{Number(med.price).toLocaleString()}</td>
                <td style={thTd}>{med.stock}</td>
                <td style={thTd}>{med.manufacturer}</td>
                <td style={thTd}>{med.expiration_date}</td>
                <td style={thTd}>{med.category}</td>
                <td style={thTd}>{med.description}</td>

                <td
                  style={{
                    ...thTd,
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{ color: "#2563eb" }}
                    onClick={() => handleEdit(med)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    style={{ color: "#dc2626" }}
                    onClick={() => handleDelete(med.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineManager;
