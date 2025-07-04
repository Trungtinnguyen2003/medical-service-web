// src/components/DoctorPage/DoctorBanner.jsx
import React from 'react';
import { BannerWrapper, Overlay, Title, Subtitle } from './DoctorBanner.style';

const DoctorBanner = () => {
  return (
    <BannerWrapper>
      <Overlay />
      <Title>Đội ngũ bác sĩ chuyên khoa</Title>
      <Subtitle>Giàu kinh nghiệm - Tận tâm - Chuyên môn cao</Subtitle>
    </BannerWrapper>
  );
};

export default DoctorBanner;
