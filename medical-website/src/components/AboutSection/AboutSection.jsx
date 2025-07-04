import React from "react";
import {
  AboutWrapper,
  SectionTitle,
  Grid,
  ValueCard,
  IconWrapper,
  Title,
  Description
} from "./style";

import { FaHandsHelping, FaStar, FaHandshake, FaCog, FaUsers, FaUserMd } from "react-icons/fa";

const values = [
  {
    icon: <FaHandsHelping size={32} />,
    title: "Chăm sóc tận tâm",
    desc: "Mang đến sự đồng cảm và tôn trọng, đảm bảo mỗi bệnh nhân được lắng nghe."
  },
  {
    icon: <FaStar size={32} />,
    title: "Xuất sắc chuyên môn",
    desc: "Luôn hướng đến chất lượng cao nhất trong mọi dịch vụ y tế."
  },
  {
    icon: <FaHandshake size={32} />,
    title: "Trung thực & minh bạch",
    desc: "Minh bạch trong mọi quyết định và hành động."
  },
  {
    icon: <FaCog size={32} />,
    title: "Đổi mới công nghệ",
    desc: "Áp dụng công nghệ hiện đại nâng cao hiệu quả điều trị."
  },
  {
    icon: <FaUsers size={32} />,
    title: "Vì cộng đồng",
    desc: "Phục vụ và nâng cao sức khỏe cộng đồng."
  },
  {
    icon: <FaUserMd size={32} />,
    title: "Lấy bệnh nhân làm trung tâm",
    desc: "Đặt nhu cầu và cảm nhận của bệnh nhân lên hàng đầu."
  }
];

const AboutSection = () => {
  return (
    <AboutWrapper >
      <SectionTitle>Giá trị cốt lõi</SectionTitle>
      <Grid>
        {values.map((item, index) => (
          <ValueCard data-aos="zoom-in" data-aos-delay="100">
          <IconWrapper>{item.icon}</IconWrapper>
          <Title>{item.title}</Title>
          <Description>{item.desc}</Description>
        </ValueCard>
        
        ))}
      </Grid>
    </AboutWrapper>
  );
};

export default AboutSection;
