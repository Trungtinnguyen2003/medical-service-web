// src/components/Doctor/ClinicalDoctorManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { HiClipboardList } from "react-icons/hi";
import { FaUserMd } from "react-icons/fa";

/* ============================================================
   ANIMATION: keyframes + helper styles
   ============================================================ */
const animStyles = {
  fadeIn: {
    animation: "fadeInClinical 0.35s ease",
  },
  slideLeft: {
    animation: "slideLeftClinical 0.35s ease",
  },
  slideUp: {
    animation: "slideUpClinical 0.4s ease",
  },
};

// Inject CSS keyframes (chỉ inject 1 lần)
if (typeof document !== "undefined" && !document.getElementById("clinical-anim-style")) {
  const styleEl = document.createElement("style");
  styleEl.id = "clinical-anim-style";
  styleEl.textContent = `
    @keyframes fadeInClinical {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideLeftClinical {
      from { opacity: 0; transform: translateX(25px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideUpClinical {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleEl);
}

/* ============================================================
   COMPONENT CHÍNH: ClinicalDoctorManager
   ============================================================ */
const ClinicalDoctorManager = () => {
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      const profile = await axios.get("http://localhost:5000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const doctorId = profile.data?.doctor?.id;
      if (!doctorId) return;

      const res = await axios.get(
        `http://localhost:5000/ccls/requests/assigned?doctor_id=${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(res.data || []);
    } catch (err) {
      console.error("Lỗi tải yêu cầu CLS:", err);
    }
  };

  // Lọc theo tên bệnh nhân hoặc tên dịch vụ
  const filtered = requests.filter((r) => {
    const name = r.appointment?.patientProfile?.full_name || "";
    const service = r.service?.title || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      service.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f7fb",
      }}
    >
      {/* ========================= HEADER ========================= */}
      <div
        style={{
          height: 70,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        
        {/* <HiClipboardList
          style={{ fontSize: 30, color: "#2563eb", marginRight: 10 }}
        /> */}
        {/* <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Yêu cầu cận lâm sàng
        </h2> */}

        {/* Ô search */}
        {/* <div style={{ marginLeft: "auto", position: "relative", width: 320 }}>
          <input
            placeholder="Tìm bệnh nhân / dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontSize: 14,
            }}
          />
          <FiSearch
            style={{
              position: "absolute",
              top: 9,
              left: 10,
              color: "#6b7280",
              fontSize: 18,
            }}
          />
        </div> */}
      </div>

      {/* ========================= MAIN ========================= */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ============= SIDEBAR: DANH SÁCH YÊU CẦU ============= */}
        <div
          style={{
            width: 340,
            background: "#ffffff",
            borderRight: "1px solid #e5e7eb",
            overflowY: "auto",
            padding: 16,
            boxShadow: "inset -2px 0 6px rgba(0,0,0,0.04)",
          }}
        >

          {/* NÚT ĐĂNG XUẤT */}
<div
  style={{
    // marginTop: 20,
    paddingTop: 16,
    borderTop: "1px solid #e5e7eb",
  }}
>
  <button
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }}
    style={{
      width: "50%",
      padding: "10px 0",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 14,
      boxShadow: "0 3px 6px rgba(239,68,68,0.35)",
      transition: "0.25s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
  >
    Đăng xuất
  </button>
</div>

          <h3
            style={{
              margin: "0 0 12px",
              fontSize: 16,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Danh sách yêu cầu
          </h3>

          {filtered.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Không có yêu cầu nào.
            </p>
          ) : (
            filtered.map((req) => {
              const p = req.appointment?.patientProfile;
              const active = selected?.id === req.id;

              return (
                <div
                  key={req.id}
                  onClick={() => setSelected(req)}
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    border: active
                      ? "2px solid #2563eb"
                      : "1px solid #e5e7eb",
                    background: active ? "#eef4ff" : "#fafafa",
                    marginBottom: 10,
                    cursor: "pointer",
                    transition:
                      "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                    boxShadow: active
                      ? "0 4px 12px rgba(37,99,235,0.15)"
                      : "0 2px 6px rgba(0,0,0,0.04)",
                    ...animStyles.slideLeft,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateX(4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateX(0px)")
                  }
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#111827",
                    }}
                  >
                    {p?.full_name}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#2563eb",
                      marginTop: 2,
                    }}
                  >
                    {req.service?.title}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      marginTop: 4,
                    }}
                  >
                    {req.appointment?.appointment_date} •{" "}
                    {req.appointment?.appointment_time}
                  </div>

                  {/* BADGE trạng thái mới */}
                  <div
                    style={{
                      marginTop: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      color:
                        req.status === "pending" ? "#92400e" : "#065f46",
                      background:
                        req.status === "pending"
                          ? "linear-gradient(to right, #fef3c7, #fde68a)"
                          : "linear-gradient(to right, #d1fae5, #a7f3d0)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    }}
                  >
                    {req.status === "pending"
                      ? "⏳ Đang xử lý"
                      : "✔ Đã hoàn tất"}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ============= KHU VỰC CHI TIẾT PHẢI ============= */}
        <div
          style={{
            flex: 1,
            padding: 24,
            overflowY: "auto",
            ...animStyles.fadeIn,
          }}
        >
          {!selected ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                color: "#6b7280",
              }}
            >
              <FaUserMd style={{ fontSize: 60, opacity: 0.3 }} />
              <p style={{ marginTop: 10, fontSize: 15 }}>
                Chọn một yêu cầu ở danh sách bên trái để xem chi tiết
              </p>
            </div>
          ) : (
            <ClinicalRequestDetail
              request={selected}
              onDone={() => {
                setSelected(null);
                fetchRequests();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   COMPONENT: CHI TIẾT YÊU CẦU CLS
   ============================================================ */
const ClinicalRequestDetail = ({ request, onDone }) => {
  const token = localStorage.getItem("token");
  const [description, setDescription] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [saving, setSaving] = useState(false);

  const p = request.appointment?.patientProfile;
  const room = request.appointment?.clinic_room;
  const hasResult = !!request.result; // đã có kết quả hay chưa

  const submit = async () => {
    if (!description.trim() || !conclusion.trim()) {
      return alert("Bạn phải nhập mô tả và kết luận.");
    }

    try {
      setSaving(true);
      await axios.post(
        "http://localhost:5000/ccls/results",
        {
          ccls_request_id: request.id,
          description,
          conclusion,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Đã gửi kết quả!");
      onDone();
    } catch (err) {
      console.error(err);
      alert("Không thể gửi kết quả!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: 24,
        borderRadius: 18,
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        border: "1px solid #e5e7eb",
        ...animStyles.slideUp,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>
        Chi tiết yêu cầu
      </h2>

      {/* ===== THÔNG TIN BỆNH NHÂN ===== */}
      <Section title="🧍 Thông tin bệnh nhân">
        <Grid>
          <Info label="Họ tên" value={p?.full_name} />
          <Info label="Giới tính" value={p?.gender} />
          <Info label="Điện thoại" value={p?.phone} />
          <Info label="Địa chỉ" value={p?.address} full />
          <Info label="Nghề nghiệp" value={p?.job} full />
        </Grid>
      </Section>

      {/* ===== THÔNG TIN LỊCH KHÁM ===== */}
      <Section title="📅 Thông tin lịch khám">
        <Grid>
          <Info
            label="Ngày khám"
            value={request.appointment?.appointment_date}
          />
          <Info
            label="Giờ khám"
            value={request.appointment?.appointment_time}
          />
          <Info label="Phòng khám" value={room?.name} full />
        </Grid>
      </Section>

      {/* ===== THÔNG TIN CHỈ ĐỊNH ===== */}
      <Section title="📝 Thông tin chỉ định">
        <div style={{ fontSize: 14, lineHeight: "22px" }}>
          <p>
            <b>Dịch vụ:</b> {request.service?.title}
          </p>
          <p>
            <b>Bác sĩ chỉ định:</b> {request.requestDoctor?.name}
          </p>
          <p>
            <b>Ghi chú:</b> {request.note || "—"}
          </p>
        </div>
      </Section>

      {/* ===== KẾT QUẢ CẬN LÂM SÀNG ===== */}
      <Section title="🧾 Kết quả cận lâm sàng">
        {hasResult ? (
          // ===== CHẾ ĐỘ XEM LẠI KẾT QUẢ =====
          <div style={{ fontSize: 14, lineHeight: "22px" }}>
            <p>
              <b>Mô tả:</b>
              <br />
              {request.result.description}
            </p>
            <p style={{ marginTop: 10 }}>
              <b>Kết luận:</b>
              <br />
              {request.result.conclusion}
            </p>
          </div>
        ) : (
          // ===== CHẾ ĐỘ NHẬP KẾT QUẢ =====
          <>
            <label style={{ fontSize: 14 }}>Mô tả</label>
            <textarea
              rows={3}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid #d1d5db",
                marginBottom: 12,
                fontSize: 14,
                fontFamily: "inherit",
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết kết quả cận lâm sàng..."
            />

            <label style={{ fontSize: 14 }}>Kết luận</label>
            <textarea
              rows={2}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid #d1d5db",
                marginBottom: 12,
                fontSize: 14,
                fontFamily: "inherit",
              }}
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Nhập kết luận chuyên môn..."
            />

            <button
              onClick={submit}
              disabled={saving}
              style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {saving ? "Đang gửi..." : "Gửi kết quả"}
            </button>
          </>
        )}
      </Section>
    </div>
  );
};

/* ============================================================
   MINI UI COMPONENTS
   ============================================================ */
const Section = ({ title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <h3
      style={{
        margin: "0 0 10px",
        fontSize: 16,
        fontWeight: 600,
        color: "#111827",
      }}
    >
      {title}
    </h3>
    <div
      style={{
        background: "#f9fafb",
        padding: 14,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
      }}
    >
      {children}
    </div>
  </div>
);

const Grid = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      fontSize: 14,
    }}
  >
    {children}
  </div>
);

const Info = ({ label, value, full }) => (
  <div style={{ gridColumn: full ? "span 2" : "span 1" }}>
    <b>{label}:</b> {value || "—"}
  </div>
);

export default ClinicalDoctorManager;
