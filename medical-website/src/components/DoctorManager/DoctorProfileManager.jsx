// src/components/DoctorManager/DoctorProfileManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfileManager = () => {
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const fetchDoctorInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      const profileRes = await axios.get("http://localhost:5000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = profileRes.data.id;

      const doctorRes = await axios.get(`http://localhost:5000/doctors/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctor(doctorRes.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin bác sĩ:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      let avatarUrl = doctor.avatar;

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

      const payload = { ...doctor, avatar: avatarUrl };

      await axios.put(`http://localhost:5000/doctors/${doctor.id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Cập nhật thông tin thành công!");
      setEditing(false);
      fetchDoctorInfo();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Có lỗi khi cập nhật thông tin.");
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  if (!doctor) return <p>Đang tải thông tin bác sĩ...</p>;

  return (
    <div style={{ marginTop: 50 }}>
      <h2>Thông tin bác sĩ</h2>

      {(avatarPreview || doctor.avatar) && (
        <img
          src={avatarPreview || `http://localhost:5000${doctor.avatar}`}
          alt="avatar"
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            borderRadius: 8,
            marginTop: 16,
          }}
        />
      )}

      {editing && (
        <div style={{ marginBottom: 16 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setAvatarFile(file);
              if (file) {
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 20, lineHeight: "1.8", fontSize: 15 }}>
        {[
          { field: "name", label: "Họ tên" },
          { field: "title", label: "Chức danh" },
          { field: "degree", label: "Học vị" },
          { field: "position", label: "Vị trí" },
          { field: "experience_years", label: "Kinh nghiệm (năm)" },
          { field: "phone", label: "Điện thoại" },
          { field: "description", label: "Giới thiệu" },
          { field: "work_history", label: "Lịch sử công tác" },
          { field: "education_history", label: "Đào tạo" },
          { field: "extra_info", label: "Thông tin thêm" },
        ].map(({ field, label }) => (
          <div key={field} style={{ marginBottom: 10 }}>
            <strong>{label}:</strong>{" "}
            {editing ? (
              <input
                type={field === "experience_years" ? "number" : "text"}
                name={field}
                value={doctor[field] || ""}
                onChange={handleChange}
                style={{ width: "60%", padding: 6 }}
              />
            ) : (
              <span>{doctor[field] || "—"}</span>
            )}
          </div>
        ))}
      </div>

      {editing ? (
        <div style={{ marginTop: 20 }}>
          <button onClick={handleSave}>💾 Lưu</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: 10 }}>
            Huỷ
          </button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} style={{ marginTop: 20 }}>
          ✏️ Chỉnh sửa thông tin
        </button>
      )}
    </div>
  );
};

export default DoctorProfileManager;
