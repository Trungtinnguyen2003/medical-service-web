// src/components/HomePage/FeaturedServicesSection/style.js
import styled from "styled-components";

export const SectionWrapper = styled.section`
  padding: 80px 20px;
  background-color: #fdf4ff;
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;

  span {
    color: #a855f7;
  }
`;

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

export const ServiceCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  }
`;

export const IconWrapper = styled.div`
  font-size: 32px;
  color: #9333ea;
  margin-bottom: 12px;
`;

export const ServiceTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const ServiceDesc = styled.p`
  font-size: 14px;
  color: #4b5563;
`;
