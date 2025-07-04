import React, { useEffect, useState } from "react";
import axios from "axios";
import doctorService from "../../services/doctorService";
import departmentService from "../../services/departmentService";
import serviceService from "../../services/serviceService"; // 👈 dùng file service có sẵn

const initialDoctor = {
  name: "",
  slug: "",
  avatar: "",
  title: "",
  degree: "",
  position: "",
  experience_years: "",
  phone: "",
  description: "",
  work_history: "",
  education_history: "",
  extra_info: "",
};

const DoctorManager = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(initialDoctor);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
    fetchServices();
  }, []);

  const fetchDoctors = async () => {
    const res = await doctorService.getAllDoctors();
    const approved = res.filter((doc) => doc.user?.status === "approved");
    setDoctors(approved);
  };

  const fetchDepartments = async () => {
    const res = await departmentService.getAllDepartments();
    setDepartments(res);
  };

  const fetchServices = async () => {
    const res = await serviceService.getAllServices();
    setServices(res);
  };

  const handleOpenAdd = () => {
    setFormData(initialDoctor);
    setEditingId(null);
    setIsEditing(false);
    setSelectedDepartments([]);
    setSelectedServices([]);
    setAvatarFile(null);
    setAvatarPreview(null);
    setShowForm(true);
  };

  const handleEdit = async (doctor) => {
    setFormData(doctor);
    setEditingId(doctor.id);
    setIsEditing(true);
    setShowForm(true);
    const resDept = await doctorService.getDoctorDepartments(doctor.id);
    setSelectedDepartments(resDept.map((d) => d.id));
    const resSvc = await doctorService.getDoctorServices(doctor.id);
    setSelectedServices(resSvc.map((s) => s.id));
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bác sĩ này?")) {
      await doctorService.deleteDoctor(id);
      alert("Đã xoá bác sĩ.");
      fetchDoctors();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const uploadRes = await axios.post("http://localhost:5000/api/upload/image", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        avatarUrl = uploadRes.data.url;
      }

      const payload = { ...formData, avatar: avatarUrl };

      if (isEditing) {
        await doctorService.updateDoctor(editingId, payload);
        await doctorService.setDepartments(editingId, selectedDepartments);
        await doctorService.setServices(editingId, selectedServices);
        alert("Cập nhật thành công.");
      } else {
        const res = await doctorService.createDoctor(payload);
        const newId = res?.doctor?.id;
        if (!newId) {
          alert("Không lấy được ID bác sĩ.");
          return;
        }
        await doctorService.setDepartments(newId, selectedDepartments);
        await doctorService.setServices(newId, selectedServices);
        alert("Đã thêm mới bác sĩ.");
      }

      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      console.error("Lỗi submit:", err);
      alert("Có lỗi xảy ra khi xử lý.");
    }
  };

  const filteredServices = services.filter((s) =>
    s.departments?.some((d) => selectedDepartments.includes(d.id))
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>Quản lý bác sĩ</h2>
      <button onClick={handleOpenAdd}>➕ Thêm bác sĩ</button>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Chức danh</th>
            <th>Học vị</th>
            <th>Vị trí</th>
            <th>Kinh nghiệm</th>
            <th>Điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.title}</td>
              <td>{d.degree}</td>
              <td>{d.position}</td>
              <td>{d.experience_years} năm</td>
              <td>{d.phone}</td>
              <td>
                <button onClick={() => handleEdit(d)}>Sửa</button>{" "}
                <button onClick={() => handleDelete(d.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={{ marginTop: 30, padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
          <h3>{isEditing ? "🛠 Sửa bác sĩ" : "➕ Thêm bác sĩ"}</h3>

          {[
            { field: "name", label: "Họ và tên" },
            { field: "slug", label: "Slug (không dấu)" },
            { field: "title", label: "Chức danh" },
            { field: "degree", label: "Học vị" },
            { field: "position", label: "Vị trí" },
            { field: "experience_years", label: "Số năm kinh nghiệm" },
            { field: "phone", label: "Số điện thoại" },
            { field: "description", label: "Giới thiệu" },
            { field: "work_history", label: "Lịch sử công tác" },
            { field: "education_history", label: "Quá trình đào tạo" },
            { field: "extra_info", label: "Thông tin thêm" },
          ].map(({ field, label }) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ width: 180, display: "inline-block" }}>{label}</label>
              <input
                type={field === "experience_years" ? "number" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={{ width: "60%" }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 10 }}>
            <label style={{ width: 180, display: "inline-block" }}>Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setAvatarFile(file);
                if (file) setAvatarPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {(avatarPreview || formData.avatar) && (
            <img
              src={avatarPreview || `http://localhost:5000${formData.avatar}`}
              alt="avatar"
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
            />
          )}

          <div style={{ marginBottom: 20 }}>
            <label><strong>Chuyên khoa</strong></label>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {departments.map((d) => (
                <label key={d.id} style={{ width: "30%", marginRight: 10 }}>
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(d.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDepartments([...selectedDepartments, d.id]);
                      } else {
                        setSelectedDepartments(selectedDepartments.filter((id) => id !== d.id));
                      }
                    }}
                  />{" "}
                  {d.name}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
  <label><strong>Dịch vụ đảm nhận (lọc theo chuyên khoa)</strong></label>
  <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr", // 3 cột
    gap: "8px 16px",
    marginTop: 10,
  }}
>
  {filteredServices.map((s) => (
    <label key={s.id} style={{ display: "flex", flexDirection: "column", fontSize: 14 }}>
      <span>
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
        />{" "}
        {s.title}
      </span>
      <span style={{ fontSize: 12, color: "#666", paddingLeft: 20 }}>
        {s.departments?.map((d) => d.name).join(", ")}
      </span>
    </label>
  ))}
</div>

</div>


          <button onClick={handleSubmit}>{isEditing ? "Lưu thay đổi" : "Thêm mới"}</button>
          <button onClick={() => setShowForm(false)} style={{ marginLeft: 10 }}>
            Huỷ
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorManager;
