import styled from "styled-components";

export const Section = styled.section`
  background-color: #f8fafc;
  padding: 80px 20px;
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
`;

export const ImageBox = styled.div`
  flex: 1 1 50%;
  img {
    width: 100%;
    border-radius: 16px;
    object-fit: cover;
  }
`;

export const InfoBox = styled.div`
  flex: 1 1 45%;
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
`;

export const Rating = styled.div`
  font-size: 14px;
  background-color: #f1f5f9;
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 500;
  margin-bottom: 12px;
`;

export const Tag = styled.div`
  font-size: 13px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Heading = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
  line-height: 1.4;
`;

export const Subtext = styled.p`
  font-size: 15px;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 15px;
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FeatureItem = styled.div`
  display: flex;
  gap: 12px;
`;

export const Icon = styled.div`
  font-size: 22px;
  margin-top: 3px;
`;

export const Title = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
`;

export const Description = styled.p`
  font-size: 13px;
  color: #475569;
`;
