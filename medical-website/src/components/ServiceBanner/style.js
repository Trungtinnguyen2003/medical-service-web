// src/components/ServicePage/style.js
import styled from "styled-components";

export const BannerWrapper = styled.div`
  position: relative;
  padding: 100px 20px 60px;
  background: linear-gradient(to right, #e0c3fc, #8ec5fc);
  text-align: center;
`;

export const SubTitle = styled.div`
  font-size: 14px;
  color: #7c3aed;
  font-weight: 600;
  margin-bottom: 10px;
`;

export const MainTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  max-width: 800px;
  margin: 0 auto;
`;

export const LeftIcon = styled.img`
  position: absolute;
  left: 40px;
  top: 40%;
  width: 60px;
  opacity: 0.15;
`;

export const RightIcon = styled.img`
  position: absolute;
  right: 40px;
  top: 30%;
  width: 60px;
  opacity: 0.15;
`;
