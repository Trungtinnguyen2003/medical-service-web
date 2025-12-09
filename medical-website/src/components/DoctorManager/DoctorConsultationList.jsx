// ==========================================
// DoctorConsultationList.jsx — PREMIUM UI
// ==========================================
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaReply,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// ===================== GLOBAL STYLE =====================
if (
  typeof document !== "undefined" &&
  !document.getElementById("consult-global-style")
) {
  const style = document.createElement("style");
  style.id = "consult-global-style";
  style.textContent = `
    @keyframes consultFadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes consultCardIn {
      from { opacity: 0; transform: translateY(10px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// ===================== UTIL ===================== 
const toInitials = (name) => {
  if (!name) return "BN";
  const arr = name.trim().split(" ");
  if (arr.length === 1) return arr[0][0].toUpperCase();
  return (arr[0][0] + arr[arr.length - 1][0]).toUpperCase();
};

const DoctorConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [reply, setReply] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // ===================== FETCH =====================
  const load = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/consultations/doctor",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConsultations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ===================== FILTER =====================
  const filtered = useMemo(() => {
    let list = [...consultations];

    if (filterStatus !== "all") {
      list = list.filter((x) => x.status === filterStatus);
    }

    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter((x) => {
        return (
          x.title?.toLowerCase().includes(kw) ||
          x.patient?.name?.toLowerCase().includes(kw) ||
          x.department?.name?.toLowerCase().includes(kw)
        );
      });
    }
    return list;
  }, [consultations, filterStatus, search]);

  const stats = {
    total: consultations.length,
    pending: consultations.filter((x) => x.status === "pending").length,
    answered: consultations.filter((x) => x.status === "answered").length,
  };

  // ===================== ACTION =====================
  const sendReply = async (id) => {
    if (!reply.trim()) return alert("Nhập nội dung trả lời!");

    try {
      await axios.put(
        `http://localhost:5000/api/consultations/${id}/answer`,
        { answer: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Đã trả lời!");
      setReply("");
      setSelectedId(null);
      load();
    } catch (err) {
      console.error(err);
      alert("Lỗi gửi trả lời!");
    }
  };

  // ===================== UI =====================
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "28px 32px",
        background:
          "linear-gradient(135deg,#eef2ff 0%,#f9fafb 40%,#edf4ff 100%)",
        animation: "consultFadeUp .55s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "28px 32px 38px",
          borderRadius: 26,
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(203,213,225,0.6)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
        }}
      >
        {/* ===================== HEADER ===================== */}
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                background:
                  "linear-gradient(90deg,#4338ca,#2563eb,#0ea5e9)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Trung tâm tư vấn y khoa
            </h1>
            <p style={{ marginTop: 6, fontSize: 14, color: "#4b5563" }}>
              Bác sĩ xem – lọc – trả lời câu hỏi bệnh nhân.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10 }}>
            <StatBox label="Tổng" value={stats.total} color="#6366f1" />
            <StatBox label="Đã trả lời" value={stats.answered} color="#16a34a" />
            <StatBox label="Chưa trả lời" value={stats.pending} color="#f59e0b" />
          </div>
        </div>

        {/* ===================== FILTER BAR ===================== */}
        <div
          style={{
            marginBottom: 26,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Buttons */}
          <FilterBtn
            active={filterStatus === "all"}
            label={`Tất cả (${stats.total})`}
            onClick={() => setFilterStatus("all")}
            color="#4f46e5"
          />
          <FilterBtn
            active={filterStatus === "pending"}
            label={`Chưa trả lời (${stats.pending})`}
            onClick={() => setFilterStatus("pending")}
            color="#f59e0b"
          />
          <FilterBtn
            active={filterStatus === "answered"}
            label={`Đã trả lời (${stats.answered})`}
            onClick={() => setFilterStatus("answered")}
            color="#10b981"
          />

          {/* Search */}
          <input
            placeholder="Tìm theo tiêu đề, bệnh nhân, chuyên khoa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginLeft: "auto",
              width: 260,
              padding: "10px 14px",
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.4)",
              outline: "none",
              fontSize: 14,
            }}
          />
        </div>

        {/* ===================== CONTENT ===================== */}
        {filtered.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontStyle: "italic",
              padding: "32px 0",
            }}
          >
            Không tìm thấy câu hỏi phù hợp.
          </p>
        )}

        {filtered.map((c, idx) => (
          <ConsultCard
            key={c.id}
            item={c}
            index={idx}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            reply={reply}
            setReply={setReply}
            sendReply={sendReply}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorConsultationList;

// =====================================================
// COMPONENT: STAT BOX
// =====================================================
const StatBox = ({ label, value, color }) => (
  <div
    style={{
      padding: "10px 14px",
      borderRadius: 18,
      background: `${color}15`,
      border: `1px solid ${color}40`,
      minWidth: 90,
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: 11,
        textTransform: "uppercase",
        color,
        fontWeight: 600,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
  </div>
);

// =====================================================
// COMPONENT: FILTER BUTTON
// =====================================================
const FilterBtn = ({ active, label, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      fontSize: 14,
      borderRadius: 18,
      border: active
        ? `1px solid ${color}`
        : "1px solid rgba(148,163,184,0.4)",
      background: active ? color : "white",
      color: active ? "white" : "#475569",
      cursor: "pointer",
      boxShadow: active ? `0 4px 12px ${color}55` : "none",
      transition: "0.25s",
    }}
  >
    {label}
  </button>
);

// =====================================================
// COMPONENT: CONSULT CARD
// =====================================================
const ConsultCard = ({
  item,
  index,
  selectedId,
  setSelectedId,
  reply,
  setReply,
  sendReply,
}) => {
  const patientName = item.patient?.name || "Ẩn danh";
  const initials = toInitials(patientName);

  return (
    <div
      style={{
        borderRadius: 22,
        padding: "22px 26px",
        background:
          "linear-gradient(130deg,rgba(255,255,255,0.95),rgba(237,242,255,0.9))",
        border: "1px solid rgba(203,213,225,0.65)",
        boxShadow: "0 14px 38px rgba(15,23,42,0.08)",
        marginBottom: 22,
        animation: "consultCardIn 0.55s ease",
        animationDelay: `${index * 0.035}s`,
      }}
    >
      {/* TOP ROW */}
      <div style={{ display: "flex", gap: 14 }}>
        {/* Avatar */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontWeight: 700,
            fontSize: 18,
            background: "linear-gradient(135deg,#6366f1,#2563eb)",
          }}
        >
          {initials}
        </div>

        {/* TITLE + INFO */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 4,
              color: "#1e293b",
            }}
          >
            {item.title}
          </h3>

          <p style={{ fontSize: 14, color: "#475569", marginBottom: 2 }}>
            👤 {patientName}
          </p>
          <p style={{ fontSize: 14, color: "#475569" }}>
            🏥 {item.department?.name || "Chưa cập nhật khoa"}
          </p>

          {/* STATUS */}
          <div style={{ marginTop: 6 }}>
            {item.status === "answered" ? (
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 14,
                  background: "#10b98122",
                  border: "1px solid #10b98155",
                  color: "#047857",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaCheckCircle /> Đã trả lời
              </span>
            ) : (
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 14,
                  background: "#f59e0b22",
                  border: "1px solid #f59e0b55",
                  color: "#b45309",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaTimesCircle /> Chưa trả lời
              </span>
            )}
          </div>
        </div>
      </div>

      {/* QUESTION CONTENT */}
      <div
        style={{
          marginTop: 14,
          padding: "14px 18px",
          borderRadius: 16,
          background: "rgba(238,242,255,0.8)",
          fontSize: 15,
          color: "#1e293b",
          lineHeight: "1.55em",
        }}
      >
        {item.content}
      </div>

      {/* ACTION: OPEN REPLY */}
      {item.status === "pending" && selectedId !== item.id && (
        <button
          onClick={() => setSelectedId(item.id)}
          style={{
            marginTop: 14,
            padding: "10px 16px",
            borderRadius: 14,
            background: "linear-gradient(135deg,#4f46e5,#2563eb)",
            color: "white",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 12px 32px rgba(37,99,235,0.35)",
          }}
        >
          <FaReply /> Trả lời câu hỏi
        </button>
      )}

      {/* REPLY FORM */}
      {selectedId === item.id && (
        <div
          style={{
            marginTop: 18,
            borderRadius: 18,
            padding: "18px 20px",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(203,213,225,0.6)",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#4338ca",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            ✍️ Trả lời bệnh nhân
          </p>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12 }}>
            <CKEditor
              editor={ClassicEditor}
              data={reply}
              onChange={(e, editor) => setReply(editor.getData())}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
            <button
              onClick={() => sendReply(item.id)}
              style={{
                padding: "9px 16px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#16a34a,#22c55e)",
                color: "white",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 12px 28px rgba(34,197,94,0.35)",
              }}
            >
              Gửi trả lời
            </button>

            <button
              onClick={() => {
                setSelectedId(null);
                setReply("");
              }}
              style={{
                padding: "9px 16px",
                borderRadius: 12,
                background: "#e5e7eb",
                color: "#1e293b",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* ANSWER DISPLAY */}
      {item.status === "answered" && (
        <div
          style={{
            marginTop: 16,
            padding: "16px 20px",
            borderRadius: 18,
            background: "rgba(236,253,245,0.88)",
            borderLeft: "4px solid #16a34a",
            border: "1px solid rgba(209,250,229,0.7)",
            fontSize: 15,
            color: "#064e3b",
            lineHeight: "1.55em",
          }}
        >
          <p
            style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}
          >
            🩺 Trả lời từ bác sĩ
          </p>

          <div
            dangerouslySetInnerHTML={{ __html: item.answer }}
            style={{ color: "#0f172a" }}
          />
        </div>
      )}
    </div>
  );
};
