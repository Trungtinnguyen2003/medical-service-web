import React, { useEffect, useState } from "react";
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
  const [serviceSearch, setServiceSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

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

  const handleOpenAdd = () => {
    setFormData(initialDept);
    setEditingId(null);
    setIsEditing(false);
    setSelectedServices([]);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
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
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá chuyên khoa này?")) {
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
      const res = await axios.post("http://localhost:5000/api/upload/image", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      imageUrl = res.data.url;
    }

    const payload = { ...formData, image_url: imageUrl };

    if (isEditing) {
      await departmentService.updateDepartment(editingId, payload);
      await departmentService.setServices(editingId, selectedServices);
      alert("Đã cập nhật chuyên khoa.");
    } else {
      const newDept = await departmentService.createDepartment(payload);
      await departmentService.setServices(newDept.id, selectedServices);
      alert("Đã thêm chuyên khoa.");
    }

    setShowForm(false);
    fetchDepartments();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Quản lý Chuyên khoa</h2>
      <button onClick={handleOpenAdd}>➕ Thêm chuyên khoa</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Slogan</th>
            <th>Mô tả</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.slogan}</td>
              <td>{d.description?.slice(0, 50)}...</td>
              <td>
                {d.image_url && (
                  <img
                    src={`http://localhost:5000${d.image_url}`}
                    alt=""
                    width="80"
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(d)}>Sửa</button>{" "}
                <button onClick={() => handleDelete(d.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={{ marginTop: 30, padding: 20, border: "1px solid #ccc" }}>
          <h3>{isEditing ? "🛠 Sửa chuyên khoa" : "➕ Thêm chuyên khoa"}</h3>

          {[ 
            { field: "name", label: "Tên chuyên khoa" },
            { field: "slug", label: "Slug (không dấu)" },
            { field: "slogan", label: "Giới thiệu tổng quát" },
            { field: "description", label: "Mô tả" },
          ].map(({ field, label }) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ width: 150, display: "inline-block" }}>{label}</label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={{ width: "60%" }}
              />
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
                  const previewURL = URL.createObjectURL(file);
                  setImagePreview(previewURL);
                }
              }}
            />
          </div>

          {(imagePreview || formData.image_url) && (
            <div style={{ marginBottom: 10 }}>
              <img
                src={imagePreview || `http://localhost:5000${formData.image_url}`}
                alt="preview"
                width="120"
                style={{ borderRadius: 8 }}
              />
            </div>
          )}

<div style={{ marginBottom: 20 }}>
  <label><strong>Dịch vụ đảm nhận:</strong></label>
  
  {/* Ô tìm kiếm */}
  <div style={{ margin: "10px 0" }}>
    <input
      type="text"
      placeholder="🔍 Tìm dịch vụ..."
      value={serviceSearch}
      onChange={(e) => setServiceSearch(e.target.value)}
      style={{ width: "50%", padding: 6 }}
    />
  </div>

  {/* Danh sách dịch vụ */}
  <div style={{ display: "flex", flexWrap: "wrap" }}>
    {services
      .filter((s) =>
        (s.name || s.title)
          .toLowerCase()
          .includes(serviceSearch.toLowerCase())
      )
      .map((s) => (
        <label key={s.id} style={{ width: "30%", marginRight: 10 }}>
          <input
            type="checkbox"
            checked={selectedServices.includes(s.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedServices([...selectedServices, s.id]);
              } else {
                setSelectedServices(selectedServices.filter((id) => id !== s.id));
              }
            }}
          />
          {s.name || s.title}
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

export default DepartmentManager;
