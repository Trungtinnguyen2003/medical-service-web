import React, { useEffect, useState } from 'react';
import {
  Section,
  Subtitle,
  Title,
  DoctorGrid,
  DoctorCard,
  Avatar,
  Name,
  Speciality,
  CardBody,
  Overlay,
  DetailButton
} from './style';
import doctorService from '../../services/doctorService';

const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());

const DoctorListSection = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await doctorService.getAllDoctors();
      const approved = res.filter((d) => d.user?.status === 'approved');
      setDoctors(shuffleArray(approved).slice(0, 5));
    };
    fetchDoctors();
  }, []);

  return (
    <Section id="doctors">
      <Subtitle>Đội ngũ chuyên gia</Subtitle>
      <Title>Gặp gỡ các bác sĩ hàng đầu</Title>

      <DoctorGrid>
        {doctors.map((doc, index) => (
          <DoctorCard key={doc.id} data-aos="fade-up" data-aos-delay={index * 100}>
            <Avatar
              src={doc.avatar ? `http://localhost:5000${doc.avatar}` : '/images/default-doctor.jpg'}
              alt={doc.name}
            />
            <Overlay className="overlay">
  <DetailButton onClick={() => window.location.href = `/doctors/${doc.id}`}>
    Xem chi tiết
  </DetailButton>
</Overlay>

            <CardBody>
              <Name>{doc.name}</Name>
              <Speciality>{doc.position}</Speciality>
            </CardBody>
          </DoctorCard>
        ))}
      </DoctorGrid>
    </Section>
  );
};

export default DoctorListSection;
