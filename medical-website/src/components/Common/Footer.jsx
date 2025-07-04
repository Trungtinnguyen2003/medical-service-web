// src/components/Common/Footer.jsx
import React from 'react';
import {
  FooterContainer,
  FooterColumn,
  FooterTitle,
  FooterText,
  FooterLink,
  FooterRow,
  SocialIcons,
  Icon
} from './FooterStyle';
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterRow>
        <FooterColumn>
          <FooterTitle>MedCareee</FooterTitle>
          <FooterText>
            Từ những mẹo chăm sóc sức khỏe đến tư vấn chuyên gia, chúng tôi luôn đồng hành cùng hành trình khỏe mạnh của bạn.
          </FooterText>
          <SocialIcons>
            <Icon><FaFacebookF /></Icon>
            <Icon><FaTwitter /></Icon>
            <Icon><FaGooglePlusG /></Icon>
            <Icon><FaLinkedinIn /></Icon>
            <Icon><FaInstagram /></Icon>
          </SocialIcons>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Liên kết nhanh</FooterTitle>
          <FooterLink href="#">Trang chủ</FooterLink>
          <FooterLink href="#">Đặt lịch</FooterLink>
          <FooterLink href="#">Cẩm nang sức khỏe</FooterLink>
          <FooterLink href="#">Giấy phép</FooterLink>
          <FooterLink href="#">Cập nhật</FooterLink>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Giờ làm việc</FooterTitle>
          <FooterText>Thứ 2 – Thứ 3: 08:00 – 17:00</FooterText>
          <FooterText>Thứ 4 – Thứ 5: 09:00 – 18:00</FooterText>
          <FooterText>Thứ 6 – Thứ 7: 08:00 – 17:00</FooterText>
          <FooterText>Chủ nhật: Chỉ cấp cứu</FooterText>
          <FooterText>Cá nhân: Thứ 2 - 17:00</FooterText>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Liên hệ</FooterTitle>
          <FooterText>82 Đường Sức Khỏe, TP. Y tế</FooterText>
          <FooterText>+84 123 456 789</FooterText>
        </FooterColumn>
      </FooterRow>
    </FooterContainer>
  );
};

export default Footer;
