// src/components/HomePage/FeaturedServicesSection/FeaturedServicesSection.jsx
import React from "react";
import styled from "styled-components";
import {
    SectionWrapper,
    Title,
    ServicesGrid,
    ServiceCard,
    IconWrapper,
    ServiceTitle,
    ServiceDesc
  } from "./style";
import { FaHeartbeat, FaUserMd } from "react-icons/fa";
import { FaStethoscope } from "react-icons/fa6";
  

const FeaturedServicesSection = () => {
  return (
    <SectionWrapper id="featured-services">
      <Title>
        Các <span>dịch vụ nổi bật</span>
      </Title>
      <ServicesGrid>
        <ServiceCard>
          <IconWrapper><FaHeartbeat /></IconWrapper>
          <ServiceTitle>Tư vấn sức khỏe</ServiceTitle>
          <ServiceDesc>Hỗ trợ tư vấn 1:1 cùng bác sĩ giàu kinh nghiệm.</ServiceDesc>
        </ServiceCard>

        <ServiceCard>
          <IconWrapper><FaStethoscope /></IconWrapper>
          <ServiceTitle>Khám tổng quát</ServiceTitle>
          <ServiceDesc>Đánh giá toàn diện sức khỏe định kỳ.</ServiceDesc>
        </ServiceCard>

        <ServiceCard>
          <IconWrapper><FaUserMd /></IconWrapper>
          <ServiceTitle>Đặt lịch trực tuyến</ServiceTitle>
          <ServiceDesc>Chọn bác sĩ & thời gian linh hoạt, tiết kiệm thời gian.</ServiceDesc>
        </ServiceCard>
      </ServicesGrid>
    </SectionWrapper>
  );
};

export default FeaturedServicesSection;
