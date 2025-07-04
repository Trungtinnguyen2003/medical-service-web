// components/Admin/EditUserModal.jsx
import React from "react";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "24px",
  width: "400px",
  maxWidth: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const labelStyle = {
  fontWeight: 600,
  marginBottom: "4px",
  display: "block",
};

const EditUserModal = ({ user, onChange, onSave, onClose }) => {
  if (!user) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Chỉnh sửa người dùng</h3>

        <label style={labelStyle}>Họ tên</label>
        <input style={inputStyle} value={user.name || ""} onChange={(e) => onChange("name", e.target.value)} />

        <label style={labelStyle}>Email</label>
        <input style={inputStyle} value={user.email || ""} disabled />

        <label style={labelStyle}>Điện thoại</label>
        <input style={inputStyle} value={user.phone || ""} onChange={(e) => onChange("phone", e.target.value)} />

        <label style={labelStyle}>Ngày sinh</label>
        <input style={inputStyle} type="date" value={user.date_of_birth || ""} onChange={(e) => onChange("date_of_birth", e.target.value)} />

        <label style={labelStyle}>Giới tính</label>
        <select style={inputStyle} value={user.gender || ""} onChange={(e) => onChange("gender", e.target.value)}>
          <option value="">-- Chọn giới tính --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>

        <label style={labelStyle}>Địa chỉ</label>
        <input style={inputStyle} value={user.address || ""} onChange={(e) => onChange("address", e.target.value)} />

        <label style={labelStyle}>Trạng thái</label>
        <select style={inputStyle} value={user.status || ""} onChange={(e) => onChange("status", e.target.value)}>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Bị khoá</option>
        </select>

        <label style={labelStyle}>Vai trò</label>
        <select style={inputStyle} value={user.role || ""} onChange={(e) => onChange("role", e.target.value)}>
          <option value="">-- Chọn vai trò --</option>
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
          <option value="doctor">Bác sĩ</option>
        </select>

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>Huỷ</button>
          <button onClick={onSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
