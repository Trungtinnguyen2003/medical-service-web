import React from 'react';
import {
  BannerWrapper,
  ContentWrapper,
  Quote,
  StatsContainer,
  StatItem,
  StatNumber,
  StatLabel,
} from './style';

const StatisticBanner = () => {
  return (
    <BannerWrapper>
      <ContentWrapper>
        <Quote data-aos="fade-right">"Trao gửi sức khỏe bằng cả trái tim"</Quote>
        <StatsContainer>
          <StatItem data-aos="fade-left" data-aos-delay="100">
            <StatNumber>120k+</StatNumber>
            <StatLabel>Tỷ lệ hồi phục</StatLabel>
          </StatItem>
          <StatItem data-aos="fade-left" data-aos-delay="200">
            <StatNumber>96%</StatNumber>
            <StatLabel>Mức độ hài lòng</StatLabel>
          </StatItem>
          <StatItem data-aos="fade-left" data-aos-delay="300">
            <StatNumber>62+</StatNumber>
            <StatLabel>Bác sĩ chuyên môn</StatLabel>
          </StatItem>
        </StatsContainer>
      </ContentWrapper>
    </BannerWrapper>
  );
};

export default StatisticBanner;
