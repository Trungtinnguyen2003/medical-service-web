import React, { useEffect, useState } from "react";
import axios from "axios";
import doctorService from "../../services/doctorService";
import departmentService from "../../services/departmentService";
import serviceService from "../../services/serviceService";

const initialDoctor = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  avatar: "",
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
    setIsEditing(true);
    setEditingId(doctor.id);
    setShowForm(true);

    setFormData({
      name: doctor.name || "",
      email: doctor.user?.email || "",
      password: "",
      confirmPassword: "",
      avatar: doctor.avatar || "",
    });

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
      if (formData.password !== formData.confirmPassword) {
        alert("❌ Mật khẩu xác nhận không khớp!");
        return;
      }

      let avatarUrl = formData.avatar;
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload/image",
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        avatarUrl = uploadRes.data.url;
      }

      if (isEditing) {
        // ✅ CẬP NHẬT BÁC SĨ
        const payload = {
          ...formData,
          avatar: avatarUrl,
        };
        await doctorService.updateDoctor(editingId, payload);
        await doctorService.setDepartments(editingId, selectedDepartments);
        for (const deptId of selectedDepartments) {
  const servicesInDept = services
    .filter((s) => s.departments?.some((d) => d.id === deptId))
    .map((s) => s.id)
    .filter((sid) => selectedServices.includes(sid));

  if (servicesInDept.length > 0) {
    await axios.post(
      `http://localhost:5000/doctors/${editingId}/services`,
      { serviceIds: servicesInDept, departmentId: deptId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
  }
}

        alert("✅ Cập nhật thông tin bác sĩ thành công!");
      } else {
  // ✅ THÊM BÁC SĨ MỚI + PHÂN CÔNG CHUYÊN KHOA & DỊCH VỤ
  const payload = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    avatar: avatarUrl,
  };

  const res = await axios.post(
    "http://localhost:5000/doctors/with-account",
    payload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const newId = res.data?.doctor?.id;
  if (!newId) {
    alert("Không lấy được ID bác sĩ.");
    return;
  }

  // ✅ Gán chuyên khoa
  await doctorService.setDepartments(newId, selectedDepartments);

  // ✅ Gán dịch vụ theo từng chuyên khoa (có departmentId)
  for (const deptId of selectedDepartments) {
    const servicesInDept = services
      .filter((s) => s.departments?.some((d) => d.id === deptId))
      .map((s) => s.id)
      .filter((sid) => selectedServices.includes(sid));

    if (servicesInDept.length > 0) {
      await axios.post(
        `http://localhost:5000/doctors/${newId}/services`,
        { serviceIds: servicesInDept, departmentId: deptId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    }
  }

  alert("✅ Đã thêm bác sĩ & gán chuyên khoa, dịch vụ thành công!");
}


      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      console.error("❌ Lỗi submit:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xử lý.");
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
            <th>Email</th>
            <th>Chức danh</th>
            <th>Kinh nghiệm</th>
            <th>Điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.user?.email}</td>
              <td>{d.title || "—"}</td>
              <td>{d.experience_years || 0} năm</td>
              <td>{d.phone || "—"}</td>
              <td>
                <button onClick={() => handleEdit(d)}>✏️ Sửa</button>{" "}
                <button onClick={() => handleDelete(d.id)}>🗑️ Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <h3>{isEditing ? "🛠 Sửa thông tin bác sĩ" : "➕ Thêm bác sĩ mới"}</h3>

          {/* Thông tin tài khoản */}
          {[
            { field: "name", label: "Họ và tên" },
            { field: "email", label: "Email (tài khoản)" },
            { field: "password", label: "Mật khẩu (để đổi nếu cần)" },
            { field: "confirmPassword", label: "Xác nhận mật khẩu" },
          ].map(({ field, label }) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ width: 200, display: "inline-block" }}>
                {label}
              </label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={{ width: "60%" }}
              />
            </div>
          ))}

          {/* Ảnh đại diện */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ width: 200, display: "inline-block" }}>
              Ảnh đại diện
            </label>
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
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
          )}

          {/* Chuyên khoa */}
          <div style={{ marginBottom: 20 }}>
            <label>
              <strong>Chuyên khoa</strong>
            </label>
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
                        setSelectedDepartments(
                          selectedDepartments.filter((id) => id !== d.id)
                        );
                      }
                    }}
                  />{" "}
                  {d.name}
                </label>
              ))}
            </div>
          </div>

          {/* Dịch vụ đảm nhận */}
          {/* Dịch vụ đảm nhận (lọc theo chuyên khoa) */}
<div style={{ marginBottom: 20 }}>
  <label>
    <strong>Dịch vụ đảm nhận (lọc theo chuyên khoa)</strong>
  </label>

  {selectedDepartments.length === 0 ? (
    <p style={{ marginTop: 10, color: "#777" }}>
      🔹 Vui lòng chọn ít nhất một chuyên khoa để hiển thị dịch vụ.
    </p>
  ) : (
    selectedDepartments.map((deptId) => {
      const deptServices = services.filter((s) =>
        s.departments?.some((d) => d.id === deptId)
      );

      const deptName =
        departments.find((d) => d.id === deptId)?.name || "Chuyên khoa khác";

      return (
        <div key={deptId} style={{ marginTop: 15 }}>
          <h4 style={{ color: "#007bff", fontSize: 16, marginBottom: 6 }}>
            🏥 {deptName}
          </h4>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fafafa",
              borderRadius: 8,
            }}
          >
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                  Chọn
                </th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                  Tên dịch vụ
                </th>
              </tr>
            </thead>
            <tbody>
              {deptServices.length === 0 ? (
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      color: "#888",
                    }}
                  >
                    (Không có dịch vụ nào trong khoa này)
                  </td>
                </tr>
              ) : (
                deptServices.map((s) => (
                  <tr key={s.id}>
                    <td
                      style={{
                        textAlign: "center",
                        border: "1px solid #ddd",
                        padding: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(s.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, s.id]);
                          } else {
                            setSelectedServices(
                              selectedServices.filter((id) => id !== s.id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "6px",
                        border: "1px solid #ddd",
                        fontSize: 14,
                      }}
                    >
                      {s.title}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
    })
  )}
</div>


          <button onClick={handleSubmit}>
            {isEditing ? "💾 Lưu thay đổi" : "➕ Thêm mới"}
          </button>
          <button onClick={() => setShowForm(false)} style={{ marginLeft: 10 }}>
            Huỷ
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorManager;
