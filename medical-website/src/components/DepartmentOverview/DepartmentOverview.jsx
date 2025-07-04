// src/components/DepartmentOverview/DepartmentOverview.jsx
import React from 'react';
import { Wrapper, Slogan, Description } from './style';

const DepartmentOverview = ({ slogan, description }) => {
  return (
    <Wrapper>
      <Slogan>{slogan}</Slogan>
      <Description>{description}</Description>
    </Wrapper>
  );
};

export default DepartmentOverview;
