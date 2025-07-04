// src/components/DepartmentPage/style.js
import styled from "styled-components";

export const BannerWrapper = styled.div`
  position: relative;
  padding: 100px 20px 60px;
  background: linear-gradient(to right, rgb(162, 120, 183), #eef2f7);
  text-align: center;
`;

export const SubTitle = styled.div`
  font-size: 14px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 10px;
`;

export const MainTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
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
