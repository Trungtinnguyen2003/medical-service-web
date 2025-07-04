import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import EditUserModal from "./EditUserModal";

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
    if (window.confirm("Xoá người dùng này?")) {
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
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Quản lý Người dùng</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }} border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.phone}</td>
              <td>{u.date_of_birth}</td>
              <td>{u.gender}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Sửa</button>
                <button onClick={() => handleDelete(u.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
