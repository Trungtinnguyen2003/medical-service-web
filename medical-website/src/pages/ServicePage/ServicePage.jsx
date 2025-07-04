import React, { useEffect, useState } from 'react';
import ServiceBanner from '../../components/ServiceBanner/ServiceBanner';
import ServiceListGrid from '../../components/ServiceListGrid/ServiceListGrid';
import servicePackageService from '../../services/servicePackageService';
import FAQSection from '../../components/FAQSection/FAQSection';

const ServicePage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await servicePackageService.getAll();
        setPackages(res);
      } catch (error) {
        console.error("Lỗi lấy danh sách gói khám:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <ServiceBanner />
      <ServiceListGrid packages={packages} />
      <FAQSection />
    </>
  );
};

export default ServicePage;
