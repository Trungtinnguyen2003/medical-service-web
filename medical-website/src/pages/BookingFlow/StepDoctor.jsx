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

const StepDoctor = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
const booking = getBooking();
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [degree, setDegree] = useState("");
  const [department, setDepartment] = useState("");

  // 🟦 Lấy danh sách bác sĩ
  useEffect(() => {
    doctorService.getAllDoctors().then((res) => {
      setDoctors(res);
      setFiltered(res);
    });
  }, []);

  // 🟦 Lọc bác sĩ
  useEffect(() => {
    let ds = doctors;

    if (search) {
      ds = ds.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (gender) {
      ds = ds.filter((d) => d.gender === gender);
    }

    if (degree) {
      ds = ds.filter((d) => d.title === degree);
    }

    if (department) {
      ds = ds.filter((d) =>
        d.departments?.some((dep) => dep.name === department)
      );
    }

    setFiltered(ds);
  }, [search, gender, degree, department, doctors]);

  // 🟦 Khi chọn 1 bác sĩ
  const chooseDoctor = (doc) => {
     saveBooking({
   doctor: doc,
   doctorId: doc.id
 });
    navigate(`/booking?stepName=department&doctorId=${doc.id}`);

  };

  return (
    <PageWrapper>
      <Layout>
        {/* SIDEBAR */}
        <Sidebar>
          <SidebarTitle>Thông tin cơ sở y tế</SidebarTitle>
          <SidebarItem>
            <b>Cơ sở:</b> Phòng khám / Bệnh viện của bạn
          </SidebarItem>
          <SidebarItem>
            <b>Địa chỉ:</b> CS2, Nguyễn Chí Thanh, Q5, TP.HCM
          </SidebarItem>
        </Sidebar>

        {/* MAIN */}
        <Main>
          <MainHeader>Vui lòng chọn Bác sĩ</MainHeader>
          <StepTitle>Chọn bác sĩ muốn khám</StepTitle>

          <StepDescription>
            Bạn có thể tìm kiếm theo tên, chuyên khoa hoặc giới tính.
          </StepDescription>

          {/* Search */}
          <input
            placeholder="Tìm nhanh bác sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 14,
            }}
          />

          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {/* Học vị */}
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              style={{ padding: 10, borderRadius: 8 }}
            >
              <option value="">Học vị</option>
              <option value="BS CKI">BS CKI</option>
              <option value="BS CKII">BS CKII</option>
              <option value="TS BS">TS BS</option>
            </select>

            {/* Chuyên khoa */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{ padding: 10, borderRadius: 8 }}
            >
              <option value="">Chuyên khoa</option>
              {doctors
                .flatMap((d) => d.departments || [])
                .map((dep, i) => (
                  <option key={i} value={dep.name}>
                    {dep.name}
                  </option>
                ))}
            </select>

            {/* Giới tính */}
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ padding: 10, borderRadius: 8 }}
            >
              <option value="">Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          {/* DANH SÁCH BÁC SĨ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {filtered.map((doc) => (
              <div
                key={doc.id}
                onClick={() => chooseDoctor(doc)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid #e2e2e2",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <h3 style={{ margin: 0, color: "#d35400" }}>
                  {doc.title} {doc.name}
                </h3>

                <p style={{ margin: "6px 0" }}>
                  <b>Giới tính:</b> {doc.gender}
                </p>

                <p style={{ margin: "6px 0" }}>
                  <b>Chuyên khoa:</b>{" "}
                  {doc.departments?.map((d) => d.name).join(", ")}
                </p>

                <p style={{ margin: "6px 0" }}>
                  <b>Giá khám:</b>{" "}
                  {doc.price
                    ? Number(doc.price).toLocaleString()
                    : "150.000"}{" "}
                  đ
                </p>
              </div>
            ))}
          </div>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDoctor;
