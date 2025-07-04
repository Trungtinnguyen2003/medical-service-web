import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import doctorService from "../../services/doctorService";
import {
  Container,
  ProfileWrapper,
  Avatar,
  Info,
  Name,
  Position,
  Section,
  SectionTitle,
  SectionContent,
  ServiceList,
  ServiceItem,
} from "./DoctorDetailPage.style";
import FAQSection from "../../components/FAQSection/FAQSection";

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [relatedDoctors, setRelatedDoctors] = useState([]);
  const [servicesByDepartment, setServicesByDepartment] = useState({});
  const [deptServices, setDeptServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const doc = await doctorService.getDoctorById(id);
      const dept = await doctorService.getDoctorDepartments(id);
      const srv = await doctorService.getDoctorServices?.(id);
      setDoctor(doc);
      setDepartments(dept);
      setServices(srv || []);
  
      // 🔄 Lấy dịch vụ từ chuyên khoa
      if (dept.length > 0) {
        const servicesByDept = {};
      
        for (const d of dept) {
          const res = await fetch(`http://localhost:5000/api/departments/${d.id}/services`);
          const data = await res.json();
          servicesByDept[d.name] = data;
        }
      
        setServicesByDepartment(servicesByDept);
      
        // Lấy bác sĩ cùng khoa
        const res = await fetch(`http://localhost:5000/api/departments/${dept[0].id}/doctors`);
        const data = await res.json();
        const filtered = data.filter((d) => d.id !== doc.id);
        setRelatedDoctors(filtered);
      }      
    };
    fetchData();
  }, [id]);

  if (!doctor) return <p>Đang tải thông tin bác sĩ...</p>;

  return (
    <Container>
      <ProfileWrapper style={{ marginTop: "100px" }}>
        <Avatar
          src={
            doctor.avatar
              ? `http://localhost:5000${doctor.avatar}`
              : "/images/default-doctor.jpg"
          }
        />
        <Info>
          <Name>{doctor.name}</Name>
          <Position>
            {doctor.degree} | {doctor.position}
          </Position>
          <p>
            <strong>Kinh nghiệm:</strong> {doctor.experience_years} năm
          </p>
        </Info>
      </ProfileWrapper>

      <Section>
        <SectionTitle>Giới thiệu</SectionTitle>
        <SectionContent>
          {doctor.description || "Chưa cập nhật."}
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Chuyên khoa đang công tác</SectionTitle>
        <SectionContent>
          {departments.map((d) => d.name).join(", ") || "Chưa cập nhật"}
        </SectionContent>
      </Section>

      <Section>
  <SectionTitle>Dịch vụ bác sĩ đang đảm nhận</SectionTitle>
  {departments.map((dept) => {
    const servicesInThisDept = services.filter(
      (s) => s.departments?.some((d) => d.id === dept.id)
    );

    if (servicesInThisDept.length === 0) return null;

    return (
      <div key={dept.id} style={{ marginBottom: 24 }}>
        <h4 style={{ color: "#0a2d55" }}>{dept.name}</h4>
        <ul style={{ paddingLeft: 20 }}>
          {servicesInThisDept.map((s) => (
            <li key={s.id}>{s.title}</li>
          ))}
        </ul>
      </div>
    );
  })}
</Section>





      <Section>
        <SectionTitle>Học vấn</SectionTitle>
        <SectionContent>
          {doctor.education_history || "Chưa cập nhật."}
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Lịch sử công tác</SectionTitle>
        <SectionContent>
          {doctor.work_history || "Chưa cập nhật."}
        </SectionContent>
      </Section>

      <Section>
  <SectionTitle>Các bác sĩ cùng chuyên khoa</SectionTitle>
  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
  {relatedDoctors.map((d) => (
  <div
    key={d.id}
    style={{
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 16,
      width: 220,
    }}
  >
    <img
      src={`http://localhost:5000${d.avatar}`}
      alt={d.name}
      style={{
        width: "100%",
        height: 240,
        objectFit: "cover",
        borderRadius: 8,
      }}
    />
    <h4 style={{ margin: "10px 0 5px" }}>{d.name}</h4>
    <p style={{ fontSize: 14 }}>{d.position}</p>

    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
      <button
        style={{
          padding: "6px 12px",
          background: "#0a2d55",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = `/doctors/${d.id}`)}
      >
        Xem chi tiết
      </button>

      <button
        style={{
          padding: "6px 12px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = `/dat-lich?doctorId=${d.id}`)}
      >
        Đặt lịch khám
      </button>
    </div>
  </div>
  
))}
  </div>
</Section>


    </Container>
  );
};

export default DoctorDetailPage;
