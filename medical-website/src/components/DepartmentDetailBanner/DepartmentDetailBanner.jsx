// src/components/DepartmentDetailBanner/DepartmentDetailBanner.jsx
import React from 'react';
import {
  Wrapper,
  SubHeading,
  MainHeading,
  SloganText,
  DescriptionText
} from './style';

const DepartmentDetailBanner = ({ name, slogan, description }) => {
  return (
    <Wrapper>
      <SubHeading>{name}</SubHeading>
      <MainHeading>Sức khỏe của bạn, chuyên môn của chúng tôi: Cung cấp dịch vụ chăm sóc chất lượng</MainHeading>
      <SloganText>{slogan}</SloganText>
      <DescriptionText>{description}</DescriptionText>
    </Wrapper>
  );
};

export default DepartmentDetailBanner;
