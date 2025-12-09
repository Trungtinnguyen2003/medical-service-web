import React, { useEffect, useState } from "react";
import timeSlotService from "../../services/timeSlotService";
import { FaClock, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

// ================== STYLE — MINIMAL MEDICAL BLUE ==================
const pageWrapper = {
  padding: "28px 32px",
  minHeight: "100vh",
  background: "#f3f6f9", // nền xám xanh rất nhẹ
  display: "flex",
  justifyContent: "center",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1150px",
};

// Header minimal
const headerCardStyle = {
  background: "#e6f2ff", // xanh nhạt nhẹ
  borderRadius: 14,
  padding: "18px 22px",
  border: "1px solid #d4e4f4",
  color: "#0b3c60",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const headerLeft = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const headerIcon = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: "#d8eafd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  color: "#0b4d78",
};

const autoBtnStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "#e8eef5",
  border: "1px solid #c7d3df",
  color: "#0b3c60",
  cursor: "pointer",
  fontSize: 14,
};

// Grid layout
const mainGrid = {
  display: "grid",
  gridTemplateColumns: "0.9fr 1.1fr",
  gap: 18,
  marginTop: 20,
};

// Card style minimal
const card = {
  background: "white",
  borderRadius: 12,
  padding: "18px 20px",
  border: "1px solid #e3e8ee",
};

// Section title very simple
const sectionTitle = {
  fontSize: 17,
  fontWeight: 700,
  color: "#123a55",
  marginBottom: 8,
};

// Form input
const inputBase = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #cfd8e3",
  padding: "8px 10px",
  fontSize: 14,
  outline: "none",
};

// Button minimal
const submitBtn = {
  width: "100%",
  borderRadius: 8,
  padding: "10px 0",
  border: "none",
  cursor: "pointer",
  background: "#0ea5e9",
  color: "white",
  fontWeight: 600,
  fontSize: 14,
};

// Table minimal
const tableWrapper = {
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid #dfe7ef",
};

const tableHead = {
  background: "#eef4fa",
  color: "#1e3a5f",
};

const thCell = {
  padding: "10px 12px",
  fontSize: 13,
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
};

const tdCell = {
  padding: "10px 12px",
  fontSize: 13,
  borderBottom: "1px solid #eef2f6",
  color: "#334155",
};

// Badge simple pastel
const badgeMorning = {
  background: "#e0f2ff",
  color: "#075985",
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: 12,
};

const badgeAfternoon = {
  background: "#e6f7ed",
  color: "#166534",
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: 12,
};

const iconBtn = {
  width: 30,
  height: 30,
  borderRadius: 6,
  background: "#f1f5f9",
  border: "1px solid #d7dee6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 14,
};

