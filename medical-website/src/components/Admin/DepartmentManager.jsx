import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import departmentService from "../../services/departmentService";
import serviceService from "../../services/serviceService";

const initialDept = {
  name: "",
  slug: "",
  slogan: "",
  description: "",
  image_url: "",
};

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(initialDept);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceSearch, setServiceSearch] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    fetchDepartments();
    fetchServices();
  }, []);

  const fetchDepartments = async () => {
    const res = await departmentService.getAll();
    setDepartments(res);
  };

  const fetchServices = async () => {
    const res = await serviceService.getAllServices();
    setServices(res);
  };

  // === Scroll khi mở form ===
  const scrollToForm = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  const handleOpenAdd = () => {
    setFormData(initialDept);
    setEditingId(null);
    setIsEditing(false);
    setSelectedServices([]);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
    scrollToForm();
  };

  const handleEdit = async (dept) => {
    setFormData(dept);
    setEditingId(dept.id);
    setIsEditing(true);
    setShowForm(true);

    const full = await departmentService.getBySlug(dept.slug);
    setSelectedServices(full.services.map((s) => s.id));

    setImageFile(null);
    setImagePreview(null);

    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá chuyên khoa này?")) {
      await departmentService.deleteDepartment(id);
      fetchDepartments();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    let imageUrl = formData.image_url;

    if (imageFile) {
      const form = new FormData();
      form.append("avatar", imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/upload/image",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      imageUrl = res.data.url;
    }

    const payload = { ...formData, image_url: imageUrl };

    if (isEditing) {
      await departmentService.updateDepartment(editingId, payload);
      await departmentService.setServices(editingId, selectedServices);
      alert("✔ Đã cập nhật chuyên khoa!");
    } else {
      const newDept = await departmentService.createDepartment(payload);
      await departmentService.setServices(newDept.id, selectedServices);
      alert("✔ Đã thêm chuyên khoa!");
    }

    setShowForm(false);
    fetchDepartments();
  };

  return (
    <div
      style={{
        padding: 32,
        background: "#f5f7fb",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Quản lý Chuyên khoa</h2>
          <p style={{ margin: "4px 0", color: "#777" }}>
            Thêm, sửa, xoá chuyên khoa và gán dịch vụ chuyên khoa đảm nhận.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ➕ Thêm chuyên khoa
        </button>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          padding: 16,
          marginBottom: 32,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: 10, textAlign: "left" }}>Tên</th>
              <th style={{ padding: 10, textAlign: "left" }}>Slogan</th>
              <th style={{ padding: 10, textAlign: "left" }}>Mô tả</th>
              <th style={{ padding: 10, textAlign: "center" }}>Hình ảnh</th>
              <th style={{ padding: 10, textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: 10 }}>{d.name}</td>
                <td style={{ padding: 10 }}>{d.slogan}</td>
                <td style={{ padding: 10 }}>
                  {d.description?.slice(0, 60)}...
                </td>
                <td style={{ textAlign: "center" }}>
                  {d.image_url && (
                    <img
                      src={`http://localhost:5000${d.image_url}`}
                      alt=""
                      width="70"
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td style={{ textAlign: "center", padding: 10 }}>
                  <button
                    onClick={() => handleEdit(d)}
                    style={{
                      padding: "4px 10px",
                      marginRight: 8,
                      borderRadius: 999,
                      border: "none",
                      background: "#0ea5e9",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    ✏ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    🗑 Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM */}
      {showForm && (
        <div
          ref={formRef}
          style={{
            background: "#ffffff",
            borderRadius: 18,
            boxShadow: "0 18px 45px rgba(15,35,95,0.12)",
            padding: 24,
            maxWidth: 1100,
            margin: "0 auto 40px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {isEditing ? "🛠 Cập nhật chuyên khoa" : "➕ Thêm chuyên khoa"}
          </h3>

          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {/* LEFT IMAGE */}
            <div
              style={{
                width: 260,
                minWidth: 220,
                borderRight: "1px solid #e5e7eb",
                paddingRight: 16,
              }}
            >
              <div style={{ fontWeight: 500, marginBottom: 8 }}>
                Ảnh tổng quát chuyên khoa 
              </div>

              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  marginBottom: 12,
                }}
              >
                <img
                  src={
                    imagePreview ||
                    (formData.image_url
                      ? `http://localhost:5000${formData.image_url}`
                      : "https://via.placeholder.com/180x180.png?text=IMG")
                  }
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files[0];
                  setImageFile(f);
                  if (f) setImagePreview(URL.createObjectURL(f));
                }}
              />

              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                Dùng ảnh rõ nét, tỷ lệ vuông (1:1).
              </p>
            </div>

            {/* RIGHT FORM */}
            <div style={{ flex: 1 }}>
              {/* Input fields */}
              {[
                { field: "name", label: "Tên chuyên khoa" },
                { field: "slug", label: "Slug" },
                { field: "slogan", label: "Giới thiệu" },
                { field: "description", label: "Mô tả" },
              ].map(({ field, label }) => (
                <div key={field} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", marginBottom: 4 }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>
              ))}

              {/* SERVICE LIST */}
              <div style={{ marginTop: 20 }}>
                <label style={{ fontWeight: 600 }}>
                  Dịch vụ chuyên khoa đảm nhận
                </label>

                {/* Search */}
                <div style={{ margin: "10px 0" }}>
                  <input
                    type="text"
                    placeholder="🔍 Tìm dịch vụ..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    style={{
                      width: "50%",
                      padding: 8,
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>

                {/* List */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {services
                    .filter((s) =>
                      (s.name || s.title)
                        .toLowerCase()
                        .includes(serviceSearch.toLowerCase())
                    )
                    .map((s) => (
                      <label
                        key={s.id}
                        style={{ width: "30%", fontSize: 14, cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices([
                                ...selectedServices,
                                s.id,
                              ]);
                            } else {
                              setSelectedServices(
                                selectedServices.filter((id) => id !== s.id)
                              );
                            }
                          }}
                          style={{ marginRight: 6 }}
                        />
                        {s.name || s.title}
                      </label>
                    ))}
                </div>
              </div>

              {/* ACTION */}
              <div style={{ marginTop: 22 }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 500,
                    marginRight: 10,
                  }}
                >
                  {isEditing ? "💾 Lưu thay đổi" : "➕ Thêm chuyên khoa"}
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "1px solid #d4d4d8",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManager;
