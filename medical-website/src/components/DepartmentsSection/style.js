import styled from "styled-components";
import { Link } from "react-router-dom";
import bgImage from "../../assets/images/6.jpg";

export const SectionWrapper = styled.section`
  padding: 80px 20px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  text-align: center;
`;

export const Subtitle = styled.div`
  font-size: 14px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #0f172a;
`;

export const CardSliderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const NavButton = styled.button`
  background: #1e3a8a;
  color: white;
  border: none;
  font-size: 16px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #3b82f6;
    transform: scale(1.05);
  }
`;

export const CardSlider = styled.div`
  overflow: hidden;
  width: 1000px;
`;

export const CardTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  width: 220px;
  margin: 0 10px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 24px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
`;

export const Description = styled.p`
  font-size: 13px;
  color: #475569;
  margin-bottom: 12px;
`;

export const ExploreLink = styled(Link)`
  color: #2563eb;
  font-size: 14px;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;
