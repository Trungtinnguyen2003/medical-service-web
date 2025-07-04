import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorApprovalManager = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const fetchPendingDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const filtered = res.data.filter(
        (user) => user.role === "doctor" && user.status === "pending"
      );
  
      const resultWithDoctorInfo = await Promise.all(
        filtered.map(async (user) => {
          try {
            const doctor = await axios.get(
              `http://localhost:5000/doctors/user/${user.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...user, doctor: doctor.data };
          } catch (err) {
            console.warn(`⚠️ Không tìm thấy thông tin doctor cho user_id=${user.id}`);
            return { ...user, doctor: null }; // vẫn trả về user
          }
        })
      );
  
      setPendingDoctors(resultWithDoctorInfo);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", err);
    }
  };
  

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/users/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Đã cập nhật trạng thái: ${status}`);
      setSelectedDoctor(null);
      fetchPendingDoctors();
    } catch (err) {
      alert("❌ Lỗi khi cập nhật trạng thái");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>🧾 Phê duyệt tài khoản bác sĩ</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: 20,
          borderCollapse: "collapse",
          backgroundColor: "#fff",
        }}
      >
        <thead style={{ background: "#f3f4f6" }}>
          <tr>
            <th>Ảnh</th>
            <th>Họ tên</th>
            <th>Pháp danh</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Chức danh</th>
            <th>Học vị</th>
            <th>Ngày đăng ký</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pendingDoctors.map((user) => (
            <React.Fragment key={user.id}>
              <tr>
                <td>
                  {user.doctor?.avatar ? (
                    <img
                      src={`http://localhost:5000${user.doctor.avatar}`}
                      alt="avatar"
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                  ) : (
                    "Không có"
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.doctor?.name || "Không có"}</td>
                <td>{user.email}</td>
                <td>{user.doctor?.phone || "Chưa cập nhật"}</td>
                <td>{user.doctor?.position || "Chưa cập nhật"}</td>
                <td>{user.doctor?.degree || "Chưa cập nhật"}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    style={{ background: "green", color: "white", marginRight: 5 }}
                    onClick={() => handleUpdateStatus(user.id, "approved")}
                  >
                    ✅ Duyệt
                  </button>
                  <button
                    style={{ background: "red", color: "white", marginRight: 5 }}
                    onClick={() => handleUpdateStatus(user.id, "rejected")}
                  >
                    ❌ Từ chối
                  </button>
                  <button
                    style={{ background: "#0d6efd", color: "white" }}
                    onClick={() =>
                      setSelectedDoctor(selectedDoctor === user.id ? null : user.id)
                    }
                  >
                    👁 Xem chi tiết
                  </button>
                </td>
              </tr>

              {selectedDoctor === user.id && (
                <tr>
                  <td colSpan="9" style={{ background: "#f9f9f9" }}>
                    <div>
                      <strong>Lịch sử công tác:</strong>{" "}
                      {user.doctor?.work_history || "Không có"}
                      <br />
                      <strong>Quá trình đào tạo:</strong>{" "}
                      {user.doctor?.education_history || "Không có"}
                      <br />
                      <strong>Thông tin thêm:</strong>{" "}
                      {user.doctor?.extra_info || "Không có"}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {pendingDoctors.length === 0 && (
        <p style={{ marginTop: 20 }}>Không có yêu cầu đăng ký nào cần duyệt.</p>
      )}
    </div>
  );
};

export default DoctorApprovalManager;
