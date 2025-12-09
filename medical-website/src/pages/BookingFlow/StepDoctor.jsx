// src/pages/BookingFlow/StepDoctor.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorService from "../../services/doctorService";
import { saveBooking, getBooking } from "./bookingStorage";

import {
  PageWrapper,
  Layout,
  Sidebar,
  SidebarTitle,
  SidebarItem,
  Main,
  MainHeader,
  StepTitle,
  StepDescription,
} from "./style";
import logo from "../../assets/images/logo.png";

// ===================== Animation Keyframes =====================
const fadeIn = { animation: "fadeIn 0.6s ease" };
const slideUp = { animation: "slideUp 0.6s ease" };

const StepDoctor = () => {
  const navigate = useNavigate();
  const booking = getBooking();

  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [degree, setDegree] = useState("");
  const [department, setDepartment] = useState("");

  // ➤ Map số → thứ
  const DAY_MAP = {
    1: "Thứ 2",
    2: "Thứ 3",
    3: "Thứ 4",
    4: "Thứ 5",
    5: "Thứ 6",
    6: "Thứ 7",
    7: "Chủ nhật",
  };

  // ================== Lấy danh sách bác sĩ ==================
  useEffect(() => {
    doctorService.getAllDoctors().then((res) => {
      // ➤ Lọc bỏ bác sĩ thuộc khoa cận lâm sàng
      const filtered = res.filter(
        (doc) =>
          !doc.departments?.some((d) =>
            d.name.toLowerCase().includes("cận")
          )
      );

      setDoctors(filtered);
      setFiltered(filtered);
    });
  }, []);

  // ================== Bộ lọc ==================
  useEffect(() => {
    let ds = doctors;

    if (search) {
      ds = ds.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (gender) ds = ds.filter((d) => d.gender === gender);
    if (degree) ds = ds.filter((d) => d.title === degree);
    if (department)
      ds = ds.filter((d) =>
        d.departments?.some((dep) => dep.name === department)
      );

    setFiltered(ds);
  }, [search, gender, degree, department, doctors]);

  // ================== Khi chọn bác sĩ ==================
  const chooseDoctor = async (doc) => {
    try {
      const fullDoctor = await doctorService.getDoctorById(doc.id);

      saveBooking({
        ...booking,
        doctor: fullDoctor,
        doctorId: fullDoctor.id,
      });

      navigate(`/booking?stepName=department&doctorId=${fullDoctor.id}`);
    } catch (error) {
      console.error("Lỗi tải thông tin bác sĩ:", error);
    }
  };

  // ================== Render UI ==================
  return (
    <PageWrapper style={fadeIn}>
      <Layout>
        {/* Sidebar */}
        <Sidebar
          style={{
            marginTop: "60px",
            textAlign: "center",
            position: "sticky",
            top: "80px",
            height: "fit-content",
            zIndex: 10,
          }}
        >
          {/* LOGO */}
          <img
            src={logo}
            alt="Medcare Logo"
            style={{
              width: 120,
              height: "auto",
              objectFit: "contain",
              borderRadius: 12,
              margin: "0 auto 18px auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          <SidebarTitle>Thông tin cơ sở y tế</SidebarTitle>
          <SidebarItem>
            <b>Cơ sở:</b> Phòng khám / Bệnh viện của bạn
          </SidebarItem>
          <SidebarItem>
            <b>Địa chỉ:</b> Đường 3/2, Thành Phố Cần Thơ
          </SidebarItem>
        </Sidebar>

        {/* Main */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader style={slideUp}>Vui lòng chọn Bác sĩ</MainHeader>
          <StepTitle>Chọn bác sĩ muốn khám</StepTitle>

          <StepDescription style={slideUp}>
            Bạn có thể tìm kiếm theo tên, chuyên khoa hoặc học vị.
          </StepDescription>

          {/* Search bar */}
          <input
            placeholder="🔍 Tìm nhanh bác sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid #cfd8dc",
              marginBottom: 16,
              fontSize: 15,
              transition: "0.25s",
            }}
          />

          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
              ...fadeIn,
            }}
          >
            {/* <select value={degree} onChange={(e) => setDegree(e.target.value)} style={selectStyle}>
              <option value="">Học vị</option>
              <option value="BS CKI">BS CKI</option>
              <option value="BS CKII">BS CKII</option>
              <option value="TS BS">TS BS</option>
            </select> */}

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={selectStyle}
            >
              <option value="">Chuyên khoa</option>
              {doctors
                .flatMap((d) => d.departments || [])
                .filter((dep) => !dep.name.toLowerCase().includes("cận"))
                .map((dep, i) => (
                  <option key={i} value={dep.name}>
                    {dep.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Doctor list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
            {filtered.map((doc) => {
              // ↓ Lấy danh sách thứ mà bác sĩ làm
              const schedules =
                doc.schedules ||
                doc.doctor_schedules ||
                doc.workDays ||
                [];

              // Chuyển số ngày -> chữ: "Thứ 2, Thứ 4, Thứ 6"
              const workDaysText =
  doc.schedules?.length > 0
    ? [...new Set(doc.schedules.map(s => DAY_MAP[s.day_of_week]))].join(", ")
    : "Chưa có lịch";


              return (
                <div
                  key={doc.id}
                  onClick={() => chooseDoctor(doc)}
                  style={{
                    padding: 18,
                    borderRadius: 14,
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0,0,0,0.09)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.05)";
                  }}
                >
                  <h3 style={{ margin: 0, color: "#0077c2", fontWeight: 600 }}>
                    {doc.title} {doc.name}
                  </h3>

                  {/* ẨN GIỚI TÍNH — XOÁ BỎ */}

                  <p style={infoRow}>
                    <b>Chuyên khoa:</b> {doc.departments?.map((d) => d.name).join(", ")}
                  </p>

                  {/* ẨN GIÁ KHÁM — XOÁ BỎ */}

                  {/* ➤ THÊM LỊCH LÀM VIỆC */}
                  <p style={infoRow}>
                    <b>Lịch làm việc:</b> {workDaysText}
                  </p>
                </div>
              );
            })}
          </div>
        </Main>
      </Layout>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageWrapper>
  );
};

const selectStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #cfd8dc",
  fontSize: 14,
  width: "100%",
};

const infoRow = {
  margin: "6px 0",
  color: "#444",
};

export default StepDoctor;
