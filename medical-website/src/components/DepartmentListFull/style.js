import styled from "styled-components";
import { Link } from "react-router-dom";

export const GridWrapper = styled.div`
  padding: 60px 20px;
  background-color: #f8fafc;
  text-align: center;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
`;

export const GridItem = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const IconWrapper = styled.div`
  font-size: 32px;
  color: #2563eb;
  margin-bottom: 12px;
`;

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #475569;
  margin-bottom: 12px;
`;

export const ExploreLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
