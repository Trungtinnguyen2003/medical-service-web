import React, { useState } from "react";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import {
  Section,
  StatsGrid,
  StatCard,
  StatIcon,
  StatNumber,
  StatLabel,
  ArrowImage,
  StoryWrapper,
  StoryText,
  TimelineWrapper,
  TimelineCard,
  TimelineToggle,
  TimelineContent,
  Year,
  TimelineTitle,
  TimelineDesc,
  AllDepartmentsButton
} from "./AboutStoryStyle";

import { FaUsers, FaTrophy, FaUserMd, FaStar } from "react-icons/fa";
import arrowImg from "../../assets/images/23.jpg";

const stats = [
  { icon: <FaUsers />, number: 120000, suffix: "K+", label: "Bệnh nhân hài lòng" },
  { icon: <FaTrophy />, number: 130, suffix: "+", label: "Giải thưởng" },
  { icon: <FaUserMd />, number: 147, suffix: "+", label: "Bác sĩ chuyên khoa" },
  { icon: <FaStar />, number: 4.8, suffix: "", label: "Đánh giá trung bình" }
];

const timeline = [
    {
      year: "2015",
      title: "Thành lập",
      desc: "Năm 2015 đánh dấu bước khởi đầu của chúng tôi với sứ mệnh mang đến dịch vụ y tế chất lượng cao và lấy bệnh nhân làm trung tâm. Với đội ngũ sáng lập đầy nhiệt huyết, chúng tôi đã xây dựng nền móng đầu tiên tại một cơ sở nhỏ với mong muốn thay đổi cách chăm sóc sức khỏe truyền thống."
    },
    {
      year: "2017",
      title: "Cột mốc đầu tiên",
      desc: "Sau hai năm hoạt động, chúng tôi đã mở rộng hệ thống phòng khám hiện đại, đầu tư vào công nghệ xét nghiệm và chẩn đoán hình ảnh. Chúng tôi triển khai hệ thống quản lý bệnh án điện tử, giúp nâng cao trải nghiệm khám chữa bệnh và tăng cường hiệu quả vận hành nội bộ."
    },
    {
      year: "2018",
      title: "Phát triển dịch vụ",
      desc: "Chúng tôi mở rộng thêm nhiều chuyên khoa mới như Nội tiết, Phục hồi chức năng, và Sức khỏe tâm thần. Đồng thời hợp tác cùng các bệnh viện tuyến trung ương nhằm nâng cao chất lượng chẩn đoán và điều trị, đặc biệt ở các ca bệnh phức tạp cần hội chẩn."
    },
    {
      year: "2023",
      title: "Tăng khả năng tiếp cận",
      desc: "Trước nhu cầu chăm sóc y tế ngày càng cao, chúng tôi chính thức triển khai dịch vụ tư vấn trực tuyến và đặt lịch hẹn online. Đồng thời mở thêm 4 chi nhánh mới tại các quận trọng điểm, giúp bệnh nhân dễ dàng tiếp cận dịch vụ y tế chất lượng ngay gần nơi sinh sống."
    },
    {
      year: "Hiện tại",
      title: "Tiếp tục sứ mệnh",
      desc: "Chúng tôi đang không ngừng đổi mới trong phương pháp điều trị, đưa AI và thiết bị y tế thông minh vào phục vụ bệnh nhân. Cam kết đồng hành cùng cộng đồng, đặt y đức và chuyên môn làm kim chỉ nam để hướng đến tương lai chăm sóc sức khỏe toàn diện và nhân văn hơn."
    }
  ];
  

const AboutStorySection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <Section>
      <StatsGrid>
        {stats.map((stat, i) => (
          <StatCard key={i}>
            <StatIcon>{stat.icon}</StatIcon>
            <StatNumber>
              <CountUp end={stat.number} duration={3} separator="," />
              {stat.suffix}
            </StatNumber>
            <StatLabel>{stat.label}</StatLabel>
            {i < stats.length - 3 && <ArrowImage src={arrowImg} alt="arrow" />}
            {i < stats.length - 2 && <ArrowImage src={arrowImg} alt="arrow" />}
            {i < stats.length - 1 && <ArrowImage src={arrowImg} alt="arrow" />}
          </StatCard>
        ))}
      </StatsGrid>

      <StoryWrapper>
        <StoryText>
          <h5>Our Story</h5>
          <h2>
            Hành trình của chúng tôi: <br /> Từ Tầm nhìn đến Sứ mệnh
          </h2>
          <p>
            Chúng tôi là đội ngũ chuyên gia y tế tận tâm, hướng đến chăm sóc bệnh nhân toàn diện
            và đặt con người làm trung tâm trong mọi dịch vụ.
          </p>
          <AllDepartmentsButton as={Link} to="/departments">
  Khám phá tất cả chuyên khoa →
</AllDepartmentsButton>

        </StoryText>

        <TimelineWrapper>
          {timeline.map((item, index) => (
            <TimelineCard key={index} isActive={activeIndex === index}>
              <TimelineToggle onClick={() => toggleIndex(index)}>
                {item.year}
              </TimelineToggle>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TimelineContent>
                      <TimelineTitle>{item.title}</TimelineTitle>
                      <TimelineDesc>{item.desc}</TimelineDesc>
                    </TimelineContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </TimelineCard>
          ))}
        </TimelineWrapper>
      </StoryWrapper>
    </Section>
  );
};

export default AboutStorySection;
