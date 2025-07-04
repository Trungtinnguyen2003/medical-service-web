import React, { useEffect, useState } from "react";
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

const ServiceManager = () => {
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
      const res = await axios.post("http://localhost:5000/api/upload/image", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      imageUrl = res.data.url;
    }

    const payload = {
      ...formData,
      image_url: imageUrl || "",
      price: Number(String(formData.price).replace(/\D/g, "")) || null,
    };

    if (!payload.slug?.trim()) {
      delete payload.slug;
    }

    if (isEditing) {
      await serviceService.updateService(editingId, payload);
      await serviceService.setDepartments(editingId, selectedDepartments);
      alert("✅ Đã cập nhật dịch vụ.");
    } else {
      const created = await serviceService.createService(payload);
      await serviceService.setDepartments(created.id, selectedDepartments);
      alert("✅ Đã thêm dịch vụ.");
    }

    setShowForm(false);
    fetchServices();
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>Quản lý Dịch vụ</h2>
      <button onClick={handleOpenAdd}>➕ Thêm dịch vụ</button>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm dịch vụ..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ width: "50%", padding: 6, margin: "20px 0" }}
      />

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Slug</th>
            <th>Chuyên khoa</th>
            <th>Giá</th>
            <th>Mô tả</th>
            <th>Chi tiết</th>
            <th>Ảnh</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((s) => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{s.slug}</td>
              <td>{s.departments?.map((d) => d.name).join(", ") || "—"}</td>
              <td>{s.price?.toLocaleString("vi-VN")}₫</td>
              <td>{s.description?.slice(0, 50)}...</td>
              <td>{s.detail?.slice(0, 50)}...</td>
              <td>
                {s.image_url && (
                  <img
                    src={`http://localhost:5000${s.image_url}`}
                    alt="Ảnh"
                    width="80"
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(s)}>Sửa</button>{" "}
                <button onClick={() => handleDelete(s.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={{ marginTop: 30, padding: 20, border: "1px solid #ccc" }}>
          <h3>{isEditing ? "🛠 Sửa dịch vụ" : "➕ Thêm dịch vụ"}</h3>

          {[
            { field: "title", label: "Tiêu đề" },
            { field: "description", label: "Mô tả" },
            { field: "detail", label: "Chi tiết" },
            { field: "price", label: "Giá (VNĐ)" },
          ].map(({ field, label }) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ width: 150, display: "inline-block" }}>{label}</label>
              {field === "detail" ? (
                <textarea
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  rows={5}
                  style={{ width: "60%", resize: "vertical", whiteSpace: "pre-wrap" }}
                />
              ) : field === "price" ? (
                <input
                  type="text"
                  name="price"
                  value={Number(formData.price).toLocaleString("vi-VN")}
                  onChange={handleChange}
                  style={{ width: "60%" }}
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  style={{ width: "60%" }}
                />
              )}
            </div>
          ))}

          <div style={{ marginBottom: 10 }}>
            <label style={{ width: 150, display: "inline-block" }}>Ảnh đại diện</label>
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
          </div>

          {(imagePreview || formData.image_url) && (
            <div style={{ marginBottom: 10 }}>
              <img
                src={imagePreview || `http://localhost:5000${formData.image_url}`}
                alt="Preview"
                width="120"
              />
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label><strong>Chuyên khoa đảm nhận:</strong></label>
            <div style={{ marginTop: 10 }}>
              {departments.map((d) => (
                <label key={d.id} style={{ display: "block", marginBottom: 6 }}>
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(d.id)}
                    onChange={() => handleToggleDepartment(d.id)}
                  />{" "}
                  {d.name}
                </label>
              ))}
            </div>
          </div>

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

export default ServiceManager;