// src/components/Doctor/ClinicalExamModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiActivity,
  FiClipboard,
  FiAlertCircle,
} from "react-icons/fi";

// ================== ANIMATION ==================
if (
  typeof document !== "undefined" &&
  !document.getElementById("clinical-exam-modal-style")
) {
  const styleEl = document.createElement("style");
  styleEl.id = "clinical-exam-modal-style";
  styleEl.textContent = `
    @keyframes clinicalModalFadeIn {
      from { opacity: 0; transform: translateY(16px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(styleEl);
}

// ================== STYLE OBJECTS ==================
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.45)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  width: "1120px",
  maxHeight: "92vh",
  background: "linear-gradient(135deg, #f9fafb 0%, #ffffff 40%, #eef2ff 100%)",
  borderRadius: "24px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.35)",
  overflow: "hidden",
  animation: "clinicalModalFadeIn 0.35s ease",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(148, 163, 184, 0.4)",
};

const inputCellStyle = {
  width: "100%",
  minWidth: "80px",
  maxWidth: "100%",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  padding: "8px 10px",
  fontSize: 13,
  outline: "none",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};


const headerStyle = {
  padding: "18px 24px",
  background:
    "linear-gradient(120deg, #1d4ed8 0%, #2563eb 35%, #38bdf8 100%)",
  color: "white",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
};

const headerLeftStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const titleRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const headerTitleStyle = {
  fontSize: "22px",
  fontWeight: 800,
  letterSpacing: "0.03em",
};

const patientBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "rgba(15, 23, 42, 0.2)",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
};

const headerInfoStyle = {
  fontSize: 13,
  opacity: 0.95,
};

const headerRightStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "flex-end",
};

const closeBtnStyle = {
  border: "none",
  background: "rgba(15,23,42,0.18)",
  color: "white",
  borderRadius: "999px",
  width: 34,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const bodyWrapperStyle = {
  padding: "18px 24px 20px",
  overflow: "auto",
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "1.3fr 1fr",
  gap: 18,
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.92)",
  borderRadius: "18px",
  padding: "14px 16px 16px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
  border: "1px solid rgba(203, 213, 225, 0.8)",
};

const cardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 10,
};

const cardTitleStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0f172a",
};

const cardIconWrapperStyle = {
  width: 26,
  height: 26,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  color: "#1d4ed8",
};

const sectionLabelStyle = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4,
  color: "#475569",
};

const textareaStyle = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  padding: "9px 11px",
  fontSize: 13,
  resize: "vertical",
  minHeight: 90,
  outline: "none",
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
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  padding: "7px 9px",
  fontSize: 13,
  outline: "none",
};

const tableWrapperStyle = {
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 8px",
  tableLayout: "auto",
};


const thStyle = {
  padding: "7px 8px",
  textAlign: "left",
  background: "linear-gradient(135deg, #eff6ff, #e0f2fe)",
  borderBottom: "1px solid #cbd5e1",
  fontWeight: 600,
  color: "#0f172a",
  whiteSpace: "nowrap",
};

const tdStyleBase = {
  padding: "6px 7px",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "middle",
};

const footerStyle = {
  padding: "10px 24px 16px",
  borderTop: "1px solid rgba(203,213,225,0.7)",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  background: "rgba(248,250,252,0.9)",
};

const primaryBtnStyle = {
  padding: "9px 18px",
  borderRadius: 999,
  border: "none",
  background:
    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0ea5e9 100%)",
  color: "white",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.35)",
};

const secondaryBtnStyle = {
  padding: "9px 16px",
  borderRadius: 999,
  border: "none",
  background: "#e5e7eb",
  color: "#111827",
  fontWeight: 500,
  fontSize: 13,
  cursor: "pointer",
};

// ================== MAIN COMPONENT ==================
const ClinicalExamModal = ({ appointment, onClose, onDone }) => {
  const token = localStorage.getItem("token");

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [items, setItems] = useState([
    {
      medicine_id: "",
      dosage: "",
      quantity: 1,
      frequency: "",
      duration: "",
      note: "",
    },
  ]);

  const [clsServices, setClsServices] = useState([]);
  const [clsHistory, setClsHistory] = useState([]);
  const [selectedClsService, setSelectedClsService] = useState("");
  const [clsNote, setClsNote] = useState("");
  const [sendingCls, setSendingCls] = useState(false);
  const [saving, setSaving] = useState(false);

  // ========== FETCH THUỐC ==========
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMedicines(res.data || []));
  }, [token]);

  // ========== FETCH DỊCH VỤ CLS ==========
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/departments/clinical/services")
      .then((res) => setClsServices(res.data || []));
  }, []);

  // ========== FETCH LỊCH SỬ CLS ==========
  useEffect(() => {
    if (!appointment?.id) return;
    axios
      .get(
        `http://localhost:5000/ccls/requests/by-appointment/${appointment.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setClsHistory(res.data || []));
  }, [appointment, token]);

  // ========== HANDLERS ==========
  const addRow = () =>
    setItems((prev) => [
      ...prev,
      {
        medicine_id: "",
        dosage: "",
        quantity: 1,
        frequency: "",
        duration: "",
        note: "",
      },
    ]);

  const removeRow = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleChange = (idx, field, value) => {
    setItems((prev) => {
      const arr = [...prev];
      arr[idx][field] = value;
      return arr;
    });
  };

  const handleSendCls = async () => {
    if (!selectedClsService) return alert("Vui lòng chọn dịch vụ CLS!");

    try {
      setSendingCls(true);

      await axios.post(
        "http://localhost:5000/ccls/requests",
        {
          appointment_id: appointment.id,
          service_id: selectedClsService,
          requested_by: appointment.doctor_id,
          note: clsNote,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const history = await axios.get(
        `http://localhost:5000/ccls/requests/by-appointment/${appointment.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClsHistory(history.data || []);
      setSelectedClsService("");
      setClsNote("");

      alert("Gửi chỉ định cận lâm sàng thành công!");
    } catch (err) {
      alert("Không thể gửi yêu cầu CLS.");
    } finally {
      setSendingCls(false);
    }
  };

  const handleSubmit = async () => {
    if (!diagnosis.trim())
      return alert("Vui lòng nhập chẩn đoán lâm sàng!");
    if (items.some((i) => !i.medicine_id))
      return alert("Vui lòng chọn ít nhất một thuốc!");

    try {
      setSaving(true);

      await axios.post(
        "http://localhost:5000/api/prescriptions",
        {
          appointment_id: appointment.id,
          note: diagnosis,
          items: items.map((i) => ({
            medicine_id: Number(i.medicine_id),
            // dosage: i.dosage,
            quantity: Number(i.quantity),
            frequency: i.frequency,
            duration: i.duration,
            note: i.note,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.put(
        `http://localhost:5000/appointments/doctor/${appointment.id}/status`,
        { status: "done" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Khám bệnh & kê thuốc thành công!");
      onDone && onDone();
    } catch (err) {
      alert("Không thể lưu kết quả khám!");
    } finally {
      setSaving(false);
    }
  };

  // ================== RENDER ==================
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* ========== HEADER ========== */}
        <div style={headerStyle}>
          <div style={headerLeftStyle}>
            <div style={titleRowStyle}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "999px",
                  background: "rgba(15,23,42,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiActivity size={20} />
              </div>
              <div>
                <div style={headerTitleStyle}>
                  Khám bệnh — {appointment?.patientProfile?.full_name}
                </div>
                {/* <div style={patientBadgeStyle}>
                  <FiClipboard size={14} />
                  Hồ sơ: {appointment?.patientProfile?.profile_name || "—"}
                </div> */}
              </div>
            </div>

            <div style={headerInfoStyle}>
              Dịch vụ:{" "}
              <b>{appointment?.bookedService?.title || "Không xác định"}</b>{" "}
              • Ngày: <b>{appointment?.appointment_date}</b> • Giờ:{" "}
              <b>{appointment?.appointment_time}</b>
            </div>
          </div>

          <div style={headerRightStyle}>
            <div
              style={{
                fontSize: 12,
                background: "rgba(15,23,42,0.25)",
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              Mã lịch hẹn: <b>#{appointment?.id}</b>
            </div>
            <button style={closeBtnStyle} onClick={onClose}>
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* ========== BODY ========== */}
        <div style={bodyWrapperStyle}>
          <div style={twoColumnStyle}>
            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Chẩn đoán */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardIconWrapperStyle}>
                    <FiClipboard size={16} />
                  </div>
                  <div style={cardTitleStyle}>Chẩn đoán lâm sàng</div>
                </div>

                <div>
                  <div style={sectionLabelStyle}>Nội dung chẩn đoán</div>
                  <textarea
                    style={textareaStyle}
                    placeholder="Nhập chẩn đoán lâm sàng, ví dụ: Viêm họng cấp, theo dõi viêm amidan..."
                    rows={4}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
              </div>

              {/* Kê đơn */}
             {/* Kê đơn */}
<div style={cardStyle}>
  <div style={cardHeaderStyle}>
    <div
      style={{
        ...cardIconWrapperStyle,
        background: "linear-gradient(135deg, #fef3c7, #fee2e2)",
        color: "#b91c1c",
      }}
    >
      💊
    </div>
    <div style={cardTitleStyle}>Kê đơn điều trị</div>
  </div>

  <div style={sectionLabelStyle}>Danh sách thuốc trong đơn</div>

  <div style={tableWrapperStyle}>
    <table style={tableStyle}>
      <thead>
        <tr>
          <Th>Thuốc</Th>
          {/* ❌ Bỏ cột Liều */}
          <Th style={{ textAlign: "center" }}>SL</Th>
          <Th>Cách dùng</Th>
          <Th>Thời gian</Th>
          <Th>Ghi chú</Th>
          <Th style={{ textAlign: "center" }}>Xóa</Th>
        </tr>
      </thead>

      <tbody>
        {items.map((it, idx) => (
          <tr
            key={idx}
            style={{
              backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
            }}
          >
            {/* Thuốc */}
            <Td>
              <select
                value={it.medicine_id}
                onChange={(e) =>
                  handleChange(idx, "medicine_id", e.target.value)
                }
                style={inputCellStyle}
              >
                <option value="">-- Chọn thuốc --</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Td>

            {/* ❌ Bỏ liều → không render ô input dosage */}

            {/* Số lượng */}
            <Td style={{ textAlign: "center" }}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                style={inputCellStyle}
                value={it.quantity}
                onChange={(e) => {
                  if (/^[0-9]*$/.test(e.target.value)) {
                    handleChange(idx, "quantity", e.target.value);
                  }
                }}
              />
            </Td>

            {/* Cách dùng */}
            <Td>
              <input
                style={textInputStyle}
                placeholder="2 lần/ngày"
                value={it.frequency}
                onChange={(e) =>
                  handleChange(idx, "frequency", e.target.value)
                }
              />
            </Td>

            {/* Thời gian */}
            <Td>
              <input
                style={inputCellStyle}
                placeholder="5 ngày"
                value={it.duration}
                onChange={(e) => handleChange(idx, "duration", e.target.value)}
              />
            </Td>

            {/* Ghi chú */}
            <Td>
              <input
                style={inputCellStyle}
                placeholder="Sau ăn, uống nhiều nước..."
                value={it.note}
                onChange={(e) => handleChange(idx, "note", e.target.value)}
              />
            </Td>

            {/* Xoá */}
            <Td style={{ textAlign: "center" }}>
              <button
                onClick={() => removeRow(idx)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#dc2626",
                }}
              >
                <FiTrash2 />
              </button>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <button
    onClick={addRow}
    style={{
      marginTop: 10,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px dashed #cbd5e1",
      background: "#f9fafb",
      cursor: "pointer",
      fontSize: 12.5,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      color: "#0f172a",
    }}
  >
    <FiPlus size={14} /> Thêm thuốc
  </button>
</div>

            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* CLS */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div
                    style={{
                      ...cardIconWrapperStyle,
                      background:
                        "linear-gradient(135deg, #e0f2fe, #f1f5f9)",
                      color: "#0369a1",
                    }}
                  >
                    🔬
                  </div>
                  <div style={cardTitleStyle}>Chỉ định cận lâm sàng</div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={sectionLabelStyle}>Dịch vụ CLS</div>
                  <select
                    value={selectedClsService}
                    onChange={(e) => setSelectedClsService(e.target.value)}
                    style={selectInputStyle}
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {clsServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={sectionLabelStyle}>Ghi chú cho CLS</div>
                  <textarea
                    style={{ ...textareaStyle, minHeight: 70 }}
                    placeholder="VD: nghi viêm phổi — yêu cầu X-quang phổi thẳng & nghiêng..."
                    value={clsNote}
                    onChange={(e) => setClsNote(e.target.value)}
                  />
                </div>

                <div style={{ textAlign: "right", marginTop: 10 }}>
                  <button
                    onClick={handleSendCls}
                    disabled={sendingCls}
                    style={{
                      ...primaryBtnStyle,
                      padding: "7px 16px",
                      boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
                      opacity: sendingCls ? 0.7 : 1,
                    }}
                  >
                    {sendingCls ? "Đang gửi..." : "📨 Gửi chỉ định"}
                  </button>
                </div>

                {/* Cảnh báo nhỏ */}
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    fontSize: 11.5,
                    color: "#475569",
                    background: "#f8fafc",
                    borderRadius: 10,
                    padding: "6px 8px",
                  }}
                >
                  <FiAlertCircle
                    size={14}
                    style={{ marginTop: 2, color: "#f97316" }}
                  />
                  <span>
                    Chỉ định CLS sẽ được gửi đến bác sĩ / kỹ thuật viên cận lâm
                    sàng phụ trách. Kết quả trả về sẽ hiển thị ở mục phía dưới.
                  </span>
                </div>
              </div>

              {/* Lịch sử CLS */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div
                    style={{
                      ...cardIconWrapperStyle,
                      background:
                        "linear-gradient(135deg, #ecfdf5, #dcfce7)",
                      color: "#15803d",
                    }}
                  >
                    📋
                  </div>
                  <div style={cardTitleStyle}>Lịch sử chỉ định & kết quả</div>
                </div>

                {clsHistory.length === 0 ? (
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#6b7280",
                      fontStyle: "italic",
                    }}
                  >
                    Chưa có chỉ định cận lâm sàng nào cho lịch hẹn này.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {clsHistory.map((req) => (
                      <div
                        key={req.id}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 12,
                          border: "1px solid #e5e7eb",
                          background: "#ffffff",
                          fontSize: 12.5,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#0f172a",
                            marginBottom: 4,
                          }}
                        >
                          🔬 {req.service?.title}
                        </div>

                        <div style={{ marginBottom: 2 }}>
                          👨‍⚕️ Bác sĩ CLS:{" "}
                          <b>{req.assignedDoctor?.name || "—"}</b>
                        </div>

                        <div style={{ marginBottom: 2 }}>
                          📝 Ghi chú: {req.note || "—"}
                        </div>

                        <div style={{ marginBottom: 2 }}>
                          ⏱ Trạng thái:{" "}
                          <b style={{ color: "#1d4ed8" }}>{req.status}</b>
                        </div>

                        {req.result && (
                          <div
                            style={{
                              marginTop: 4,
                              padding: "6px 8px",
                              borderRadius: 10,
                              background: "#eff6ff",
                            }}
                          >
                            <div>
                              📝 <b>Mô tả:</b> {req.result.description}
                            </div>
                            <div style={{ color: "#1d4ed8" }}>
                              📑 <b>Kết luận:</b> {req.result.conclusion}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========== FOOTER ========== */}
        <div style={footerStyle}>
          <button
            style={primaryBtnStyle}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "✅ Hoàn tất khám"}
          </button>
          <button style={secondaryBtnStyle} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// ================== MINI COMPONENTS ==================
const Th = ({ children, style }) => (
  <th style={{ ...thStyle, ...style }}>{children}</th>
);

const Td = ({ children, style }) => (
  <td style={{ ...tdStyleBase, ...style }}>{children}</td>
);

export default ClinicalExamModal;
