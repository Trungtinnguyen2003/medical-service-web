import styled from "styled-components";

export const BannerWrapper = styled.section`
  background-color: rgb(111, 113, 189); /* màu xanh đậm như mẫu */
  padding: 30px 20px;
  color: white;
`;

export const ContentWrapper = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
`;

export const Quote = styled.h2`
  font-size: 50px;
  font-weight: 800;
  flex: 1 1 300px;
  color: #ffffff;
`;

export const StatsContainer = styled.div`
  display: flex;
  gap: 60px;
  flex: 1 1 500px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatNumber = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #60a5fa; /* xanh nhạt nổi bật */
`;

export const StatLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
  color: rgb(255, 255, 255);
`;
