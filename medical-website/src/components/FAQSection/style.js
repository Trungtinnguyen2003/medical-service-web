import styled from "styled-components";

export const FAQWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding: 80px 20px;
  background: rgb(221, 233, 236);
  align-items: center;
`;

export const Left = styled.div`
  flex: 1;
  min-width: 320px;
  padding-left: 50px;
`;

export const Right = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
  text-align: center;
`;

export const Subtitle = styled.div`
  font-size: 14px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 10px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #0f172a;
`;

export const AccordionItem = styled.div`
  margin-bottom: 12px;
`;

export const Question = styled.div`
  background-color: ${({ isOpen }) => (isOpen ? "#e0f2fe" : "#f1f5f9")};
  border-radius: 8px;
  padding: 14px 16px;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  transition: background-color 0.3s ease;
`;

export const ArrowIcon = styled.span`
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const Answer = styled.div`
  max-height: ${({ isOpen }) => (isOpen ? "300px" : "0")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
  padding: ${({ isOpen }) => (isOpen ? "12px 16px" : "0 16px")};
  background-color: #f9fafc;
  font-size: 14px;
  color: #475569;
  border-radius: 0 0 8px 8px;
  transition: all 0.4s ease;
`;

export const DoctorImage = styled.img`
  width: 100%;
  border-radius: 12px;
  max-width: 360px;
`;

export const StatBox = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  color: #0f172a;
  text-align: center;

  strong {
    font-size: 20px;
    color: #2563eb;
    margin-top: 4px;
    display: block;
  }
`;
