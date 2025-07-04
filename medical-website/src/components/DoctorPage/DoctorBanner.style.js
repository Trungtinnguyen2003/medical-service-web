// src/components/DoctorPage/DoctorBanner.style.js
import styled from "styled-components";
import bgImage from "../../assets/images/doctorbanner.jpg"; // 💡 ảnh nền bác sĩ

export const BannerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  //   background-color: rgba(17, 78, 146, 0.5); // lớp phủ xanh dương đậm
  top: 0;
  left: 0;
  z-index: 1;
`;

export const Title = styled.h1`
  color: white;
  font-size: 36px;
  font-weight: 700;
  z-index: 2;
`;

export const Subtitle = styled.p`
  color: white;
  font-size: 18px;
  z-index: 2;
  margin-top: 10px;
`;
