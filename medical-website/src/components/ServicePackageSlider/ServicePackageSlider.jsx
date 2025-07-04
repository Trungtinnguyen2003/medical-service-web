// src/components/ServicePackageList/ServicePackageList.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  SectionWrapper,
  Subtitle,
  Title,
  CardSliderWrapper,
  CardSlider,
  CardTrack,
  Card,
  IconWrapper,
  CardTitle,
  Description,
  ExploreLink,
  NavButton,
} from './style';
import { FaArrowLeft, FaArrowRight, FaHeartbeat, FaStethoscope, FaVial, FaUserMd, FaNotesMedical } from 'react-icons/fa';
import servicePackageService from '../../services/servicePackageService';
import { useNavigate } from 'react-router-dom';

const icons = [FaHeartbeat, FaStethoscope, FaVial, FaUserMd, FaNotesMedical];

const ServicePackageList = () => {
  const [packages, setPackages] = useState([]);
  const [index, setIndex] = useState(0);
  const visibleCount = 4;
  const cardWidth = 240;
  const total = packages.length;
  const autoScrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await servicePackageService.getAll();
      setPackages(res);
    };
    fetchData();
  }, []);

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [index, packages]);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 2500);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  return (
    <SectionWrapper>
      <Subtitle>Gói dịch vụ chuyên sâu</Subtitle>
      <Title>Gói khám sức khỏe phù hợp mọi nhu cầu</Title>

      <CardSliderWrapper onMouseEnter={stopAutoScroll} onMouseLeave={startAutoScroll}>
        <NavButton onClick={prev}><FaArrowLeft /></NavButton>

        <CardSlider>
          <CardTrack style={{ transform: `translateX(-${index * cardWidth}px)` }}>
            {packages.concat(packages).map((pkg, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Card key={`${pkg.id}-${i}`} onClick={() => navigate(`/services/${pkg.slug}`)}>
                  <IconWrapper><Icon /></IconWrapper>
                  <CardTitle>{pkg.name}</CardTitle>
                  <Description>{pkg.description}</Description>
                  <ExploreLink to={`/packages/${pkg.slug}`}>Xem chi tiết</ExploreLink>
                </Card>
              );
            })}
          </CardTrack>
        </CardSlider>

        <NavButton onClick={next}><FaArrowRight /></NavButton>
      </CardSliderWrapper>
    </SectionWrapper>
  );
};

export default ServicePackageList;
