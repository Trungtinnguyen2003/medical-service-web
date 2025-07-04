// src/components/AboutPage/AboutBanner.jsx
import React from "react";
import {
  BannerWrapper,
  Subtitle,
  Title,
  ImageWrapper,
  ImageBox
} from "./AboutBannerStyle";

import img1 from "../../assets/images/20.jpg"; // đổi theo tên ảnh bạn muốn
import img2 from "../../assets/images/21.jpg"; // đổi theo tên ảnh bạn muốn

const AboutBanner = () => {
  return (
    <BannerWrapper>
      <Subtitle>Về Chúng Tôi</Subtitle>
      <Title>Hành trình chăm sóc sức khỏe của bạn bắt đầu từ đây</Title>

      <ImageWrapper>
        <ImageBox src={img1} alt="Khám bệnh 1" />
        <ImageBox src={img2} alt="Khám bệnh 2" />
      </ImageWrapper>
    </BannerWrapper>
  );
};

export default AboutBanner;
