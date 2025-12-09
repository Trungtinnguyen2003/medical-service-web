// =========================
// AppointmentManager.jsx (LEVEL S Hospital UI + FULL LOGIC)
// =========================

import React, { useEffect, useState, useMemo } from "react";
import appointmentService from "../../services/appointmentService";
import departmentService from "../../services/departmentService";
import doctorService from "../../services/doctorService";
import serviceService from "../../services/serviceService";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiTrash2,
  FiEdit,
  FiInfo,
  FiCheck,
  FiX,
  FiFilter,
  FiSearch,
} from "react-icons/fi";

// =========================
// REUSABLE STYLES
// =========================

const pageWrapper = {
  padding: "24px 32px",
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #eef2ff 0%, #ffffff 40%, #e0f2fe 100%)",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: 800,
  color: "#1e3a8a",
  letterSpacing: "0.02em",
};

const cardStyle = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: "22px",
  padding: "18px 22px 22px",
  border: "1px solid rgba(203,213,225,0.7)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.10)",
};

const sectionHeaderStyle = {
  fontSize: "16px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#1e40af",
  marginBottom: 12,
};

const tagStyle = {
  fontSize: 12,
  color: "#64748b",
};

const filterRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
  marginTop: 10,
};

const searchWrapperStyle = {
  position: "relative",
  minWidth: 260,
  maxWidth: 360,
  flex: "1 1 260px",
};

const searchInputStyle = {
  width: "100%",
  borderRadius: 999,
  border: "1px solid #cbd5e1",
  padding: "8px 34px 8px 32px",
  fontSize: 13,
  outline: "none",
  background: "#ffffff",
};

const searchIconStyle = {
  position: "absolute",
  left: 10,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#94a3b8",
  fontSize: 14,
};

const statusFilterGroup = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const statusFilterButton = (active) => ({
  borderRadius: 999,
  border: "1px solid",
  borderColor: active ? "#1d4ed8" : "#e2e8f0",
  background: active ? "#1d4ed8" : "#f8fafc",
  color: active ? "#ffffff" : "#1e293b",
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
});

const tableWrapper = {
  borderRadius: 22,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  marginTop: 10,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  background: "linear-gradient(135deg, #eef2ff, #e0f2fe)",
  padding: "10px 10px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: 12,
  color: "#1e293b",
  borderBottom: "1px solid #cbd5e1",
};

const tdStyle = {
  padding: "10px 10px",
  fontSize: 12,
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  verticalAlign: "top",
};

const statusBadge = {
  pending: {
    background: "#fef9c3",
    color: "#ca8a04",
  },
  confirmed: {
    background: "#dcfce7",
    color: "#15803d",
  },
  cancelled: {
    background: "#fee2e2",
    color: "#b91c1c",
  },
  done: {
    background: "#e2e8f0",
    color: "#475569",
  },
};

const badgeStyle = (status) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  ...statusBadge[status],
});

// =========================
// MODAL STYLES
// =========================

const modalOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(15,23,42,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
};

const modalCard = {
  background: "white",
  borderRadius: 24,
  width: "760px",
  maxWidth: "95%",
  boxShadow: "0 24px 60px rgba(15,23,42,0.35)",
  overflow: "hidden",
};

const modalHeader = {
  padding: "14px 20px",
  background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const modalTitle = {
  fontSize: 16,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const modalBody = {
  padding: "16px 18px 20px",
  background: "linear-gradient(145deg,#f8fafc,#eef2ff)",
};

const modalFooter = {
  padding: "12px 18px 16px",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  background: "#f8fafc",
};

const modalLabel = {
  fontSize: 12,
  fontWeight: 600,
  color: "#475569",
  marginBottom: 4,
};

const modalInput = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  padding: "8px 10px",
  fontSize: 13,
  outline: "none",
  background: "white",
};

const modalSelect = {
  ...modalInput,
  appearance: "none",
};

const modalSmallText = {
  fontSize: 11,
  color: "#64748b",
};

const buttonPrimary = {
  borderRadius: 999,
  border: "none",
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 700,
  color: "white",
  background:
    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 40%, #0ea5e9 100%)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const buttonGhost = {
  borderRadius: 999,
  border: "1px solid #cbd5e1",
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
  background: "white",
  cursor: "pointer",
};

// =========================
// LOGIC
// =========================

const initialForm = {
  name: "",
  email: "",
  phone: "",
  gender: "Nam",
  date_of_birth: "",
  address: "",
  department_id: "",
  service_id: "",
  doctor_id: "",
  appointment_date: "",
  appointment_time: "",
  symptoms: "",
};

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

  // filter & search
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAppointments();
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [deptRes, doctorRes, serviceRes] = await Promise.all([
        departmentService.getAll(),
        doctorService.getAllDoctors(),
        serviceService.getAllServices(),
      ]);
      setDepartments(deptRes);
      setDoctors(doctorRes);
      setServices(serviceRes);
    } catch (err) {
      console.error("Lỗi tải dropdown:", err);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      console.error("Lỗi tải lịch:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department_id" ? { service_id: "", doctor_id: "" } : {}),
    }));
  };

  // load slots theo doctor + date
