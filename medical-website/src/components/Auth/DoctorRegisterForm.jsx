// src/components/Auth/DoctorRegisterForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

const DoctorRegisterForm = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    title: "", degree: "", position: "", phone: "",
    experience_years: "", work_history: "", education_history: "", extra_info: ""
  });
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      if (avatar) formData.append("avatar", avatar);

      await axios.post(`${API_BASE_URL}/auth/register-doctor`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Đăng ký bác sĩ thành công, chờ admin duyệt.");
      navigate("/login");
    } catch (err) {
      alert("Lỗi đăng ký bác sĩ: " + (err.response?.data?.message || err.message));
    }
  };

  const fields = [
    { name: "name", placeholder: "Họ và tên" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Mật khẩu", type: "password" },
    { name: "confirmPassword", placeholder: "Xác nhận mật khẩu", type: "password" },
    { name: "title", placeholder: "Chức danh" },
    { name: "degree", placeholder: "Học vị" },
    { name: "position", placeholder: "Vị trí" },
    { name: "phone", placeholder: "Số điện thoại" },
    { name: "experience_years", placeholder: "Số năm kinh nghiệm" },
    { name: "work_history", placeholder: "Lịch sử công tác" },
    { name: "education_history", placeholder: "Quá trình đào tạo" },
    { name: "extra_info", placeholder: "Thông tin thêm" },
  ];

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {fields.map(({ name, placeholder, type = "text" }) => (
        <div key={name} style={{ marginBottom: 12 }}>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 10, borderRadius: 6 }}
          />
        </div>
      ))}

<div style={{ marginBottom: 12 }}>
  <label>Ảnh đại diện:</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        setAvatar(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }}
    required
  />
  {previewUrl && (
    <div style={{ marginTop: 12 }}>
      <img
        src={previewUrl}
        alt="Avatar Preview"
        style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
      />
    </div>
  )}
</div>


      <button type="submit" style={{ width: "100%", padding: 12, borderRadius: 6, backgroundColor: "#6a1b9a", color: "#fff" }}>
        Gửi yêu cầu
      </button>
    </form>
  );
};

export default DoctorRegisterForm;
