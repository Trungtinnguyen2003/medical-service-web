import styled from "styled-components";

export const Section = styled.section`
  padding: 100px 20px;
  background-color: #f8fafc;
`;

export const StatsGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 32px;
  text-align: center;
  margin-bottom: 60px;
  position: relative;
`;

export const StatCard = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;
`;

export const StatIcon = styled.div`
  font-size: 32px;
  color: #1d4ed8;
  margin-bottom: 10px;
`;

export const StatNumber = styled.h3`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
`;

export const StatLabel = styled.p`
  font-size: 16px;
  color: #475569;
`;

export const ArrowImage = styled.img`
  position: absolute;
  top: 36px;
  right: -30px;
  width: 32px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  align-items: flex-start;
`;

export const StoryText = styled.div`
  flex: 1;
  min-width: 300px;

  h5 {
    font-size: 18px;
    color: #1d4ed8;
    font-weight: 600;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 32px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  p {
    font-size: 17px;
    color: #475569;
    line-height: 1.8;
    margin-bottom: 28px;
  }
`;

export const AllDepartmentsButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid #1d4ed8;
  background-color: white;
  color: #1d4ed8;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #1d4ed8;
    color: white;
  }
`;

export const TimelineWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TimelineCard = styled.div`
  background-color: ${({ isActive }) => (isActive ? "#eff6ff" : "#ffffff")};
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  box-shadow: ${({ isActive }) =>
    isActive
      ? "0 6px 24px rgba(0, 0, 0, 0.1)"
      : "0 1px 4px rgba(0, 0, 0, 0.04)"};
  border-left: 4px solid #1d4ed8;
  transition: all 0.3s ease;
`;

export const TimelineToggle = styled.div`
  font-weight: 700;
  color: #1d4ed8;
  cursor: pointer;
  padding: 16px 20px;
  font-size: 16px;
  background: inherit;
`;

export const TimelineContent = styled.div`
  padding: 0 20px 20px;
`;

export const TimelineTitle = styled.h4`
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
`;

export const TimelineDesc = styled.p`
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
`;
