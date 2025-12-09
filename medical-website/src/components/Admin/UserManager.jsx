import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import EditUserModal from "./EditUserModal";
import { FaEdit, FaTrash } from "react-icons/fa";

// ================== STYLE ==================
const pageWrapper = {
  padding: "20px",
  background: "#f3f6f9",
  minHeight: "100vh",
};

const pageTitle = {
  fontSize: 26,
  fontWeight: 800,
  color: "#0b3c60",
  marginBottom: 20,
};

const card = {
  background: "white",
  borderRadius: 14,
  padding: "22px 1px",
  border: "1px solid #e3e8ee",
  boxShadow: "0px 4px 14px rgba(0,0,0,0.06)",
};

const tableWrapper = {
  marginTop: 10,
  borderRadius: 10,
  overflow: "hidden",
  border: "1px solid #d7dee6",
};

const tableHeader = {
  background: "#e6f2ff",
  color: "#113b56",
  fontWeight: 700,
};

const thStyle = {
  padding: "10px 12px",
  fontSize: 13,
  borderBottom: "1px solid #dbe2e8",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: 13,
  borderBottom: "1px solid #eef2f6",
};

const actionBtn = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "#eef2f6",
  border: "1px solid #cfd8e3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  marginRight: 8,
};

const deleteBtn = {
  ...actionBtn,
  background: "#fee2e2",
  border: "1px solid #fca5a5",
  color: "#b91c1c",
};

// ================== COMPONENT ==================
const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await userService.getAllUsers();
    setUsers(res);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá người dùng này?")) {
      await userService.deleteUser(id);
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleChange = (key, value) => {
    setEditingUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await userService.updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      fetchUsers();
      alert("✔️ Cập nhật người dùng thành công!");
    } catch (err) {
      alert("❌ Lỗi khi cập nhật người dùng.");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={pageTitle}>Quản lý Người dùng</div>

      <div style={card}>
        <div style={tableWrapper}>
          <table className="w-full">
            <thead style={tableHeader}>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Họ tên</th>
                <th style={thStyle}>Điện thoại</th>
                <th style={thStyle}>Ngày sinh</th>
                <th style={thStyle}>Giới tính</th>
                <th style={thStyle}>Địa chỉ</th>
                <th style={thStyle}>Vai trò</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={{ ...thStyle, textAlign: "center" }}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ ...tdStyle, textAlign: "center" }}>
                    Không có người dùng nào.
                  </td>
                </tr>
              )}

              {users.map((u, index) => (
                <tr
                  key={u.id}
                  style={{
                    background: index % 2 === 0 ? "white" : "#f9fbfc",
                  }}
                  className="hover:bg-[#f0f7ff]"
                >
                  <td style={tdStyle}>{u.id}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.phone}</td>
                  <td style={tdStyle}>{u.date_of_birth}</td>
                  <td style={tdStyle}>{u.gender}</td>
                  <td style={tdStyle}>{u.address}</td>
                  <td style={tdStyle}>{u.role}</td>
                  <td style={tdStyle}>{u.status}</td>

                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button style={actionBtn} onClick={() => handleEdit(u)}>
                        <FaEdit size={14} color="#0B5ED7" />
                      </button>

                      <button
                        style={deleteBtn}
                        onClick={() => handleDelete(u.id)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <EditUserModal
        user={editingUser}
        onChange={handleChange}
        onSave={handleSave}
        onClose={() => setEditingUser(null)}
      />
    </div>
  );
};

export default UserManager;
