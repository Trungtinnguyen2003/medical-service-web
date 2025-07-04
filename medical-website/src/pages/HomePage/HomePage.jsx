import React, { useRef } from 'react';
import BannerSection from '../../components/BannerSection/BannerSection';
import AboutSection from '../../components/AboutSection/AboutSection';
import StatisticBanner from '../../components/StatisticBanner/StatisticBanner';
import ServicesSection from '../../components/ServicesSection/ServicesSection';
import DoctorsSection from '../../components/DoctorsSection/DoctorsSection';
import DepartmentsSection from '../../components/DepartmentsSection/DepartmentsSection';
import MissionVisionSection from '../../components/MissionVisionSection/MissionVisionSection';
import DoctorListSection from '../../components/DoctorListSection/DoctorListSection';
import TestimonialSection from '../../components/TestimonialSection/TestimonialSection';
import FAQSection from '../../components/FAQSection/FAQSection';
import BookingTabs from '../../components/Booking/BookingTabs';
import ServicePackageSlider from '../../components/ServicePackageSlider/ServicePackageSlider';


const HomePage = () => {
  const bookingRef = useRef(null); // ✅ tạo ref

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <BannerSection onBookingClick={scrollToBooking} /> {/* ✅ truyền xuống */}
      <StatisticBanner />
      {/* <AboutSection /> */}
      <DepartmentsSection />
      <ServicePackageSlider />
      <MissionVisionSection />
      <ServicesSection />
      <div ref={bookingRef}>
        <BookingTabs />
      </div>
      <FAQSection />
      <DoctorListSection />
      <TestimonialSection />
    </>
  );
};

export default HomePage;
