import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ServiceDetailBanner from '../../components/ServiceDetailBanner/ServiceDetailBanner';
import DoctorSection from '../../components/DoctorsSection/DoctorsSection';
import DoctorListSection from '../../components/DoctorListSection/DoctorListSection';
import servicePackageService from '../../services/servicePackageService';
import ServicePackageTable from '../../components/ServicePackageTable/ServicePackageTable';
import DoctorByServicePackage from "../../components/Doctor/DoctorByServicePackage";
import BookingTabs from '../../components/Booking/BookingTabs';

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 16px;
  color: #1a237e;
`;

const Text = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: #444;
  margin-bottom: 16px;
`;

const columnMap = {
  f_u60: 'Nữ độc thân dưới 60 tuổi',
  f_60: 'Nữ độc thân trên 60 tuổi',
  fm_u60: 'Nữ có gia đình dưới 60 tuổi',
  fm_60: 'Nữ có gia đình trên 60 tuổi',
  m_u60: 'Nam dưới 60 tuổi',
  m_60: 'Nam trên 60 tuổi',
};

const ServiceDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await servicePackageService.getBySlug(id);
        setPkg(res);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết gói khám:", err);
      }
    };
    fetch();
  }, [id]);

  if (!pkg) return <Wrapper><h3>Đang tải dữ liệu...</h3></Wrapper>;

  return (
    <>
      <ServiceDetailBanner serviceName={pkg.name} />

      <Wrapper>
        <Section>
          
        </Section>

        <Section>
          <Title>1. Mô tả</Title>
          <img
            src={`http://localhost:5000${pkg.image_url}`}
            alt={pkg.name}
            style={{ width: '100%', borderRadius: 8, marginBottom: 20 }}
          />
          <Text>{pkg.description}</Text>
        </Section>

        <Section>
          <Title>2. Chi tiết</Title>
          <Text>{pkg.detail}</Text>
        </Section>



        

        {pkg.services?.length > 0 && (
          <Section>
            <Title>3. Các dịch vụ bao gồm</Title>
            <ul>
            <ServicePackageTable services={pkg.services} />
            </ul>
          </Section>
          
        )}

        

<Section>
          <Title>4. Giá chi tiết</Title>
          <ul>
  {Object.entries(pkg.price_json).map(([key, value]) => (
    <li key={key}>{columnMap[key] || key}: <strong>{value.toLocaleString()}đ</strong></li>
  ))}
</ul>
        </Section>
                <Section>
          <Title>5. Giá trị cộng thêm</Title>
          <Text>{pkg.benefits}</Text>
        </Section>

        <Section>
          <Title>6. Lưu ý trước khi khám</Title>
          <Text>{pkg.precautions}</Text>
        </Section>

        {pkg.services?.length > 0 && (
  <DoctorByServicePackage packageId={pkg.id} />

)}

      </Wrapper>


      <BookingTabs />
    </>
  );
};

export default ServiceDetail;
