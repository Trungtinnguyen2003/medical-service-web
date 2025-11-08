import React from "react";
import styled from "styled-components";
import bannerImg from "../../assets/images/3.jpg"; // bạn có thể thay bằng hình khác trong thư mục assets

const BannerWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${bannerImg});
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(60, 0, 90, 0.55);
  backdrop-filter: blur(2px);
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ConsultationBanner = () => {
  return (
    <BannerWrapper>
      <Overlay />
      <Content data-aos="fade-up">
        <Title>Hệ Thống Tư Vấn Bệnh Nhân</Title>
        <Subtitle>
          Gửi câu hỏi và nhận lời khuyên từ các bác sĩ chuyên khoa — nhanh chóng, tận tâm, và bảo mật.
        </Subtitle>
      </Content>
    </BannerWrapper>
  );
};

export default ConsultationBanner;