useEffect(() => {
  // ⭐ Khi edit thì không load lại slot (vì đã load bằng fetchSlotsForEdit)
  if (isEditing) return;

  const fetchSlots = async () => {
    if (!formData.doctor_id || !formData.appointment_date) {
      setAvailableSlots([]);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/doctors/${formData.doctor_id}/available-slots?date=${formData.appointment_date}`
      );
      const data = await res.json();
      setAvailableSlots(data);
    } catch (err) {
      console.error("❌ Lỗi tải khung giờ:", err);
      setAvailableSlots([]);
    }
  };

  fetchSlots();
}, [formData.doctor_id, formData.appointment_date, isEditing]);



  // load services & doctors theo department
  useEffect(() => {
    const loadRelated = async () => {
      if (!formData.department_id) {
        setServices([]);
        setDoctors([]);
        return;
      }
      try {
        const [srv, docs] = await Promise.all([
          departmentService.getServicesByDepartment(formData.department_id),
          departmentService.getDoctorsByDepartment(formData.department_id),
        ]);
        setServices(srv);
        setDoctors(docs);
      } catch (err) {
        console.error("Lỗi tải dịch vụ/bác sĩ theo khoa:", err);
      }
    };
    loadRelated();
  }, [formData.department_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing || !editId) return;
    try {
      await appointmentService.update(editId, formData);
      alert("Cập nhật lịch hẹn thành công!");
      setFormData(initialForm);
      setIsEditing(false);
      setEditId(null);
      loadAppointments();
    } catch (err) {
      alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchSlotsForEdit = async (doctorId, date) => {
  try {
    const res = await fetch(
      `http://localhost:5000/doctors/${doctorId}/available-slots?date=${date}`
    );

    const data = await res.json();

    setAvailableSlots(data);
  } catch (err) {
    console.error("Lỗi tải slot khi edit:", err);
    setAvailableSlots([]);
  }
};


const handleEdit = (appt) => {
  
  const p = appt.patientProfile;

  setFormData({
    name: p?.full_name || "",
    email: p?.email || "",
    phone: p?.phone || "",
    gender: p?.gender || "Nam",
    date_of_birth: p?.date_of_birth || "",
    address: p?.address || "",

    department_id: appt.department?.id || appt.department_id || "",
    service_id: appt.bookedService?.id || appt.service_id || "",
    doctor_id: appt.appointedDoctor?.id || appt.doctor_id || "",
    appointment_date: appt.appointment_date || "",
    appointment_time: appt.appointment_time || "",
    symptoms: appt.symptoms || "",
  });

  setIsEditing(true);
  setEditId(appt.id);

    // ⭐ LOAD SLOT ĐÚNG CỦA BÁC SĨ NGAY LÚC NHẤN SỬA
  if (appt.appointedDoctor?.id && appt.appointment_date) {
    fetchSlotsForEdit(appt.appointedDoctor.id, appt.appointment_date);
  }
};


  const handleApprove = async (id) => {
    try {
      await appointmentService.approve(id);
      loadAppointments();
      alert("✅ Đã duyệt lịch!");
    } catch (err) {
      alert("❌ Lỗi duyệt: " + err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Lý do từ chối:");
    if (!reason) return;
    try {
      await appointmentService.reject(id, reason);
      loadAppointments();
      alert("❌ Đã từ chối lịch!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá lịch hẹn này?")) return;
    try {
      await appointmentService.remove(id);
      alert("🗑️ Đã xoá lịch hẹn thành công!");
      loadAppointments();
    } catch (err) {
      alert("❌ Lỗi xoá: " + (err.response?.data?.message || err.message));
    }
  };

  // =========================
  // FILTER + SEARCH
  // =========================

  const filteredAppointments = useMemo(() => {
    let data = [...appointments];

    if (statusFilter !== "all") {
      data = data.filter((a) => a.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      data = data.filter((a) => {
        const p = a.patientProfile;
        const name = p?.full_name?.toLowerCase() || "";
        const phone = p?.phone?.toLowerCase() || "";
        return name.includes(keyword) || phone.includes(keyword);
      });
    }

    return data;
  }, [appointments, statusFilter, searchTerm]);

  // =========================
  // RENDER
  // =========================

  const renderStatusBadge = (status) => {
    return (
      <span style={badgeStyle(status)}>
        {status === "pending" && "Chờ duyệt"}
        {status === "confirmed" && "Đã duyệt"}
        {status === "cancelled" && "Từ chối"}
        {status === "done" && "Hoàn tất"}
      </span>
    );
  };

  return (
    <div style={pageWrapper}>
      {/* TITLE */}
      <div style={titleStyle}>📅 Quản Lý Lịch Hẹn</div>

      {/* FILTER BAR CARD */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <FiFilter size={16} /> Bộ lọc & tìm kiếm
        </div>
        <div style={tagStyle}>
          Lọc nhanh lịch hẹn theo trạng thái, tên bệnh nhân hoặc số điện thoại.
        </div>

        <div style={filterRowStyle}>
          {/* SEARCH */}
          <div style={searchWrapperStyle}>
            <FiSearch style={searchIconStyle} />
            <input
              type="text"
              placeholder="Tìm theo tên bệnh nhân hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          {/* STATUS FILTER */}
          <div style={statusFilterGroup}>
            {[
              { key: "all", label: "Tất cả" },
              { key: "pending", label: "Chờ duyệt" },
              { key: "confirmed", label: "Đã duyệt" },
              { key: "cancelled", label: "Từ chối" },
              { key: "done", label: "Hoàn tất" },
            ].map((s) => (
              <button
                key={s.key}
                type="button"
                style={statusFilterButton(statusFilter === s.key)}
                onClick={() => setStatusFilter(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <FiInfo size={16} /> Danh sách lịch hẹn
        </div>

        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: 40, textAlign: "center" }}>#</th>
                <th style={{ ...thStyle, minWidth: 220 }}>Bệnh nhân</th>
                <th style={{ ...thStyle, width: 140, textAlign: "center" }}>
                  Chuyên khoa
                </th>
                <th style={{ ...thStyle, width: 140, textAlign: "center" }}>
                  Bác sĩ
                </th>
                <th style={{ ...thStyle, width: 90, textAlign: "center" }}>
                  Ngày
                </th>
                <th style={{ ...thStyle, width: 80, textAlign: "center" }}>
                  Giờ
                </th>
                <th style={{ ...thStyle, width: 110, textAlign: "center" }}>
                  Trạng thái
                </th>
                <th style={{ ...thStyle, width: 170, textAlign: "center" }}>
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((a, i) => {
                const p = a.patientProfile;
                return (
                  <tr key={a.id}>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {i + 1}
                    </td>

                    {/* BỆNH NHÂN */}
                    <td style={tdStyle}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#4c1d95",
                          fontSize: 13,
                          marginBottom: 2,
                        }}
                      >
                        {p?.full_name}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569" }}>
                        <b>Giới tính:</b> {p?.gender}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569" }}>
                        <b>Ngày sinh:</b> {p?.date_of_birth}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569" }}>
                        <b>SĐT:</b> {p?.phone}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569" }}>
                        <b>Địa chỉ:</b> {p?.address}
                      </div>
                      {/* XEM THÊM */}
                      <details
                        style={{
                          marginTop: 4,
                          fontSize: 11,
                          cursor: "pointer",
                          background: "#f8fafc",
                          padding: "6px 8px",
                          borderRadius: 10,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <summary
                          style={{
                            color: "#2563eb",
                            fontWeight: 600,
                            listStyle: "none",
                          }}
                        >
                          Xem thêm
                        </summary>
                        <div style={{ marginTop: 4, color: "#475569" }}>
                          <div>
                            <b>Nghề nghiệp:</b> {p?.job}
                          </div>
                          <div>
                            <b>Dân tộc:</b> {p?.ethnicity}
                          </div>
                          <div>
                            <b>Quốc gia:</b> {p?.nationality}
                          </div>
                          <div>
                            <b>Loại giấy tờ:</b> {p?.id_type}
                          </div>
                          <div>
                            <b>Số định danh:</b> {p?.id_number}
                          </div>
                        </div>
                      </details>
                    </td>

                    {/* KHOA */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {a.department?.name}
                    </td>

                    {/* BÁC SĨ */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {a.appointedDoctor?.name}
                    </td>

                    {/* NGÀY */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {a.appointment_date}
                    </td>

                    {/* GIỜ */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {a.appointment_time}
                    </td>

                    {/* TRẠNG THÁI */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      {renderStatusBadge(a.status)}
                    </td>

                    {/* THAO TÁC */}
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        {/* SỬA */}
                        <button
                          onClick={() => handleEdit(a)}
                          style={{
                            borderRadius: 999,
                            border: "none",
                            padding: "6px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "white",
                            background:
                              "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <FiEdit size={12} /> Sửa
                        </button>

                        {/* DUYỆT / TỪ CHỐI chỉ khi pending */}
                        {a.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(a.id)}
                              style={{
                                borderRadius: 999,
                                border: "none",
                                padding: "6px 10px",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "white",
                                background:
                                  "linear-gradient(135deg,#22c55e,#16a34a)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <FiCheck size={12} /> Duyệt
                            </button>

                            <button
                              onClick={() => handleReject(a.id)}
                              style={{
                                borderRadius: 999,
                                border: "none",
                                padding: "6px 10px",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "white",
                                background:
                                  "linear-gradient(135deg,#f97373,#ef4444)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <FiX size={12} /> Từ chối
                            </button>
                          </>
                        )}

                        {/* XOÁ */}
                        {/* <button
                          onClick={() => handleDelete(a.id)}
                          style={{
                            borderRadius: 999,
                            border: "none",
                            padding: "6px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#ffffff",
                            background:
                              "linear-gradient(135deg,#6b7280,#4b5563)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <FiTrash2 size={12} /> Xoá
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      padding: "18px 10px",
                      fontStyle: "italic",
                      color: "#94a3b8",
                    }}
                  >
                    Không có lịch hẹn nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT LỊCH HẸN */}
      {isEditing && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={modalHeader}>
              <div style={modalTitle}>
                <FiCalendar /> Chỉnh sửa lịch hẹn #{editId}
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData(initialForm);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={modalBody}>
                {/* THÔNG TIN CHUNG & LỊCH */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1.2fr 1fr",
                    gap: 14,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={modalLabel}>Chuyên khoa</div>
                    <select
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      style={modalSelect}
                    >
                      <option value="">-- Chọn chuyên khoa --</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <div style={modalSmallText}>
                      Thay đổi chuyên khoa sẽ cập nhật lại danh sách dịch vụ &
                      bác sĩ.
                    </div>
                  </div>

                  <div>
                    <div style={modalLabel}>Bác sĩ</div>
                    <select
                      name="doctor_id"
                      value={formData.doctor_id}
                      onChange={handleChange}
                      style={modalSelect}
                    >
                      <option value="">-- Chọn bác sĩ --</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div style={modalLabel}>Ngày khám</div>
                    <input
                      type="date"
                      name="appointment_date"
                      value={formData.appointment_date}
                      onChange={handleChange}
                      style={modalInput}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={modalLabel}>Khung giờ</div>
                    <select
                      name="appointment_time"
                      value={formData.appointment_time}
                      onChange={handleChange}
                      style={modalSelect}
                    >
                      <option value="">-- Chọn khung giờ bác sĩ --</option>
                      {availableSlots.map((slot) => (
                        <option
                          key={slot.id}
                          value={slot.label}
                          disabled={slot.isBooked}
                        >
                          {slot.label} {slot.isBooked ? "🔒 (Đã có lịch)" : ""}
                        </option>
                      ))}
                    </select>
                    <div style={modalSmallText}>
                      Các khung giờ có biểu tượng 🔒 là đã có lịch khác.
                    </div>
                  </div>

                  {/* <div>
                    <div style={modalLabel}>Triệu chứng / ghi chú</div>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleChange}
                      rows={3}
                      style={{
                        ...modalInput,
                        resize: "vertical",
                        minHeight: 60,
                      }}
                      placeholder="Triệu chứng hoặc ghi chú thêm của bệnh nhân (nếu có)"
                    />
                  </div> */}
                </div>

                {/* THÔNG TIN BỆNH NHÂN (READ-ONLY / OPTIONAL) */}
                <div
                  style={{
                    marginTop: 6,
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.8)",
                    border: "1px dashed #cbd5e1",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1e293b",
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FiUser /> Thông tin bệnh nhân (tham khảo)
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1fr 1fr",
                      gap: 10,
                      fontSize: 12,
                      color: "#475569",
                    }}
                  >
                    <div>
                      <b>Họ tên:</b> {formData.name || "—"}
                    </div>
                    <div>
                      <b>Giới tính:</b> {formData.gender || "—"}
                    </div>
                    <div>
                      <b>Ngày sinh:</b> {formData.date_of_birth || "—"}
                    </div>
                    {/* <div>
                      <b>Email:</b> {formData.email || "—"}
                    </div> */}
                    <div>
                      <b>SĐT:</b> {formData.phone || "—"}
                    </div>
                    <div>
                      <b>Địa chỉ:</b> {formData.address || "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div style={modalFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditId(null);
                    setFormData(initialForm);
                  }}
                  style={buttonGhost}
                >
                  Hủy
                </button>
                <button type="submit" style={buttonPrimary}>
                  <FiCheck /> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManager;
