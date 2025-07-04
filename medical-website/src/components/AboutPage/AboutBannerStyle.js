import styled from "styled-components";
import backgroundImage from "../../assets/images/19.jpg"; // ảnh nền banner

export const BannerWrapper = styled.section`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 120px 20px 60px;
  text-align: center;
  color: #0f172a;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 0;
  }
`;

export const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.4;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const ImageWrapper = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
  position: relative;
  z-index: 1;
`;

export const ImageBox = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;
