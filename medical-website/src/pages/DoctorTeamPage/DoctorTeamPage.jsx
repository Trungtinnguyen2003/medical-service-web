// ===============================================
// DoctorTeamPage.jsx — Premium UI + Search on Top
// ===============================================
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DoctorBanner from "../../components/DoctorPage/DoctorBanner";
import departmentService from "../../services/departmentService";

import {
  PageWrapper,
  Sidebar,
  SidebarTitle,
  DeptItem,
  SearchBox,
  Content,
  DoctorGrid,
  DoctorCard,
  DoctorAvatar,
  DoctorInfo,
  DoctorName,
  DoctorMeta,
  Button,
} from "./DoctorTeamPage.style";

const DoctorTeamPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // ================= LOAD DEPARTMENTS =================
  useEffect(() => {
    const fetchDepartments = async () => {
      const list = await departmentService.getAllDepartments();
      setDepartments(list);
      if (list.length > 0) setSelectedDept(list[0].id);
    };
    fetchDepartments();
  }, []);

  // ================= LOAD DOCTORS =================
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedDept) return;

      const res = await departmentService.getDoctorsByDepartment(selectedDept);
      const approved = res.filter(
        (doc) => doc.user && doc.user.status === "approved"
      );
      setDoctors(approved);
    };

    fetchDoctors();
  }, [selectedDept]);

  // ================= FILTERED LIST =================
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [doctors, search]);

  return (
    <>
      <DoctorBanner />

      <PageWrapper>
        {/* ------------------- SIDEBAR ------------------- */}
        <Sidebar>
          {/* 🔎 Search Box placed ON TOP */}
          <SearchBox
            placeholder="🔍 Tìm kiếm bác sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SidebarTitle>Chuyên khoa</SidebarTitle>

          {departments.map((dept) => (
            <DeptItem
              key={dept.id}
              active={dept.id === selectedDept}
              onClick={() => setSelectedDept(dept.id)}
            >
              {dept.name}
            </DeptItem>
          ))}
        </Sidebar>

        {/* ------------------- CONTENT ------------------- */}
        <Content>
          <h2 style={{ marginBottom: 20 }}>
            Bác sĩ thuộc khoa{" "}
            <strong>
              {departments.find((d) => d.id === selectedDept)?.name}
            </strong>
          </h2>

          <DoctorGrid>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id}>
                  <DoctorAvatar
                  loading="lazy"
                    src={
                      doctor.avatar
                        ? `http://localhost:5000${doctor.avatar}`
                        : "/images/default-doctor.jpg"
                    }
                  />

                  <DoctorInfo>
                    <DoctorName>{doctor.name}</DoctorName>

                    <DoctorMeta>Học vị: {doctor.degree || "—"}</DoctorMeta>
                    <DoctorMeta>
                      Kinh nghiệm: {doctor.experience_years} năm
                    </DoctorMeta>
                    <DoctorMeta>Chức vụ: {doctor.position || "—"}</DoctorMeta>

                    <Button onClick={() => navigate(`/doctors/${doctor.id}`)}>
                      XEM CHI TIẾT
                    </Button>
                  </DoctorInfo>
                </DoctorCard>
              ))
            ) : (
              <p>Không tìm thấy bác sĩ phù hợp.</p>
            )}
          </DoctorGrid>
        </Content>
      </PageWrapper>
    </>
  );
};

export default DoctorTeamPage;
