import React, { useEffect } from 'react';
import {
  Section,
  ContentWrapper,
  ImageBox,
  InfoBox,
  Rating,
  Tag,
  Heading,
  Subtext,
  FeatureList,
  FeatureItem,
  Title,
  Description
} from './style';
import AOS from 'aos';
import 'aos/dist/aos.css';

import doctorImg from '../../assets/images/9.jpg';

const MissionVisionSection = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Section>
      <ContentWrapper>
        <ImageBox data-aos="fade-right">
          <img src={doctorImg} alt="Doctor consulting patient" />
        </ImageBox>

        <InfoBox data-aos="fade-left">
        <Rating>Được đánh giá 4.9/5 bởi 5.000+ khách hàng</Rating>
<Tag>25+ năm đồng hành cùng sức khỏe Việt</Tag>
<Heading>Chúng tôi đồng hành cùng bạn trên hành trình sống khỏe</Heading>
<Subtext>
  MedCare mang đến trải nghiệm y tế toàn diện: tận tâm, minh bạch và chuyên nghiệp. Chúng tôi luôn đặt sức khỏe và sự an tâm của bạn làm trọng tâm trong mọi hoạt động.
</Subtext>

<FeatureList>
  <FeatureItem>
    <div>
      <Title>Sứ mệnh</Title>
      <Description>
        Cung cấp dịch vụ y tế nhân ái, chất lượng và hiện đại, lấy bệnh nhân làm trung tâm.
      </Description>
    </div>
  </FeatureItem>
  <FeatureItem>
    <div>
      <Title>Tầm nhìn</Title>
      <Description>
        Dẫn đầu trong đổi mới y tế, kết nối công nghệ và con người vì một cộng đồng khỏe mạnh.
      </Description>
    </div>
  </FeatureItem>
</FeatureList>

        </InfoBox>
      </ContentWrapper>
    </Section>
  );
};

export default MissionVisionSection;
