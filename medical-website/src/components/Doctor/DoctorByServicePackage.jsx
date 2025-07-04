import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import styled from "styled-components";

const Section = styled.div`
  margin-top: 60px;
`;
const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 24px;
  color: #0a2d55;
`;
const Card = styled.div`
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin: 0 8px;
`;
const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
`;
const Name = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #0a2d55;
`;
const Meta = styled.div`
  font-size: 14px;
  color: #555;
  margin-top: 4px;
`;

const DoctorByServicePackage = ({ packageId }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/packages/${packageId}/doctors`);
        setDoctors(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải bác sĩ:", err);
      }
    };
    if (packageId) fetchDoctors();
  }, [packageId]);

  if (!doctors || doctors.length === 0) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, doctors.length),
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Section>
      <Title>Bác sĩ thực hiện gói dịch vụ</Title>
      <Slider {...settings}>
        {doctors.map((doc) => (
          <Card key={doc.id}>
            <Avatar src={`http://localhost:5000${doc.avatar || "/images/default-doctor.jpg"}`} />
            <Name>{doc.name}</Name>
            <Meta>{doc.degree} – {doc.position}</Meta>
            <Meta>{doc.experience_years} năm kinh nghiệm</Meta>
            {doc.departments?.length > 0 && (
              <Meta>Chuyên khoa: {doc.departments.map(d => d.name).join(", ")}</Meta>
            )}
          </Card>
        ))}
      </Slider>
    </Section>
  );
};

export default DoctorByServicePackage;
