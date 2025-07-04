// src/components/HomePage/TestimonialSection/style.js
import styled from "styled-components";

export const Section = styled.div`
  padding: 60px 20px;
  text-align: center;
  background: #f9fbff;
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 10px 0 30px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #5b6c8f;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

export const TestimonialContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const TestimonialCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  max-width: 280px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  text-align: left;
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

export const Name = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0;
`;

export const Location = styled.p`
  font-size: 14px;
  color: #1f88e5;
  margin-bottom: 10px;
`;

export const Comment = styled.p`
  font-size: 14px;
  color: #333;
`;

export const NavButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #1f88e5;
  transition: 0.2s ease;
  &:hover {
    color: #0d6efd;
  }
`;
