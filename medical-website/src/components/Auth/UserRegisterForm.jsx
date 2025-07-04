// src/components/Auth/UserRegisterForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

const UserRegisterForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

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
      await axios.post(`${API_BASE_URL}/auth/register`, form);
      alert("Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      alert("Lỗi đăng ký: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {["name", "email", "password", "confirmPassword"].map((field) => (
        <div key={field} style={{ marginBottom: 12 }}>
          <input
            type={field.includes("password") ? "password" : "text"}
            name={field}
            placeholder={
              field === "name"
                ? "Họ và tên"
                : field === "email"
                ? "Email"
                : field === "password"
                ? "Mật khẩu"
                : "Xác nhận mật khẩu"
            }
            value={form[field]}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 10, borderRadius: 6 }}
          />
        </div>
      ))}
      <button type="submit" style={{ width: "100%", padding: 12, borderRadius: 6, backgroundColor: "#6a1b9a", color: "#fff" }}>
        Đăng ký
      </button>
    </form>
  );
};

export default UserRegisterForm;