// ================== COMPONENT ==================
const TimeSlotManager = () => {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    start_time: "",
    end_time: "",
    period: "morning",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const loadData = async () => {
    const res = await timeSlotService.getAll();
    setSlots(res.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Tạo khung giờ chuẩn
  const generateStandardSlots = async () => {
    const defaultSlots = [
      { start: "07:30", end: "08:30", period: "morning" },
      { start: "08:30", end: "09:30", period: "morning" },
      { start: "09:30", end: "10:30", period: "morning" },
      { start: "10:30", end: "11:30", period: "morning" },
      { start: "13:00", end: "14:00", period: "afternoon" },
      { start: "14:00", end: "15:00", period: "afternoon" },
      { start: "15:00", end: "16:00", period: "afternoon" },
    ];

    let created = 0;
    for (let s of defaultSlots) {
      const label = `${s.start} - ${s.end}`;
      if (!slots.some((t) => t.label === label)) {
        await timeSlotService.create(
          { label, start_time: s.start, end_time: s.end, period: s.period },
          token
        );
        created++;
      }
    }

    alert(
      created > 0
        ? `Đã thêm ${created} khung giờ chuẩn mới`
        : "Tất cả khung giờ chuẩn đã tồn tại"
    );
    loadData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.start_time || !form.end_time) {
      alert("Vui lòng nhập giờ bắt đầu và kết thúc.");
      return;
    }

    const label = `${form.start_time} - ${form.end_time}`;
    const data = { ...form, label };

    if (editingId) {
      await timeSlotService.update(editingId, data, token);
    } else {
      await timeSlotService.create(data, token);
    }

    setForm({ start_time: "", end_time: "", period: "morning" });
    setEditingId(null);
    loadData();
  };

  const handleEdit = (s) => {
    setForm({
      start_time: s.start_time,
      end_time: s.end_time,
      period: s.period,
    });
    setEditingId(s.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá khung giờ này?")) {
      await timeSlotService.remove(id, token);
      loadData();
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={containerStyle}>
        {/* HEADER */}
        <div style={headerCardStyle}>
          <div style={headerLeft}>
            <div style={headerIcon}>
              <FaClock />
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>
                Quản lý Khung Giờ
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Tối ưu hóa lịch khám với các khung giờ phù hợp.
              </div>
            </div>
          </div>

          {/* <button style={autoBtnStyle} onClick={generateStandardSlots}>
            Tạo khung giờ chuẩn
          </button> */}
        </div>

        {/* GRID */}
        <div style={mainGrid}>
          {/* FORM */}
          <div style={card}>
            <div style={sectionTitle}>
              {editingId ? "Cập nhật khung giờ" : "Thêm khung giờ mới"}
            </div>

            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label>Giờ bắt đầu</label>
                <input
                  type="time"
                  style={inputBase}
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Giờ kết thúc</label>
                <input
                  type="time"
                  style={inputBase}
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({ ...form, end_time: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Buổi khám</label>
                <select
                  style={inputBase}
                  value={form.period}
                  onChange={(e) =>
                    setForm({ ...form, period: e.target.value })
                  }
                >
                  <option value="morning">Buổi sáng</option>
                  <option value="afternoon">Buổi chiều</option>
                </select>
              </div>

              <div className="col-span-2">
                <button 
  style={{ ...submitBtn, marginTop: 10 }} 
  type="submit"
>
                  <FaPlus /> {editingId ? "Lưu thay đổi" : "Thêm khung giờ"}
                </button>
              </div>
            </form>
          </div>

          {/* TABLE */}
          <div style={card}>
            <div style={sectionTitle}>Danh sách khung giờ</div>

            <div style={tableWrapper}>
              <table className="w-full">
                <thead style={tableHead}>
                  <tr>
                    <th style={thCell}>ID</th>
                    <th style={thCell}>Khung giờ</th>
                    <th style={thCell}>Buổi</th>
                    <th style={thCell}>Bắt đầu</th>
                    <th style={thCell}>Kết thúc</th>
                    <th style={{ ...thCell, textAlign: "center" }}>
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {slots.map((s) => (
                    <tr key={s.id} className="hover:bg-[#f7fbff]">
                      <td style={tdCell}>{s.id}</td>
                      <td style={tdCell}>{s.label}</td>
                      <td style={tdCell}>
                        <span
                          style={
                            s.period === "morning"
                              ? badgeMorning
                              : badgeAfternoon
                          }
                        >
                          {s.period === "morning" ? "Buổi sáng" : "Buổi chiều"}
                        </span>
                      </td>
                      <td style={tdCell}>{s.start_time}</td>
                      <td style={tdCell}>{s.end_time}</td>

                      <td style={{ ...tdCell, textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "center",
                          }}
                        >
                          <button
                            style={{ ...iconBtn, color: "#0ea5e9" }}
                            onClick={() => handleEdit(s)}
                          >
                            <FaEdit />
                          </button>

                          <button
                            style={{ ...iconBtn, color: "#dc2626" }}
                            onClick={() => handleDelete(s.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {slots.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ ...tdCell, textAlign: "center" }}>
                        Chưa có khung giờ nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotManager;
