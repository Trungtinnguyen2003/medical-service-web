// ===============================================
// DoctorProfileManager.jsx — PREMIUM DOCTOR UI
// ===============================================
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiSave, FiX, FiUser, FiLayers } from "react-icons/fi";

// ================= GLOBAL ANIMATION STYLE =================
if (
  typeof document !== "undefined" &&
  !document.getElementById("doctor-profile-premium-style")
) {
  const style = document.createElement("style");
  style.id = "doctor-profile-premium-style";
  style.textContent = `
    @keyframes profileFadeIn {
      from { opacity: 0; transform: translateY(12px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// ================= COMPONENT =================
const DoctorProfileManager = () => {
  const [doctor, setDoctor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [assignedServices, setAssignedServices] = useState([]);

  const token = localStorage.getItem("token");

  // =============== LOAD DOCTOR PROFILE ===============
  const fetchDoctorInfo = async () => {
    try {
      const profileRes = await axios.get("http://localhost:5000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { id: userId, name: userName } = profileRes.data;

      const docRes = await axios.get(
        `http://localhost:5000/doctors/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const doctorData = docRes.data
        ? { ...docRes.data, name: docRes.data.name || userName }
        : {
            id: null,
            name: userName,
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

      // Load assigned services
      if (doctorData.id) {
        const serviceRes = await axios.get(
          `http://localhost:5000/doctors/${doctorData.id}/services`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignedServices(serviceRes.data || []);
      } else {
        setAssignedServices([]);
      }
    } catch (err) {
      console.error("Lỗi tải hồ sơ bác sĩ:", err);
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  // =============== FORM HANDLERS ===============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  try {
    let avatarUrl = doctor.avatar;

    // Upload ảnh nếu có
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

    // ⭐ CHỈ GỬI NHỮNG TRƯỜNG LIÊN QUAN TỚI HỒ SƠ BÁC SĨ
    const updatePayload = {
      name: doctor.name,
      title: doctor.title,
      degree: doctor.degree,
      position: doctor.position,
      experience_years: doctor.experience_years,
      phone: doctor.phone,
      description: doctor.description,
      work_history: doctor.work_history,
      education_history: doctor.education_history,
      extra_info: doctor.extra_info,
      avatar: avatarUrl,
    };

    if (!doctor.id) {
      // Nếu bác sĩ chưa có hồ sơ → tạo mới
      const createRes = await axios.post(
        "http://localhost:5000/doctors",
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctor(createRes.data);
    } else {
      // Nếu đã có → chỉ cập nhật hồ sơ
      await axios.put(
        `http://localhost:5000/doctors/${doctor.id}`,
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    alert("💾 Cập nhật thông tin thành công!");
    setEditing(false);
    fetchDoctorInfo(); // ⭐ vẫn lấy lại toàn bộ info, gồm cả service đã phân công

  } catch (err) {
    console.error("❌ Lỗi cập nhật:", err);
    alert("Có lỗi khi lưu thông tin bác sĩ.");
  }
};


  if (!doctor)
    return <p style={{ padding: 30 }}>Đang tải thông tin bác sĩ...</p>;

  // ===================== UI =====================
  return (
    <div
      style={{
        padding: "28px 32px",
        animation: "profileFadeIn .45s ease",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "rgba(255,255,255,0.9)",
          borderRadius: 28,
          padding: "32px 36px",
          boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
          border: "1px solid rgba(203,213,225,0.6)",
        }}
      >
        {/* ================= HEADER ================= */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              overflow: "hidden",
              border: "5px solid #6366f155",
              boxShadow: "0 10px 30px rgba(99,102,241,0.35)",
            }}
          >
            <img
              src={
                avatarPreview ||
                (doctor.avatar
                  ? `http://localhost:5000${doctor.avatar}`
                  : "/default-avatar.png")
              }
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              alt="avatar"
            />
          </div>

          <div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#1e293b",
              }}
            >
              👨‍⚕️ Hồ sơ bác sĩ
            </h2>
            <p style={{ color: "#475569", marginTop: 4 }}>
              Thông tin cá nhân, học vị, kinh nghiệm và các dịch vụ đang phụ
              trách.
            </p>
          </div>
        </div>

        {/* ================= EDIT AVATAR ================= */}
        {editing && (
          <div style={{ marginTop: 14 }}>
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
        )}

        {/* ================= PROFILE FORM ================= */}
        <div style={{ marginTop: 28 }}>
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
            <ProfileRow
              key={field}
              field={field}
              label={label}
              doctor={doctor}
              editing={editing}
              onChange={handleChange}
            />
          ))}
        </div>

        {/* ================= ASSIGNED SERVICES ================= */}
        <div style={{ marginTop: 40 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FiLayers /> Dịch vụ được phân công
          </h3>

          {assignedServices.length > 0 ? (
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {assignedServices.map((s) => (
                <span
                  key={s.id}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 14,
                    background: "rgba(56,189,248,0.15)",
                    border: "1px solid rgba(56,189,248,0.35)",
                    fontSize: 14,
                    color: "#0369a1",
                    fontWeight: 600,
                  }}
                >
                  {s.title} —{" "}
                  <span style={{ opacity: 0.8 }}>
                    {s.department?.name || "Không rõ khoa"}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b", marginTop: 6 }}>
              Chưa có dịch vụ nào được phân công.
            </p>
          )}
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div style={{ marginTop: 34, textAlign: "right" }}>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                style={saveBtn}
              >
                <FiSave /> Lưu thay đổi
              </button>
              <button
                onClick={() => setEditing(false)}
                style={cancelBtn}
              >
                <FiX /> Hủy
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={editBtn}
            >
              <FiEdit2 /> Chỉnh sửa hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileManager;

// =====================================================
// PROFILE ROW COMPONENT
// =====================================================
// =====================================================
// COMPONENT: PROFILE ROW (textarea support)
// =====================================================
const ProfileRow = ({ field, label, doctor, editing, onChange }) => {
  const isMultiline = [
    "description",
    "work_history",
    "education_history",
    "extra_info",
  ].includes(field);

  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      {editing ? (
        isMultiline ? (
          <textarea
            name={field}
            value={doctor[field] || ""}
            onChange={onChange}
            rows={5}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.45)",
              fontSize: 15,
              outline: "none",
              lineHeight: "1.55em",
              resize: "vertical",
              whiteSpace: "pre-wrap",
            }}
            placeholder="Bạn có thể xuống dòng và dùng dấu - để ghi danh sách..."
          />
        ) : (
          <input
            type={field === "experience_years" ? "number" : "text"}
            name={field}
            value={doctor[field] || ""}
            onChange={onChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.45)",
              fontSize: 15,
              outline: "none",
            }}
          />
        )
      ) : (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 14,
            background: "rgba(241,245,249,0.7)",
            border: "1px solid rgba(203,213,225,0.5)",
            fontSize: 15,
            color: "#1e293b",
            whiteSpace: "pre-line", // ⭐ giữ xuống dòng khi hiển thị
            lineHeight: "1.6em",
          }}
        >
          {doctor[field] || "—"}
        </div>
      )}
    </div>
  );
};


// =====================================================
// BUTTON STYLES
// =====================================================
const editBtn = {
  padding: "10px 18px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg,#4f46e5,#2563eb)",
  color: "white",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const saveBtn = {
  padding: "10px 18px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg,#16a34a,#22c55e)",
  color: "white",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  marginRight: 10,
  boxShadow: "0 12px 30px rgba(34,197,94,0.35)",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const cancelBtn = {
  padding: "10px 18px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#1e293b",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};
