// src/components/DoctorManager/DoctorProfileManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorProfileManager = () => {
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [assignedServices, setAssignedServices] = useState([]);

  const token = localStorage.getItem("token");

 const fetchDoctorInfo = async () => {
  try {
    const token = localStorage.getItem("token");

    // ✅ 1. Lấy thông tin user đang đăng nhập
    const profileRes = await axios.get("http://localhost:5000/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userId = profileRes.data.id;
    const userName = profileRes.data.name; // 👈 tên từ tài khoản

    // ✅ 2. Lấy thông tin bác sĩ theo user_id
    const doctorRes = await axios.get(`http://localhost:5000/doctors/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Nếu bác sĩ chưa có hồ sơ thì tạo object trống,
    // nhưng vẫn gán sẵn tên từ tài khoản đã đăng ký
    const doctorData = doctorRes.data
      ? { ...doctorRes.data, name: doctorRes.data.name || userName }
      : {
          id: null,
          name: userName, // 👈 lấy từ tài khoản
          title: "",
          degree: "",
          position: "",
          experience_years: "",
          phone: "",
          description: "",
          work_history: "",
          education_history: "",
          extra_info: "",
          avatar: "",
        };

    setDoctor(doctorData);

    // ✅ 3. Lấy danh sách dịch vụ đã phân công (nếu có)
    if (doctorRes.data?.id) {
      const servicesRes = await axios.get(
        `http://localhost:5000/doctors/${doctorRes.data.id}/services`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignedServices(servicesRes.data || []);
    } else {
      setAssignedServices([]);
    }
  } catch (err) {
    console.error("🔥 Lỗi khi lấy thông tin bác sĩ:", err);
    setDoctor({
      id: null,
      name: "", // nếu cả profileRes cũng lỗi, để rỗng
      title: "",
      degree: "",
      position: "",
      experience_years: "",
      phone: "",
      description: "",
      work_history: "",
      education_history: "",
      extra_info: "",
      avatar: "",
    });
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      let avatarUrl = doctor.avatar;

      // ✅ Upload ảnh nếu có
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload/image",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        avatarUrl = uploadRes.data.url;
      }

      // ✅ Nếu bác sĩ chưa có hồ sơ (id null), tạo mới
      if (!doctor.id) {
        const createRes = await axios.post(
          "http://localhost:5000/doctors",
          { ...doctor, avatar: avatarUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDoctor(createRes.data);
      } else {
        // ✅ Nếu có rồi thì cập nhật
        await axios.put(
          `http://localhost:5000/doctors/${doctor.id}`,
          { ...doctor, avatar: avatarUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("💾 Cập nhật thông tin thành công!");
      setEditing(false);
      fetchDoctorInfo();
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      alert("Có lỗi khi lưu thông tin bác sĩ.");
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  if (!doctor) return <p>Đang tải thông tin bác sĩ...</p>;

  return (
    <div style={{ marginTop: 40, padding: "0 20px" }}>
      <h2>👨‍⚕️ Hồ sơ bác sĩ</h2>

      {(avatarPreview || doctor.avatar) && (
        <img
          src={avatarPreview || `http://localhost:5000${doctor.avatar}`}
          alt="avatar"
          style={{
            width: 140,
            height: 140,
            objectFit: "cover",
            borderRadius: "50%",
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

      {/* ✅ Hiển thị danh sách dịch vụ mà admin đã phân công */}
      <div style={{ marginTop: 30 }}>
        <h3>🩺 Dịch vụ được phân công</h3>
        {assignedServices.length > 0 ? (
         <ul>
  {assignedServices.map((s) => (
    <li key={s.id}>
      <strong>{s.title}</strong> ({s.department?.name || "Chưa rõ khoa"})
    </li>
  ))}
</ul>

        ) : (
          <p>Chưa có dịch vụ nào được phân công.</p>
        )}
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
