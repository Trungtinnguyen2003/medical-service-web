import React, { useState, useEffect, useRef } from 'react';
import {
  SectionWrapper,
  Title,
  Subtitle,
  CardSliderWrapper,
  CardSlider,
  CardTrack,
  Card,
  CardTitle,
  Description,
  ExploreLink,
  NavButton,
} from './style';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import departmentService from '../../services/departmentService';

const DepartmentsSection = () => {
  const [departments, setDepartments] = useState([]);
  const [index, setIndex] = useState(0);
  const visibleCount = 4;
  const cardWidth = 240;

  const total = departments.length;
  const autoScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await departmentService.getAll();
        setDepartments(res);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách khoa:", err);
      }
    };
    fetchData();
  }, []);

  // Auto scroll setup
  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll; // cleanup
  }, [index, departments]);

  const startAutoScroll = () => {
    stopAutoScroll(); // clear old
    autoScrollRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 2000); // ⏱ mỗi 3 giây
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  return (
    <SectionWrapper id="departments">
      <Subtitle>Chuyên khoa của chúng tôi</Subtitle>
      <Title>Dịch vụ y tế dành cho bạn</Title>

      <CardSliderWrapper
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        <NavButton onClick={prev}><FaArrowLeft /></NavButton>

        <CardSlider>
          <CardTrack style={{ transform: `translateX(-${index * cardWidth}px)` }}>
            {departments.concat(departments).map((dept, i) => (
              <Card key={`${dept.id}-${i}`}>
                <CardTitle>{dept.name}</CardTitle>
                <Description>{dept.slogan}</Description>
                <ExploreLink to={`/departments/${dept.slug}`}>Khám phá</ExploreLink>
              </Card>
            ))}
          </CardTrack>
        </CardSlider>

        <NavButton onClick={next}><FaArrowRight /></NavButton>
      </CardSliderWrapper>
    </SectionWrapper>
  );
};

export default DepartmentsSection;
