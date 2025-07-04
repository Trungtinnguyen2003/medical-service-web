import React from 'react';
import AboutBanner from "../../components/AboutPage/AboutBanner";
import AboutStorySection from "../../components/AboutPage/AboutStorySection";
import AboutSection from '../../components/AboutSection/AboutSection';
import FAQSection from '../../components/FAQSection/FAQSection';
import DoctorListSection from '../../components/DoctorListSection/DoctorListSection';

const Aboutpage = () => {
  return (
    <div>
      <AboutBanner />
      <AboutStorySection />
      <AboutSection />
      <FAQSection />
      <DoctorListSection />
    </div>
  );
};


export default Aboutpage;
