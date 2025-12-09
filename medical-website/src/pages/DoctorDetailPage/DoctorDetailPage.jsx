import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import doctorService from "../../services/doctorService";

import {
  PageWrapper,
  HeaderSection,
  AvatarWrapper,
  Avatar,
  InfoBox,
  DoctorName,
  DoctorMeta,
  ActionButton,
  GradientCard,
  SectionTitle,
  SectionBody,
  ServiceGroup,
  ServiceItem,
  RelatedList,
  RelatedDoctorCard,
} from "./DoctorDetailPage.style";

import { FiBriefcase, FiStar, FiLayers, FiBookmark } from "react-icons/fi";

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesByDepartment, setServicesByDepartment] = useState({});
  const [relatedDoctors, setRelatedDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const doc = await doctorService.getDoctorById(id);
      const dept = await doctorService.getDoctorDepartments(id);
      const srv = await doctorService.getDoctorServices(id);

      console.log("Doctor:", doc);
      console.log("Departments:", dept);
      console.log("Services:", srv);

      setDoctor(doc);
      setDepartments(dept);
      setServices(Array.isArray(srv) ? srv : []);

      // lấy dịch vụ theo chuyên khoa
      if (dept && dept.length > 0) {
        const servicesByDept = {};
        for (const d of dept) {
          const res = await fetch(`http://localhost:5000/api/departments/${d.id}/services`);
          const data = await res.json();
          servicesByDept[d.name] = data;
        }
        setServicesByDepartment(servicesByDept);

        // lấy bác sĩ cùng khoa
        try {
          const res = await fetch(`http://localhost:5000/api/departments/${dept[0].id}/doctors`);
          const doctorsRaw = await res.json();

          console.log("Related doctors API:", doctorsRaw);

          const filtered = doctorsRaw.filter((d) => d.id !== doc.id);
          setRelatedDoctors(filtered);
        } catch (err) {
          console.error("Lỗi lấy bác sĩ cùng khoa:", err);
        }
      }
    };

    fetchData();
  }, [id]);

  if (!doctor) return <p style={{ marginTop: 100 }}>Đang tải thông tin...</p>;

  return (
    <PageWrapper>
      {/* HEADER */}
      <HeaderSection>
        <AvatarWrapper>
          <Avatar
            src={
              doctor.avatar
                ? `http://localhost:5000${doctor.avatar}`
                : "/images/default-doctor.jpg"
            }
          />
        </AvatarWrapper>

        <InfoBox>
          <DoctorName>{doctor.name}</DoctorName>
          <DoctorMeta>
            <FiBriefcase /> {doctor.position} • {doctor.degree}
          </DoctorMeta>
          <DoctorMeta>
            <FiStar /> Kinh nghiệm: {doctor.experience_years} năm
          </DoctorMeta>

          <ActionButton onClick={() => navigate(`/dat-lich?doctorId=${id}`)}>
            Đặt lịch khám
          </ActionButton>
        </InfoBox>
      </HeaderSection>

      {/* GIỚI THIỆU */}
      <GradientCard>
        <SectionTitle>Giới thiệu</SectionTitle>
        <SectionBody>{doctor.description || "Chưa cập nhật."}</SectionBody>
      </GradientCard>

      {/* CHUYÊN KHOA */}
      <GradientCard>
        <SectionTitle>Chuyên khoa công tác</SectionTitle>
        <SectionBody>
          {departments.length > 0
            ? departments.map((d) => d.name).join(", ")
            : "Chưa cập nhật"}
        </SectionBody>
      </GradientCard>

      {/* DỊCH VỤ BÁC SĨ ĐẢM NHẬN */}
      <GradientCard>
        <SectionTitle>Dịch vụ bác sĩ đang đảm nhận</SectionTitle>

        {departments.map((dept) => {
          const servicesInThisDept = services.filter(
            (s) => s.department?.id === dept.id || s.assignedDepartment?.id === dept.id
          );

          if (servicesInThisDept.length === 0) return null;

          return (
            <ServiceGroup key={dept.id}>
              <h4>
                <FiLayers /> {dept.name}
              </h4>

              {servicesInThisDept.map((s) => (
                <ServiceItem key={s.id}>
                  <FiBookmark size={14} /> {s.title}
                </ServiceItem>
              ))}
            </ServiceGroup>
          );
        })}
      </GradientCard>

      {/* HỌC VẤN */}
      <GradientCard>
        <SectionTitle>Đào Tạo</SectionTitle>
        <SectionBody>{doctor.education_history || "Chưa cập nhật."}</SectionBody>
      </GradientCard>

      {/* LỊCH SỬ CÔNG TÁC */}
      <GradientCard>
        <SectionTitle>Lịch sử công tác</SectionTitle>
        <SectionBody>{doctor.work_history || "Chưa cập nhật."}</SectionBody>
      </GradientCard>

      <GradientCard>
        <SectionTitle>Thông tin thêm</SectionTitle>
        <SectionBody>{doctor.extra_info || "Chưa cập nhật."}</SectionBody>
      </GradientCard>

      {/* BÁC SĨ CÙNG CHUYÊN KHOA */}
      <GradientCard>
        <SectionTitle>Các bác sĩ cùng chuyên khoa</SectionTitle>

        <RelatedList>
          {relatedDoctors.length === 0 && (
            <p style={{ fontSize: 14, color: "#64748b" }}>
              Không tìm thấy bác sĩ nào khác trong khoa này.
            </p>
          )}

          {relatedDoctors.map((d) => (
            <RelatedDoctorCard key={d.id}>
              <img
                src={`http://localhost:5000${d.avatar}`}
                className="avatar"
                alt={d.name}
              />

              <h4>{d.name}</h4>
              <p>{d.position}</p>

              <button onClick={() => navigate(`/doctors/${d.id}`)}>
                Xem chi tiết
              </button>

              <button
                className="book"
                onClick={() => navigate(`/dat-lich?doctorId=${d.id}`)}
              >
                Đặt lịch
              </button>
            </RelatedDoctorCard>
          ))}
        </RelatedList>
      </GradientCard>
    </PageWrapper>
  );
};

export default DoctorDetailPage;
