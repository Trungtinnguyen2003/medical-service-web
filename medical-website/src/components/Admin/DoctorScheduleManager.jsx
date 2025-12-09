// src/components/Doctor/DoctorScheduleManager.jsx
import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiTrash2,
  FiEdit2,
  FiPlusCircle,
  FiSearch,
  FiRefreshCw,
  FiLayers,
  FiX,
} from "react-icons/fi";

import doctorScheduleService from "../../services/doctorScheduleService";
import doctorService from "../../services/doctorService";
import timeSlotService from "../../services/timeSlotService";
import departmentService from "../../services/departmentService";

// ================== ANIMATION ==================
if (
  typeof document !== "undefined" &&
  !document.getElementById("doctor-schedule-page-style")
) {
  const styleEl = document.createElement("style");
  styleEl.id = "doctor-schedule-page-style";
  styleEl.textContent = `
    @keyframes doctorScheduleFadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes doctorScheduleModalFade {
      from { opacity: 0; transform: translateY(10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(styleEl);
}

// ================== CONSTANTS ==================
const daysOfWeek = [
  { value: "1", label: "Thứ 2" },
  { value: "2", label: "Thứ 3" },
  { value: "3", label: "Thứ 4" },
  { value: "4", label: "Thứ 5" },
  { value: "5", label: "Thứ 6" },
  { value: "6", label: "Thứ 7" },
  { value: "7", label: "Chủ nhật" },
];

const sessions = [
  { value: "morning", label: "Sáng ☀️" },
  { value: "afternoon", label: "Chiều 🌇" },
];

// ================== STYLE OBJECTS ==================
const pageWrapperStyle = {
  minHeight: "100vh",
  padding: "24px 32px 32px",
  background:
    "linear-gradient(135deg, #eef2ff 0%, #f9fafb 40%, #fdf2ff 100%)",
  animation: "doctorScheduleFadeIn 0.4s ease",
};

const pageHeaderStyle = {
  marginBottom: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const pageTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const titleIconStyle = {
  width: 40,
  height: 40,
  borderRadius: "999px",
  background:
    "radial-gradient(circle at 30% 10%, #fef9c3, #f97316 40%, #7c2d12 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  boxShadow: "0 10px 30px rgba(249,115,22,0.5)",
};

const pageTitleTextStyle = {
  display: "flex",
  flexDirection: "column",
};

const mainTitleStyle = {
  fontSize: 24,
  fontWeight: 800,
  letterSpacing: "0.03em",
  color: "#111827",
};

const subTitleStyle = {
  fontSize: 13,
  color: "#6b7280",
};

const smallBadgeStyle = {
  padding: "5px 11px",
  borderRadius: 999,
  background: "rgba(59,130,246,0.08)",
  border: "1px solid rgba(59,130,246,0.2)",
  fontSize: 12,
  color: "#1d4ed8",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const bodyLayoutStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.96)",
  borderRadius: 20,
  padding: "16px 18px 18px",
  boxShadow: "0 18px 40px rgba(15,23,42,0.10)",
  border: "1px solid rgba(203,213,225,0.85)",
};

const cardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12,
};

const cardHeaderLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const cardIconWrapperStyle = {
  width: 30,
  height: 30,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #e0f2fe, #eff6ff)",
  color: "#1d4ed8",
};

const cardTitleTextStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0f172a",
};

const sectionLabelStyle = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4,
  color: "#475569",
};

const selectInputStyle = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  padding: "8px 10px",
  fontSize: 13,
  outline: "none",
  background: "white",
};

const textInputStyle = {
  width: "100%",
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  padding: "7px 10px",
  fontSize: 13,
  outline: "none",
  background: "white",
};

const chipGroupStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chipStyle = (active) => ({
  padding: "6px 10px",
  borderRadius: 999,
  border: active ? "1px solid #6366f1" : "1px solid #e5e7eb",
  background: active ? "rgba(79,70,229,0.08)" : "#f9fafb",
  fontSize: 12.5,
  color: active ? "#312e81" : "#4b5563",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  cursor: "pointer",
});

const checkboxStyle = { marginRight: 6 };

const tableWrapperStyle = {
  marginTop: 8,
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  tableLayout: "auto",
  fontSize: 13,
};

const thStyle = {
  padding: "9px 10px",
  background:
    "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 40%, #eff6ff 100%)",
  borderBottom: "1px solid #cbd5e1",
  fontWeight: 600,
  color: "#0f172a",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "6px 10px",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "middle",
};

const doctorGroupRowStyle = {
  background:
    "linear-gradient(90deg, rgba(79,70,229,0.05), rgba(59,130,246,0.03))",
};

const primaryBtnStyle = {
  padding: "9px 16px",
  borderRadius: 999,
  border: "none",
  background:
    "linear-gradient(135deg, #4f46e5 0%, #2563eb 45%, #0ea5e9 100%)",
  color: "white",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 12px 30px rgba(37,99,235,0.40)",
};

const ghostBtnStyle = {
  padding: "7px 12px",
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  background: "white",
  color: "#374151",
  fontWeight: 500,
  fontSize: 12,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

// ================== HELPER ==================
const createEmptyRow = () => ({
  id: Date.now() + Math.random(),
  day_of_week: "",
  session: "",
  slotIds: [],
});

// ================== MAIN COMPONENT ==================
const DoctorScheduleManager = () => {
  const token = localStorage.getItem("token");

  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [rows, setRows] = useState([createEmptyRow()]);

  const [filterDeptId, setFilterDeptId] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");

  const [selectedDeleteIds, setSelectedDeleteIds] = useState([]);

  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingSlotIds, setEditingSlotIds] = useState([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const [loading, setLoading] = useState(false);

  // -------- LOAD DATA --------
  const loadAll = async () => {
    try {
      setLoading(true);
      const [resSch, resDoc, resSlot, resDept] = await Promise.allSettled([
        doctorScheduleService.getAll(token),
        doctorService.getAllDoctors(),
        timeSlotService.getAll(),
        departmentService.getAll(),
      ]);

      if (resSch.status === "fulfilled") {
        const list =
          resSch.value?.data?.map((s) => ({
            ...s,
            timeSlots: s.timeSlots || [],
          })) || [];
        setSchedules(list);
      }

      if (resDoc.status === "fulfilled") {
        const docData = resDoc.value?.data || resDoc.value || [];
        setDoctors(docData);
      }

      if (resSlot.status === "fulfilled") {
        setTimeSlots(resSlot.value?.data || resSlot.value || []);
      }

      if (resDept.status === "fulfilled") {
        setDepartments(resDept.value?.data || resDept.value || []);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu lịch bác sĩ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------- FORM HANDLERS --------
  const updateRowField = (rowId, field, value) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? {
              ...r,
              [field]: value,
              ...(field === "session" ? { slotIds: [] } : {}),
            }
          : r
      )
    );
  };

  const toggleRowSlot = (rowId, slotId) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? {
              ...r,
              slotIds: r.slotIds.includes(slotId)
                ? r.slotIds.filter((id) => id !== slotId)
                : [...r.slotIds, slotId],
            }
          : r
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (rowId) => {
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((r) => r.id !== rowId)
    );
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      return alert("Vui lòng chọn bác sĩ để phân công lịch.");
    }

    const validRows = rows.filter(
      (r) => r.day_of_week && r.session && r.slotIds.length > 0
    );

    if (validRows.length === 0) {
      return alert(
        "Vui lòng chọn đầy đủ Thứ, Buổi và ít nhất một khung giờ cho mỗi dòng."
      );
    }

    try {
      setLoading(true);
      for (const row of validRows) {
        const scheduleRes = await doctorScheduleService.create(
          {
            doctor_id: selectedDoctorId,
            day_of_week: row.day_of_week,
            session: row.session,
          },
          token
        );

        const createdId = scheduleRes.data?.id || scheduleRes.id;
        if (createdId) {
          await doctorScheduleService.assignSlots(
            createdId,
            row.slotIds,
            token
          );
        }
      }

      alert("✅ Phân công lịch làm việc thành công!");
      setRows([createEmptyRow()]);
      setSelectedDoctorId("");
      loadAll();
    } catch (err) {
      console.error("Lỗi tạo lịch bác sĩ:", err);
      alert("❌ Có lỗi khi phân công lịch, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // -------- DELETE --------
  const toggleDeleteSelection = (id) => {
    setSelectedDeleteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteOne = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá lịch này?")) return;
    try {
      await doctorScheduleService.remove(id, token);
      loadAll();
    } catch (err) {
      console.error("Lỗi xoá lịch:", err);
      alert("Không thể xoá lịch.");
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedDeleteIds.length === 0)
      return alert("Bạn chưa chọn lịch nào để xoá.");

    if (
      !window.confirm(
        `Bạn có chắc muốn xoá ${selectedDeleteIds.length} lịch đã chọn?`
      )
    )
      return;

    try {
      for (const id of selectedDeleteIds) {
        await doctorScheduleService.remove(id, token);
      }
      setSelectedDeleteIds([]);
      loadAll();
    } catch (err) {
      console.error("Lỗi xoá nhiều lịch:", err);
      alert("Không thể xoá danh sách lịch đã chọn.");
    }
  };

  // -------- EDIT --------
  const openEdit = (schedule) => {
    setEditingSchedule(schedule);
    const ids = (schedule.timeSlots || []).map((t) => t.id);
    setEditingSlotIds(ids);
  };

  const toggleEditSlot = (slotId) => {
    setEditingSlotIds((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSaveEdit = async () => {
    if (!editingSchedule) return;
    try {
      setSavingEdit(true);
      await doctorScheduleService.assignSlots(
        editingSchedule.id,
        editingSlotIds,
        token
      );
      alert("✅ Cập nhật khung giờ làm việc thành công.");
      setEditingSchedule(null);
      setEditingSlotIds([]);
      loadAll();
    } catch (err) {
      console.error("Lỗi cập nhật lịch:", err);
      alert("Không thể cập nhật khung giờ.");
    } finally {
      setSavingEdit(false);
    }
  };

  // -------- FILTERED DATA --------
  const filteredSchedules = schedules.filter((s) => {
    // Lọc theo chuyên khoa
    if (filterDeptId) {
      const doctor = doctors.find((d) => d.id === s.doctor_id);
      if (!doctor) return false;
      const inDept = doctor.departments?.some(
        (dep) => String(dep.id) === String(filterDeptId)
      );
      if (!inDept) return false;
    }

    // Lọc theo thứ
    if (filterDay && String(s.day_of_week) !== String(filterDay)) {
      return false;
    }

    // Search tên bác sĩ
    if (
      searchDoctor &&
      !s.doctor?.name
        ?.toLowerCase()
        .includes(searchDoctor.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // group theo bác sĩ
  const groupedByDoctor = filteredSchedules.reduce((acc, sch) => {
    const key = sch.doctor?.name || "Không xác định";
    if (!acc[key]) acc[key] = [];
    acc[key].push(sch);
    return acc;
  }, {});

  // danh sách bác sĩ ở form tạo (lọc theo chuyên khoa đã chọn nếu có)
  const doctorOptions = doctors.filter((doc) => {
    if (!filterDeptId) return true;
    return doc.departments?.some(
      (d) => String(d.id) === String(filterDeptId)
    );
  });

  // ================== RENDER ==================
  return (
    <div style={pageWrapperStyle}>
      {/* HEADER */}
      <div style={pageHeaderStyle}>
        <div style={pageTitleStyle}>
          <div style={titleIconStyle}>
            <FiCalendar size={22} />
          </div>
          <div style={pageTitleTextStyle}>
            <div style={mainTitleStyle}>Quản lý lịch làm việc bác sĩ</div>
            <div style={subTitleStyle}>
              Phân công – chỉnh sửa – theo dõi lịch khám chi tiết cho từng bác
              sĩ, từng khung giờ.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={smallBadgeStyle}>
            <FiClock size={14} />
            Quản lý slot khám theo chuẩn bệnh viện
          </div>
          <button
            style={{ ...ghostBtnStyle, alignSelf: "flex-end" }}
            onClick={loadAll}
          >
            <FiRefreshCw size={14} /> Làm mới dữ liệu
          </button>
        </div>
      </div>

      <div style={bodyLayoutStyle}>
        {/* ================== CARD TẠO LỊCH (TRÊN) ================== */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardHeaderLeftStyle}>
              <div style={cardIconWrapperStyle}>
                <FiClock size={18} />
              </div>
              <div>
                <div style={cardTitleTextStyle}>Tạo lịch làm việc</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Chọn bác sĩ, thêm nhiều dòng Thứ &amp; Buổi, phân công khung
                  giờ linh hoạt.
                </div>
              </div>
            </div>
          </div>

          {/* LỌC THEO CHUYÊN KHOA */}
          <div style={{ marginBottom: 10, display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={sectionLabelStyle}>Lọc bác sĩ theo chuyên khoa</div>
              <select
                value={filterDeptId}
                onChange={(e) => {
                  setFilterDeptId(e.target.value);
                  setSelectedDoctorId("");
                }}
                style={selectInputStyle}
              >
                <option value="">-- Tất cả chuyên khoa --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <div style={sectionLabelStyle}>Bác sĩ</div>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                style={selectInputStyle}
              >
                <option value="">-- Chọn bác sĩ --</option>
                {doctorOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CÁC DÒNG LỊCH */}
          <div
            style={{
              borderRadius: 16,
              border: "1px dashed #e5e7eb",
              padding: "10px 10px 8px",
              background: "#f9fafb",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 12.5, color: "#6b7280" }}>
                Mỗi dòng tương ứng với <b>1 Thứ + 1 Buổi</b> và danh sách khung
                giờ riêng.
              </div>
              <button onClick={addRow} style={ghostBtnStyle} type="button">
                <FiPlusCircle size={14} /> Thêm dòng
              </button>
            </div>

            {rows.map((row) => {
              const slotsForRow = timeSlots.filter(
                (ts) => ts.period === row.session
              );

              return (
                <div
                  key={row.id}
                  style={{
                    borderRadius: 14,
                    border: "1px solid #e5e7eb",
                    padding: 10,
                    background: "white",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      gap: 8,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={sectionLabelStyle}>Thứ</div>
                      <select
                        value={row.day_of_week}
                        onChange={(e) =>
                          updateRowField(row.id, "day_of_week", e.target.value)
                        }
                        style={selectInputStyle}
                      >
                        <option value="">-- Chọn thứ --</option>
                        {daysOfWeek.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={sectionLabelStyle}>Buổi</div>
                      <select
                        value={row.session}
                        onChange={(e) =>
                          updateRowField(row.id, "session", e.target.value)
                        }
                        style={selectInputStyle}
                      >
                        <option value="">-- Chọn buổi --</option>
                        {sessions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        paddingBottom: 2,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        style={{
                          ...ghostBtnStyle,
                          borderColor: "#fecaca",
                          color: "#b91c1c",
                        }}
                      >
                        <FiTrash2 size={14} /> Xoá
                      </button>
                    </div>
                  </div>

                  <div>
                    <div style={sectionLabelStyle}>Khung giờ</div>
                    {row.session ? (
                      <div style={chipGroupStyle}>
                        {slotsForRow.map((slot) => {
                          const active = row.slotIds.includes(slot.id);
                          return (
                            <label
                              key={slot.id}
                              style={chipStyle(active)}
                              onClick={() => toggleRowSlot(row.id, slot.id)}
                            >
                              <input
                                type="checkbox"
                                checked={active}
                                readOnly
                                style={checkboxStyle}
                              />
                              {slot.label}
                            </label>
                          );
                        })}
                        {slotsForRow.length === 0 && (
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>
                            Chưa có khung giờ cho buổi này.
                          </span>
                        )}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>
                        Chọn buổi để hiển thị khung giờ.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              style={ghostBtnStyle}
              onClick={() => {
                setRows([createEmptyRow()]);
                setSelectedDoctorId("");
              }}
            >
              <FiRefreshCw size={14} /> Làm lại
            </button>
            <button
              type="button"
              onClick={handleCreateSchedule}
              style={primaryBtnStyle}
              disabled={loading}
            >
              <FiPlusCircle size={16} />
              {loading ? "Đang lưu..." : "Tạo lịch làm việc"}
            </button>
          </div>
        </div>

        {/* ================== CARD LỊCH ĐÃ PHÂN CÔNG (DƯỚI) ================== */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardHeaderLeftStyle}>
              <div
                style={{
                  ...cardIconWrapperStyle,
                  background:
                    "linear-gradient(135deg, #dcfce7, #ecfdf5)",
                  color: "#15803d",
                }}
              >
                <FiLayers size={18} />
              </div>
              <div>
                <div style={cardTitleTextStyle}>Lịch đã phân công</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Xem tổng quan lịch khám theo bác sĩ – chỉnh sửa hoặc xoá lịch
                  bất kỳ.
                </div>
              </div>
            </div>

            {selectedDeleteIds.length > 0 && (
              <button
                type="button"
                style={{
                  ...ghostBtnStyle,
                  borderColor: "#fecaca",
                  color: "#b91c1c",
                }}
                onClick={handleDeleteMultiple}
              >
                <FiTrash2 size={14} />
                Xoá {selectedDeleteIds.length} lịch
              </button>
            )}
          </div>

          {/* FILTER BAR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={sectionLabelStyle}>Tìm bác sĩ</div>
              <div style={{ position: "relative" }}>
                <FiSearch
                  size={14}
                  style={{
                    position: "absolute",
                    left: 9,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <input
                  style={{
                    ...textInputStyle,
                    paddingLeft: 26,
                    borderRadius: 999,
                  }}
                  placeholder="Nhập tên bác sĩ..."
                  value={searchDoctor}
                  onChange={(e) => setSearchDoctor(e.target.value)}
                />
              </div>
            </div>

            <div style={{ width: 200 }}>
              <div style={sectionLabelStyle}>Lọc theo chuyên khoa</div>
              <select
                value={filterDeptId}
                onChange={(e) => setFilterDeptId(e.target.value)}
                style={selectInputStyle}
              >
                <option value="">Tất cả</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: 160 }}>
              <div style={sectionLabelStyle}>Lọc theo Thứ</div>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                style={selectInputStyle}
              >
                <option value="">Tất cả</option>
                {daysOfWeek.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 40, textAlign: "center" }}>
                    Chọn
                  </th>
                  <th style={{ ...thStyle, maxWidth: 140 }}>Bác sĩ</th>
                  <th style={{ ...thStyle, width: 90 }}>Thứ</th>
                  <th style={{ ...thStyle, width: 80 }}>Buổi</th>
                  <th style={thStyle}>Khung giờ</th>
                  <th
                    style={{
                      ...thStyle,
                      width: 90,
                      textAlign: "center",
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedByDoctor).length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        ...tdStyle,
                        textAlign: "center",
                        fontSize: 12.5,
                        color: "#9ca3af",
                        padding: "20px 10px",
                      }}
                    >
                      Không có lịch nào phù hợp bộ lọc.
                    </td>
                  </tr>
                )}

                {Object.keys(groupedByDoctor).map((doctorName) => {
                  const rowsForDoctor = groupedByDoctor[doctorName];

                  return (
                    <React.Fragment key={doctorName}>
                      {/* Row tiêu đề bác sĩ */}
                      <tr style={doctorGroupRowStyle}>
                        <td
                          colSpan={6}
                          style={{
                            ...tdStyle,
                            fontWeight: 600,
                            color: "#1f2937",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <FiUser size={15} />
                            <span>{doctorName}</span>
                            <span
                              style={{
                                fontSize: 11.5,
                                color: "#6b7280",
                                marginLeft: 2,
                              }}
                            >
                              ({rowsForDoctor.length} lịch)
                            </span>
                          </span>
                        </td>
                      </tr>

                      {rowsForDoctor.map((s) => {
                        const dayLabel =
                          daysOfWeek.find(
                            (d) => String(d.value) === String(s.day_of_week)
                          )?.label || s.day_of_week;

                        const slotsLabel =
                          s.timeSlots?.length > 0
                            ? s.timeSlots
                                .filter((t) => t.period === s.session)
                                .map((t) =>
                                  t.label.replace(" - ", "–")
                                )
                                .join(", ")
                            : "Chưa gán khung giờ";

                        return (
                          <tr key={s.id}>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedDeleteIds.includes(s.id)}
                                onChange={() => toggleDeleteSelection(s.id)}
                              />
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                maxWidth: 140,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {doctorName}
                            </td>
                            <td style={tdStyle}>{dayLabel}</td>
                            <td style={tdStyle}>
                              {s.session === "morning" ? "Sáng" : "Chiều"}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {slotsLabel}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => openEdit(s)}
                                style={{
                                  ...ghostBtnStyle,
                                  padding: "4px 8px",
                                  fontSize: 11.5,
                                }}
                              >
                                <FiEdit2 size={13} />
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOne(s.id)}
                                style={{
                                  ...ghostBtnStyle,
                                  padding: "4px 8px",
                                  fontSize: 11.5,
                                  marginLeft: 6,
                                  borderColor: "#fecaca",
                                  color: "#b91c1c",
                                }}
                              >
                                <FiTrash2 size={13} />
                                Xoá
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================== MODAL SỬA LỊCH – POPUP GRADIENT PREMIUM ================== */}
      {editingSchedule && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "820px",
              maxWidth: "96vw",
              borderRadius: 22,
              background:
                "linear-gradient(135deg, #312e81 0%, #1e3a8a 40%, #0369a1 100%)",
              boxShadow: "0 28px 80px rgba(15,23,42,0.6)",
              padding: 1,
              animation: "doctorScheduleModalFade 0.25s ease-out",
            }}
          >
            <div
              style={{
                borderRadius: 21,
                background: "white",
                overflow: "hidden",
              }}
            >
              {/* HEADER MODAL */}
              <div
                style={{
                  padding: "12px 18px",
                  background:
                    "linear-gradient(135deg, rgba(129,140,248,0.18), rgba(56,189,248,0.15))",
                  borderBottom: "1px solid rgba(148,163,184,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      background:
                        "radial-gradient(circle at 20% 10%, #fef9c3, #fbbf24 50%, #b45309 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: "0 10px 25px rgba(245,158,11,0.55)",
                    }}
                  >
                    <FiEdit2 size={17} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      Chỉnh sửa khung giờ làm việc
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "#4b5563",
                        marginTop: 2,
                      }}
                    >
                      {editingSchedule.doctor?.name} •{" "}
                      {
                        daysOfWeek.find(
                          (d) =>
                            String(d.value) ===
                            String(editingSchedule.day_of_week)
                        )?.label
                      }{" "}
                      •{" "}
                      {editingSchedule.session === "morning"
                        ? "Buổi sáng"
                        : "Buổi chiều"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSchedule(null);
                    setEditingSlotIds([]);
                  }}
                  style={{
                    ...ghostBtnStyle,
                    borderRadius: 999,
                    padding: "5px 8px",
                  }}
                >
                  <FiX size={14} />
                </button>
              </div>

              {/* BODY MODAL */}
              <div
                style={{
                  padding: "14px 18px 16px",
                  maxHeight: "70vh",
                  overflowY: "auto",
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <div style={sectionLabelStyle}>Khung giờ áp dụng</div>
                  <div style={chipGroupStyle}>
                    {timeSlots
                      .filter((t) => t.period === editingSchedule.session)
                      .map((slot) => {
                        const active = editingSlotIds.includes(slot.id);
                        return (
                          <label
                            key={slot.id}
                            style={chipStyle(active)}
                            onClick={() => toggleEditSlot(slot.id)}
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={active}
                              style={checkboxStyle}
                            />
                            {slot.label}
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* FOOTER MODAL */}
              <div
                style={{
                  padding: "10px 18px 14px",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  style={ghostBtnStyle}
                  onClick={() => {
                    setEditingSchedule(null);
                    setEditingSlotIds([]);
                  }}
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  style={primaryBtnStyle}
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                >
                  {savingEdit ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorScheduleManager;
