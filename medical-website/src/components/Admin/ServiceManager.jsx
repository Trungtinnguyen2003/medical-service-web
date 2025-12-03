import React, { useEffect, useState, useRef  } from "react";
import axios from "axios";
import serviceService from "../../services/serviceService";
import departmentService from "../../services/departmentService";



const initialService = {
  title: "",
  slug: "",
  description: "",
  detail: "",
  image_url: "",
  price: "",
};

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  border: "1px solid #eee",
};

const inputStyle = {
  padding: "10px 14px",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const labelStyle = {
  fontWeight: "600",
  marginBottom: "6px",
  display: "block",
};

const ServiceManager = () => {
  const formRef = useRef(null);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(initialService);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchServices();
    fetchDepartments();
  }, []);

  const fetchServices = async () => {
    const res = await serviceService.getAllServices();
    setServices(res);
  };

  const fetchDepartments = async () => {
    const res = await departmentService.getAllDepartments();
    setDepartments(res);
  };

  const handleOpenAdd = () => {
    setFormData(initialService);
    setSelectedDepartments([]);
    setEditingId(null);
    setIsEditing(false);
    setShowForm(true);
    setImageFile(null);
    setImagePreview(null);

     setTimeout(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, 150);
  };

  const handleEdit = async (service) => {
    const res = await serviceService.getServiceDepartments(service.id);
    setFormData({ ...service });
    setSelectedDepartments(res.map((d) => d.id));
    setEditingId(service.id);
    setIsEditing(true);
    setShowForm(true);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá dịch vụ này?")) {
      await serviceService.deleteService(id);
      fetchServices();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const raw = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: raw }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleDepartment = (id) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
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

    const payload = {
      ...formData,
      image_url: imageUrl || "",
      price: Number(String(formData.price).replace(/\D/g, "")) || null,
    };

    if (!payload.slug?.trim()) delete payload.slug;

    if (isEditing) {
      await serviceService.updateService(editingId, payload);
      await serviceService.setDepartments(editingId, selectedDepartments);
      alert("Đã cập nhật dịch vụ.");
    } else {
      const created = await serviceService.createService(payload);
      await serviceService.setDepartments(created.id, selectedDepartments);
      alert("Đã thêm dịch vụ.");
    }

    setShowForm(false);
    fetchServices();
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>Quản lý Dịch vụ</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "14px" }}>
        <button
          onClick={handleOpenAdd}
          style={{
            padding: "10px 18px",
            background: "#007bff",
            borderRadius: "8px",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ➕ Thêm dịch vụ
        </button>

        <input
          type="text"
          placeholder="🔍 Tìm kiếm dịch vụ..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ ...inputStyle, maxWidth: "320px" }}
        />
      </div>

      {/* TABLE */}
      <div style={cardStyle}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
              {[
                "Tiêu đề",
                "Slug",
                "Chuyên khoa",
                "Giá",
                "Mô tả",
                "Chi tiết",
                "Ảnh",
                "Thao tác",
              ].map((col) => (
                <th
                  key={col}
                  style={{ padding: "12px 8px", borderBottom: "2px solid #eee" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "12px 8px" }}>{s.title}</td>
                <td style={{ padding: "12px 8px" }}>{s.slug}</td>
                <td style={{ padding: "12px 8px" }}>
                  {s.departments?.map((d) => d.name).join(", ") || "—"}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {s.price?.toLocaleString("vi-VN")}₫
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {s.description?.slice(0, 50)}...
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {s.detail?.slice(0, 50)}...
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {s.image_url && (
                    <img
                      src={`http://localhost:5000${s.image_url}`}
                      alt="ảnh"
                      width="70"
                      style={{
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  )}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <button
                    onClick={() => handleEdit(s)}
                    style={{
                      padding: "6px 12px",
                      background: "#ffc107",
                      borderRadius: "6px",
                      border: "none",
                      marginRight: "6px",
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{
                      padding: "6px 12px",
                      background: "#dc3545",
                      borderRadius: "6px",
                      border: "none",
                      color: "white",
                    }}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
          <div ref={formRef} style={{ marginTop: "30px", ...cardStyle }}>
          <h3 style={{ marginBottom: "20px" }}>
            {isEditing ? "🛠 Sửa dịch vụ" : "➕ Thêm dịch vụ"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* LEFT */}
            <div>
              {/* Title */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Tiêu đề</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  style={{ ...inputStyle, height: "110px", resize: "vertical" }}
                />
              </div>

              {/* Price */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Giá (VNĐ)</label>
                <input
                  type="text"
                  name="price"
                  value={Number(formData.price).toLocaleString("vi-VN")}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Chi tiết dịch vụ</label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  rows={7}
                  style={{ ...inputStyle, height: "150px", resize: "vertical" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Ảnh đại diện</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              {(imagePreview || formData.image_url) && (
                <img
                  src={imagePreview || `http://localhost:5000${formData.image_url}`}
                  width="140"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              )}
            </div>
          </div>

          {/* DEPARTMENTS */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ ...labelStyle, fontSize: "15px" }}>
              Chuyên khoa đảm nhận:
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              {departments.map((d) => (
                <label
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    background: selectedDepartments.includes(d.id)
                      ? "#e8f3ff"
                      : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(d.id)}
                    onChange={() => handleToggleDepartment(d.id)}
                  />
                  {d.name}
                </label>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div style={{ marginTop: "30px", textAlign: "right" }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 18px",
                background: "#007bff",
                borderRadius: "8px",
                border: "none",
                color: "white",
                fontWeight: "600",
              }}
            >
              {isEditing ? "Lưu thay đổi" : "Thêm mới"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "10px 18px",
                background: "#6c757d",
                borderRadius: "8px",
                border: "none",
                color: "white",
                marginLeft: "12px",
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
