// src/components/ServicePage/ServiceBanner.jsx
import React from 'react';
import {
  BannerWrapper,
  SubTitle,
  MainTitle,
} from './style';

const ServiceBanner = () => {
  return (
    <BannerWrapper>
      <SubTitle>Dịch Vụ Y Tế</SubTitle>
      <MainTitle>Giải pháp chăm sóc sức khỏe toàn diện cho mọi nhu cầu của bạn</MainTitle>
    </BannerWrapper>
  );
};

export default ServiceBanner;
