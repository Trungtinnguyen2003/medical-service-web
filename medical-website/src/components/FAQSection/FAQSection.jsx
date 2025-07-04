import React, { useState } from 'react';
import {
  FAQWrapper,
  Left,
  Right,
  Subtitle,
  Title,
  AccordionItem,
  Question,
  Answer,
  DoctorImage,
  StatBox,
  ArrowIcon
} from './style';
import { FaChevronDown } from 'react-icons/fa';

import doctorImg from '../../assets/images/15.jpg';

const faqData = [
  {
    question: 'Chúng tôi cung cấp dịch vụ gì?',
    answer: 'Chúng tôi cung cấp các dịch vụ như Tim mạch, Nội tiết, Nhi, Thần kinh, Da liễu, Ngoại khoa...'
  },
  {
    question: 'Làm thế nào để đặt lịch khám?',
    answer: 'Bạn có thể đặt lịch trực tuyến, gọi điện hoặc đến trực tiếp cơ sở của chúng tôi.'
  },
  {
    question: 'Giờ làm việc của chúng tôi?',
    answer: 'Từ Thứ 2 đến Thứ 7: 08:00 – 17:00. Chủ nhật chỉ tiếp nhận cấp cứu.'
  },
  {
    question: 'Chúng tôi có chấp nhận bảo hiểm không?',
    answer: 'Có. Chúng tôi hỗ trợ hầu hết các loại bảo hiểm y tế & bảo hiểm tư nhân.'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <FAQWrapper id="faq">
      <Left data-aos="fade-right">
        <Subtitle>FAQ</Subtitle>
        <Title>Giải đáp các thắc mắc phổ biến</Title>
        {faqData.map((item, index) => (
          <AccordionItem key={index}>
            <Question onClick={() => toggle(index)} isOpen={openIndex === index}>
              <span>{item.question}</span>
              <ArrowIcon isOpen={openIndex === index}><FaChevronDown /></ArrowIcon>
            </Question>
            <Answer isOpen={openIndex === index}>{item.answer}</Answer>
          </AccordionItem>
        ))}
      </Left>

      <Right data-aos="fade-left">
        <DoctorImage src={doctorImg} alt="Bác sĩ" />
        <StatBox>
          <div>Tổng lượt chăm sóc</div>
          <strong>1,36,896</strong>
        </StatBox>
      </Right>
    </FAQWrapper>
  );
};

export default FAQSection;
