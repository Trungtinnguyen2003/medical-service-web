import React from "react";
import {
  ServicesWrapper,
  LeftColumn,
  RightColumn,
  SectionTitle,
  Description,
  StatsGrid,
  StatItem,
  StatNumber,
  StatLabel,

  IconCircle,
  ServiceTitle,
  ServiceText,

  ServiceBox,
  CardGrid,
} from "./style";

import { MdHealthAndSafety, MdAccessTime,  } from "react-icons/md";
import { FaUserNurse } from "react-icons/fa6";

const ServicesSection = () => {
  return (
    <ServicesWrapper id="services">
      <LeftColumn>
        <SectionTitle data-aos="fade-right">Vì sao chọn MediHealth?</SectionTitle>
        <Description data-aos="fade-right" data-aos-delay="200">
          MediHealth tự hào là nơi quy tụ đội ngũ bác sĩ giỏi, dịch vụ tận tâm,
          trang thiết bị hiện đại và môi trường thân thiện.
        </Description>

        <StatsGrid data-aos="fade-up" data-aos-delay="400">
          <StatItem>
            <StatNumber>25</StatNumber>
            <StatLabel>Bác sĩ hàng đầu</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>3</StatNumber>
            <StatLabel>Cơ sở phòng khám</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>150+</StatNumber>
            <StatLabel>Sức chứa bệnh nhân</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>1900+</StatNumber>
            <StatLabel>Bệnh nhân đã điều trị</StatLabel>
          </StatItem>
        </StatsGrid>
      </LeftColumn>

      <RightColumn>
  <CardGrid><ServiceBox className="box4" data-aos="fade-left">
      <IconCircle><MdHealthAndSafety size={24} /></IconCircle>
      <div>
        <ServiceTitle>Tư vấn miễn phí</ServiceTitle>
        <ServiceText>Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn sức khỏe miễn phí.</ServiceText>
      </div>
    </ServiceBox>

    <ServiceBox className="box1" data-aos="fade-left">
      <IconCircle><MdHealthAndSafety size={24} /></IconCircle>
      <div>
        <ServiceTitle>Tư vấn miễn phí</ServiceTitle>
        <ServiceText>Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn sức khỏe miễn phí.</ServiceText>
      </div>
    </ServiceBox>

    <ServiceBox className="box2" data-aos="fade-left" data-aos-delay="200">
      <IconCircle><MdAccessTime size={24} /></IconCircle>
      <div>
        <ServiceTitle>Phục vụ 24/7</ServiceTitle>
        <ServiceText>Liên hệ bất cứ lúc nào, chúng tôi luôn túc trực.</ServiceText>
      </div>
    </ServiceBox>

    <ServiceBox className="box3" data-aos="fade-left" data-aos-delay="400">
      <IconCircle><FaUserNurse size={24} /></IconCircle>
      <div>
        <ServiceTitle>Bác sĩ chuyên môn</ServiceTitle>
        <ServiceText>Đội ngũ tận tâm, chuyên nghiệp, giàu kinh nghiệm.</ServiceText>
      </div>
    </ServiceBox>
    
  </CardGrid>
</RightColumn>

    </ServicesWrapper>
  );
};

export default ServicesSection;
