import styled from "styled-components";

export const ServicesWrapper = styled.section`
  padding: 100px 20px;
  background-color: rgb(243, 232, 253);
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
  align-items: flex-start;
`;

export const LeftColumn = styled.div`
  flex: 1;
  min-width: 300px;
  padding-left: 100px; // ✅ cách nội dung bên phải
`;

export const RightColumn = styled.div`
  flex: 1;
  min-width: 300px;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(32px, 5vw, 48px);

  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
`;

export const Description = styled.p`
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 32px;
  max-width: 500px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`;

export const StatItem = styled.div``;

export const StatNumber = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #a855f7;
  margin: 0;
`;

export const StatLabel = styled.p`
  font-size: 14px;
  color: #6b7280;
`;
export const ServicesLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "box1 box1"
    "box2 box3";
  gap: 20px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 220px); // ⬅ tăng từ 160px lên 220px
  grid-template-rows: repeat(2, 220px); // ⬅ tăng từ 160px lên 220px
  gap: 24px;
  justify-content: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

export const ServiceBox = styled.div`
  background: linear-gradient(135deg, rgb(250, 247, 252), rgb(247, 246, 248));
  border-radius: 24px;
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.05);
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.35s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 48px rgba(0, 0, 0, 0.1);
  }
`;

export const ServicesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ServiceCard = styled.div`
  background: white;
  padding: 18px 24px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08);
  }
`;

export const IconCircle = styled.div`
  background-color: #ede9fe;
  color: #7c3aed;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  ${ServiceBox}:hover & {
    transform: scale(1.15);
  }
`;

export const ServiceTitle = styled.h4`
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  transition: 0.3s ease;
`;

export const ServiceText = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  transition: 0.3s ease;
`;
