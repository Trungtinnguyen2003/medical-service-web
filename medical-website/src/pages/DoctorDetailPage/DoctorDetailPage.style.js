import styled from "styled-components";

export const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: center;
  margin-bottom: 40px;
`;

export const Avatar = styled.img`
  width: 220px;
  height: 280px;
  object-fit: cover;
  border-radius: 16px;
  border: 3px solid #0a2d55;
`;

export const Info = styled.div`
  flex: 1;
`;

export const Name = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #0a2d55;
  margin-bottom: 8px;
`;

export const Position = styled.p`
  font-size: 16px;
  color: #444;
  margin-bottom: 8px;
`;

export const Section = styled.div`
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h3`
  font-size: 20px;
  color: #0a2d55;
  margin-bottom: 10px;
`;

export const SectionContent = styled.p`
  font-size: 16px;
  color: #333;
  white-space: pre-line;
`;

export const ServiceList = styled.ul`
  padding-left: 20px;
`;

export const ServiceItem = styled.li`
  font-size: 15px;
  color: #222;
  line-height: 1.6;
`;
