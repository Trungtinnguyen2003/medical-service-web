// src/components/HomePage/TestimonialSection/TestimonialSection.jsx
import React, { useState } from 'react';
import {
  Section,
  Title,
  Subtitle,
  TestimonialContainer,
  TestimonialCard,
  Avatar,
  Name,
  Location,
  Comment,
  NavButton
} from './style';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import avatar1 from '../../assets/images/1.jpg';
import avatar2 from '../../assets/images/2.jpg';
import avatar3 from '../../assets/images/3.jpg';

const testimonials = [
  {
    name: 'Nguyễn Văn An',
    location: 'Hà Nội',
    comment: 'Tôi vô cùng biết ơn đội ngũ y bác sĩ tại Medicio. Họ chăm sóc tận tình và giúp tôi hồi phục nhanh chóng!',
    image: avatar1
  },
  {
    name: 'Trần Thị Mai',
    location: 'TP. Hồ Chí Minh',
    comment: 'Tôi rất hài lòng với dịch vụ tại đây. Nhân viên thân thiện, bác sĩ chuyên môn cao, tôi cảm thấy rất yên tâm.',
    image: avatar2
  },
  {
    name: 'Lê Minh Khoa',
    location: 'Đà Nẵng',
    comment: 'Cơ sở vật chất hiện đại, quy trình khám chữa bệnh chuyên nghiệp. Tôi sẽ giới thiệu cho người thân và bạn bè.',
    image: avatar3
  }
];

const TestimonialSection = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[startIndex % testimonials.length],
    testimonials[(startIndex + 1) % testimonials.length],
    testimonials[(startIndex + 2) % testimonials.length],
  ];

  return (
    <Section>
      <Subtitle>Phản hồi</Subtitle>
<Title>Bệnh nhân nói gì về chúng tôi</Title>
      <TestimonialContainer>
        <NavButton onClick={handlePrev}><FaArrowLeft /></NavButton>
        {visibleTestimonials.map((item, index) => (
          <TestimonialCard key={index}>
            <Avatar src={item.image} alt={item.name} />
            <Name>{item.name}</Name>
            <Location>{item.location}</Location>
            <Comment>“{item.comment}”</Comment>
          </TestimonialCard>
        ))}
        <NavButton onClick={handleNext}><FaArrowRight /></NavButton>
      </TestimonialContainer>
    </Section>
  );
};

export default TestimonialSection;
