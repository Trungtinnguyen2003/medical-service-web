import styled from "styled-components";

export const Wrapper = styled.div`
  margin-top: 50px;
  padding: 20px 30px;
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 28px;
  border-left: 4px solid #3b82f6;
  padding-left: 12px;
`;

export const ServiceCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

export const ServiceImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
`;

export const ServiceInfo = styled.div`
  flex: 1;
`;

export const ServiceName = styled.h4`
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
`;

export const ServiceDescription = styled.p`
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
`;
