import styled from "styled-components";

export const FullImage = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  display: block;
`;

export const BannerWrapper = styled.section`
  width: 100%;
  height: 100vh;
  position: relative; /* thêm dòng này */
  overflow: hidden;
`;

export const OverlayContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  max-width: 90%;
`;

export const Title = styled.h1`
  font-size: 48px;
  color: white;
  font-weight: 700;
  line-height: 1.3;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;
export const LeftOverlayContent = styled.div`
  position: absolute;
  top: 20%;
  left: 8%;
  text-align: left;
  z-index: 2;

  @media (max-width: 768px) {
    left: 5%;
    top: 16%;
  }
`;
export const Description = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: #f3f4f6;
  margin-top: 20px;
  max-width: 550px;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 16px;
    max-width: 90%;
  }
`;
export const Button = styled.button`
  background-color: #a855f7;
  color: white;
  padding: 12px 24px;
  margin-top: 20px;
  border-radius: 24px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #9333ea;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 30px;
  gap: 40px;
  flex-wrap: wrap;
`;
export const DoctorCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  max-width: 250px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  color: #111827;
`;

export const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
`;

export const CardSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-top: 12px;
`;

export const DoctorImage = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

export const BottomQuote = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 24px 32px;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  color: white;
  max-width: 1000px;
  width: 90%;
  text-align: center;
`;

export const QuoteText = styled.p`
  font-size: 18px;
  line-height: 1.7;
  font-style: italic;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
`;
export const WelcomeSection = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  background-color: rgba(235, 229, 240, 0.96);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  z-index: 3;

  @media (max-width: 768px) {
    position: static;
    margin: 20px auto 0;
  }
`;

export const WelcomeLeft = styled.div`
  flex: 0 0 42px;
`;

export const DoctorAvatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 100%;
  object-fit: cover;
`;

export const WelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const WelcomeText = styled.p`
  font-size: 14px;
  color: #374151;
  font-style: italic;
  line-height: 1.5;
`;

export const WelcomeFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const DoctorInfo = styled.div``;

export const DoctorName = styled.h4`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
`;

export const DoctorTitle = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`;
export const SocialIcons = styled.div`
  display: flex;
  gap: 6px;
`;

export const SocialIcon = styled.span`
  background-color: white;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 13px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #7c3aed;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
