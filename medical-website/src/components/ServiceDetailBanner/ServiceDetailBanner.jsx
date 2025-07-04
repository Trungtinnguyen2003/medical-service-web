import React from 'react';
import { BannerWrapper, Overlay, BannerContent, Title, Subtitle } from './style';

const ServiceDetailBanner = ({ serviceName }) => {
  return (
    <BannerWrapper>
      <Overlay />
      <BannerContent>
        <Title>Gói dịch vụ: {serviceName}</Title>
        <Subtitle>Chăm sóc sức khỏe tận tâm - Dành riêng cho bạn</Subtitle>
      </BannerContent>
    </BannerWrapper>
  );
};

export default ServiceDetailBanner;
