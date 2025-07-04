// src/components/Common/WorkingProcessStyle.js
import styled from "styled-components";

export const Section = styled.section`
  text-align: center;
  padding: 80px 20px;
  background-color: #f9fafb;
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

export const StepsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
`;

export const StepCard = styled.div`
  max-width: 200px;
  text-align: center;
`;

export const StepNumber = styled.div`
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin: 0 auto 16px;
`;

export const StepImage = styled.img`
  width: 100%;
  border-radius: 16px;
  margin-bottom: 12px;
  border: 3px dashed #cbd5e1;
  padding: 4px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const StepTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
`;

export const StepDesc = styled.p`
  font-size: 13px;
  color: #475569;
`;
