import styled from "styled-components";

export const AboutWrapper = styled.section`
  padding: 100px 20px;
  background-color: #f6f4fc;
  text-align: center;
`;

export const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 48px;
  position: relative;

  &::before {
    content: "GIÁ TRỊ";
    font-size: 13px;
    color: #a78bfa;
    font-weight: 600;
    position: absolute;
    top: -32px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ede9fe;
    padding: 2px 12px;
    border-radius: 999px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1080px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ValueCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
  }
`;

export const IconWrapper = styled.div`
  background-color: #ede9fe;
  color: #a855f7;
  width: 60px;
  height: 60px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

export const Title = styled.h4`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2937;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
`;
