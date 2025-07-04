import styled from "styled-components";

export const Section = styled.section`
  padding: 80px 20px;
  background-color: #f8fafc;
`;

export const Background = styled.div`
  background-size: cover;
  background-position: center;
  padding: 100px 0;
  display: flex;
  justify-content: center;
`;

export const FormCard = styled.div`
  background: white;
  width: 100%;
  max-width: 880px;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  text-align: center;
`;

export const SubHeader = styled.div`
  font-size: 14px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Header = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 32px;
`;

export const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const InputGroup = styled.div`
  flex: 1;
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f9fafb;
`;

export const Icon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #64748b;
`;

export const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  background-color: #3b82f6;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;
