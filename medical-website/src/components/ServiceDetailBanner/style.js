import styled from "styled-components";

export const BannerWrapper = styled.div`
  position: relative;
  height: 300px;
  background-image: url("/images/service-banner.jpg"); /* thay bằng ảnh banner thật */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(103, 150, 206, 0.5);
`;

export const BannerContent = styled.div`
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 10px;
`;

export const Subtitle = styled.p`
  font-size: 18px;
  color: #eee;
`;
