import styled from "styled-components";

export const GridWrapper = styled.div`
  padding: 80px 20px;
  background: #f9fbfc;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  margin-bottom: 50px;
  color: #1b1e3d;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ServiceBox = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 30px 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }
`;

export const IconWrapper = styled.div`
  color: rgb(50, 123, 88);
  background: rgb(148, 188, 173);
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ServiceTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 12px;
  color: rgb(18, 94, 104);
`;

export const Description = styled.p`
  font-size: 15px;
  color: #444;
  line-height: 1.6;
`;
