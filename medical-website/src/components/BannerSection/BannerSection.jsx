import React from "react";
import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  BannerWrapper,
  LeftOverlayContent,
  Title,
  Description,
  WelcomeSection,
  WelcomeLeft,
  DoctorAvatar,
  WelcomeContent,
  WelcomeText,
  WelcomeFooter,
  DoctorInfo,
  DoctorName,
  DoctorTitle,
  SocialIcons,
  SocialIcon,
  ActionButton
} from "./style";

import doctorImage from "../../assets/images/doctor1.jpg";

const BannerSection = () => {
  const navigate = useNavigate();

  return (
    <BannerWrapper>
      <LeftOverlayContent>
        <Title data-aos="fade-right" data-aos-delay="100">
          Dẫn đầu xu hướng <br /> chăm sóc sức khỏe chất lượng
        </Title>

        <Description data-aos="fade-right" data-aos-delay="300">
          Hàng ngàn bệnh nhân đã tin tưởng MediHealth cho nhu cầu y tế của họ. 
          Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.
        </Description>
      </LeftOverlayContent>

      <WelcomeSection data-aos="fade-left" data-aos-delay="500">
        <WelcomeLeft>
          <DoctorAvatar src={doctorImage} alt="Bác sĩ" />
        </WelcomeLeft>

        <WelcomeContent>
          <WelcomeText>
            "Chào mừng bạn đến với MediHealth, nơi chúng tôi cam kết mang đến 
            dịch vụ y tế chất lượng cao nhất..."
          </WelcomeText>

          <WelcomeFooter>
            <DoctorInfo>
              <DoctorName>BS. Nguyễn Thị Hạnh</DoctorName>
              <DoctorTitle>Giám đốc chuyên môn</DoctorTitle>
            </DoctorInfo>

            <SocialIcons>
              <SocialIcon><FaLinkedinIn /></SocialIcon>
              <SocialIcon><FaInstagram /></SocialIcon>
              <SocialIcon><FaTwitter /></SocialIcon>
            </SocialIcons>

            <ActionButton
              onClick={() => navigate("/dat-lich")}
              data-aos-delay="900"
            >
              Đặt lịch ngay →
            </ActionButton>
          </WelcomeFooter>
        </WelcomeContent>
      </WelcomeSection>

    </BannerWrapper>
  );
};

export default BannerSection;
