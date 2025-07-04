// src/components/Common/FooterStyle.js
import styled from "styled-components";
import bgFooter from "../../assets/images/5.jpg"; // ảnh bạn vừa gửi, cần đặt đúng chỗ

export const FooterContainer = styled.footer`
  background-image: url(${bgFooter});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
  color: black;
  padding: 80px 40px 60px;
  position: relative;
  z-index: 1;
  font-family: "Segoe UI", sans-serif;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
  }
`;

export const FooterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

export const FooterText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 10px;
`;

export const FooterLink = styled.a`
  font-size: 14px;
  color: rgb(0, 0, 0);
  text-decoration: none;
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #4fc3f7;
  }
`;

export const SocialIcons = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 12px;
`;

export const Icon = styled.div`
  width: 36px;
  height: 36px;
  background-color: #0d5aa7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(248, 249, 249);
    transform: scale(1.1);
  }
`;
