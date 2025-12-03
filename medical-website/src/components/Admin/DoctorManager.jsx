import React, { useEffect, useRef, useState } from "react";
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

  const [selectedDeptFilter, setSelectedDeptFilter] = useState(null);

  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showAddConfirmPassword, setShowAddConfirmPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const formRef = useRef(null);

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

  // ========== OPEN ADD ==========
  const scrollToForm = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
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
    setShowAddPassword(false);
    setShowAddConfirmPassword(false);
    scrollToForm();
  };

  // ========== EDIT ==========
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
    setShowEditPassword(false);
    scrollToForm();
  };

  // ========== DELETE ==========
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bác sĩ này?")) {
      await doctorService.deleteDoctor(id);
      alert("Đã xoá bác sĩ.");
      fetchDoctors();
    }
  };

  // ========== FORM CHANGE ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ========== SUBMIT ==========
  const handleSubmit = async () => {
    try {
      // Chỉ check xác nhận mật khẩu khi THÊM MỚI
      if (!isEditing) {
        if (!formData.password || !formData.confirmPassword) {
          alert("❌ Vui lòng nhập mật khẩu và xác nhận mật khẩu.");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          alert("❌ Mật khẩu xác nhận không khớp!");
          return;
        }
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
        // ========== UPDATE DOCTOR ==========
        const payload = {
          name: formData.name,
          email: formData.email,
          avatar: avatarUrl,
        };

        // Nếu admin nhập mật khẩu mới -> đổi mật khẩu
        if (formData.password && formData.password.trim() !== "") {
          payload.password = formData.password;
        }

        await doctorService.updateDoctor(editingId, payload);

        // Gán chuyên khoa
        await doctorService.setDepartments(editingId, selectedDepartments);

        // Gán dịch vụ theo từng chuyên khoa
        for (const deptId of selectedDepartments) {
          const servicesInDept = services
            .filter((s) => s.departments?.some((d) => d.id === deptId))
            .map((s) => s.id)
            .filter((sid) => selectedServices.includes(sid));

          if (servicesInDept.length > 0) {
            await axios.post(
              `http://localhost:5000/doctors/${editingId}/services`,
              { serviceIds: servicesInDept, departmentId: deptId },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
          }
        }

        alert("✅ Cập nhật thông tin bác sĩ thành công!");
      } else {
        // ========== CREATE DOCTOR ==========
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

        await doctorService.setDepartments(newId, selectedDepartments);

        for (const deptId of selectedDepartments) {
          const servicesInDept = services
            .filter((s) => s.departments?.some((d) => d.id === deptId))
            .map((s) => s.id)
            .filter((sid) => selectedServices.includes(sid));

          if (servicesInDept.length > 0) {
            await axios.post(
              `http://localhost:5000/doctors/${newId}/services`,
              { serviceIds: servicesInDept, departmentId: deptId },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
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

  // ========== FILTER DOCTORS BY DEPT ==========
  const filteredDoctors = selectedDeptFilter
    ? doctors.filter((d) =>
        d.departments?.some((dep) => dep.id === selectedDeptFilter)
      )
    : doctors;

  return (
    <div
      style={{
        padding: 32,
        background: "#f5f7fb",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Quản lý bác sĩ</h2>
          <p style={{ margin: "4px 0", color: "#777" }}>
            Quản lý hồ sơ, chuyên khoa và dịch vụ bác sĩ trong hệ thống.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ➕ Thêm bác sĩ
        </button>
      </div>

      {/* FILTER BY DEPARTMENT */}
      <div
        style={{
          marginBottom: 20,
          padding: 12,
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(15, 23, 42, 0.06)",
        }}
      >
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Lọc theo chuyên khoa</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedDeptFilter(null)}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border:
                selectedDeptFilter === null
                  ? "1px solid transparent"
                  : "1px solid #d4d4d8",
              background:
                selectedDeptFilter === null ? "#2563eb" : "rgba(148, 163, 184, 0.12)",
              color: selectedDeptFilter === null ? "#fff" : "#111827",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Tất cả
          </button>

          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptFilter(dept.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border:
                  selectedDeptFilter === dept.id
                    ? "1px solid transparent"
                    : "1px solid #d4d4d8",
                background:
                  selectedDeptFilter === dept.id
                    ? "#2563eb"
                    : "rgba(148, 163, 184, 0.12)",
                color: selectedDeptFilter === dept.id ? "#fff" : "#111827",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* DOCTOR TABLE */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          padding: 16,
          marginBottom: 32,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ textAlign: "left", padding: 10 }}>Bác sĩ</th>
              <th style={{ textAlign: "left", padding: 10 }}>Email</th>
              <th style={{ textAlign: "left", padding: 10 }}>Chuyên khoa</th>
              <th style={{ textAlign: "center", padding: 10 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: 16, color: "#6b7280" }}
                >
                  Không có bác sĩ nào trong chuyên khoa này.
                </td>
              </tr>
            ) : (
              filteredDoctors.map((d) => (
                <tr key={d.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={
                          d.avatar
                            ? `http://localhost:5000${d.avatar}`
                            : "https://via.placeholder.com/40x40.png?text=Dr"
                        }
                        alt="avatar"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          ID: {d.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 10 }}>{d.user?.email}</td>
                  <td style={{ padding: 10 }}>
                    {d.departments && d.departments.length > 0
                      ? d.departments.map((dep) => dep.name).join(", ")
                      : "—"}
                  </td>
                  <td style={{ padding: 10, textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(d)}
                      style={{
                        padding: "4px 10px",
                        marginRight: 8,
                        borderRadius: 999,
                        border: "none",
                        background: "#0ea5e9",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      ✏ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        border: "none",
                        background: "#ef4444",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      🗑 Xoá
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FORM CARD */}
      {showForm && (
        <div
          ref={formRef}
          style={{
            background: "#ffffff",
            borderRadius: 18,
            boxShadow: "0 18px 45px rgba(15,35,95,0.12)",
            padding: 24,
            maxWidth: 1100,
            margin: "0 auto 40px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>
            {isEditing ? "Cập nhật bác sĩ" : "Thêm bác sĩ mới"}
          </h3>

          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT: AVATAR */}
            <div
              style={{
                width: 260,
                minWidth: 220,
                borderRight: "1px solid #e5e7eb",
                paddingRight: 16,
              }}
            >
              <div style={{ marginBottom: 8, fontWeight: 500 }}>Ảnh đại diện</div>
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  marginBottom: 12,
                }}
              >
                <img
                  src={
                    avatarPreview ||
                    (formData.avatar
                      ? `http://localhost:5000${formData.avatar}`
                      : "https://via.placeholder.com/180x180.png?text=Doctor")
                  }
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setAvatarFile(file);
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
              />
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                Nên dùng ảnh rõ nét, tỷ lệ vuông (1:1), dung lượng &lt; 2MB.
              </p>
            </div>

            {/* RIGHT: FORM FIELDS */}
            <div style={{ flex: 1, minWidth: 300 }}>
              {/* Họ tên */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4 }}>Họ tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4 }}>
                  Email (tài khoản)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>

              {/* PASSWORD AREA */}
              {isEditing ? (
                <>
                  <div style={{ marginBottom: 8, marginTop: 8 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        fontStyle: "italic",
                      }}
                    >
                      Mật khẩu hiện tại đã được mã hoá trên hệ thống, không thể
                      xem lại. Nếu muốn đổi mật khẩu cho bác sĩ, hãy nhập mật khẩu
                      mới phía dưới (tuỳ chọn).
                    </span>
                  </div>
                  <div style={{ marginBottom: 12, position: "relative" }}>
                    <label style={{ display: "block", marginBottom: 4 }}>
                      Mật khẩu mới (tuỳ chọn)
                    </label>
                    <input
                      type={showEditPassword ? "text" : "password"}
                      name="password"
                      placeholder="Để trống nếu không muốn đổi mật khẩu"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px 34px 8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword((v) => !v)}
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(4px)",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      {showEditPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 12, position: "relative" }}>
                    <label style={{ display: "block", marginBottom: 4 }}>
                      Mật khẩu
                    </label>
                    <input
                      type={showAddPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px 34px 8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPassword((v) => !v)}
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(4px)",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      {showAddPassword ? "🙈" : "👁"}
                    </button>
                  </div>

                  <div style={{ marginBottom: 12, position: "relative" }}>
                    <label style={{ display: "block", marginBottom: 4 }}>
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type={showAddConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px 34px 8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowAddConfirmPassword((v) => !v)
                      }
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(4px)",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 16,
                      }}
                    >
                      {showAddConfirmPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </>
              )}

              {/* CHUYÊN KHOA */}
              <div style={{ marginTop: 16, marginBottom: 10 }}>
                <label style={{ fontWeight: 600 }}>Chuyên khoa</label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: 8,
                    gap: 4,
                  }}
                >
                  {departments.map((d) => (
                    <label
                      key={d.id}
                      style={{
                        width: "30%",
                        marginBottom: 4,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(d.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments([
                              ...selectedDepartments,
                              d.id,
                            ]);
                          } else {
                            setSelectedDepartments(
                              selectedDepartments.filter((id) => id !== d.id)
                            );
                          }
                        }}
                        style={{ marginRight: 6 }}
                      />
                      {d.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* DỊCH VỤ THEO CHUYÊN KHOA */}
              <div style={{ marginTop: 16 }}>
                <label style={{ fontWeight: 600 }}>
                  Dịch vụ đảm nhận (lọc theo chuyên khoa)
                </label>

                {selectedDepartments.length === 0 ? (
                  <p style={{ marginTop: 8, color: "#6b7280" }}>
                    🔹 Vui lòng chọn ít nhất một chuyên khoa để hiển thị dịch vụ.
                  </p>
                ) : (
                  selectedDepartments.map((deptId) => {
                    const deptServices = services.filter((s) =>
                      s.departments?.some((d) => d.id === deptId)
                    );
                    const deptName =
                      departments.find((d) => d.id === deptId)?.name ||
                      "Chuyên khoa khác";

                    return (
                      <div
                        key={deptId}
                        style={{
                          marginTop: 14,
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 12px",
                            background: "#eff6ff",
                            fontWeight: 500,
                            color: "#1d4ed8",
                          }}
                        >
                          🏥 {deptName}
                        </div>

                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            background: "#fafafa",
                            fontSize: 13,
                          }}
                        >
                          <thead>
                            <tr style={{ background: "#f3f4f6" }}>
                              <th
                                style={{
                                  padding: 8,
                                  borderBottom: "1px solid #e5e7eb",
                                  width: 80,
                                }}
                              >
                                Chọn
                              </th>
                              <th
                                style={{
                                  padding: 8,
                                  borderBottom: "1px solid #e5e7eb",
                                  textAlign: "left",
                                }}
                              >
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
                                    padding: 10,
                                    color: "#9ca3af",
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
                                      padding: 6,
                                      borderTop: "1px solid #e5e7eb",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedServices.includes(s.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedServices([
                                            ...selectedServices,
                                            s.id,
                                          ]);
                                        } else {
                                          setSelectedServices(
                                            selectedServices.filter(
                                              (id) => id !== s.id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      padding: 6,
                                      borderTop: "1px solid #e5e7eb",
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

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 500,
                    marginRight: 10,
                  }}
                >
                  {isEditing ? "💾 Lưu thay đổi" : "➕ Thêm bác sĩ"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "1px solid #d4d4d8",
                    background: "#fff",
                    color: "#111827",
                    cursor: "pointer",
                  }}
                >
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManager;
