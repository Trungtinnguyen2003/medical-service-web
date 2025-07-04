import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GridWrapper,
  Title,
  Grid,
  ServiceBox,
  IconWrapper,
  ServiceTitle,
  Description
} from './style';

import {
  FaHeartbeat,
  FaStethoscope,
  FaVial,
  FaUserMd,
  FaNotesMedical
} from 'react-icons/fa';

const iconSet = [FaHeartbeat, FaStethoscope, FaVial, FaUserMd, FaNotesMedical];

const ServiceListGrid = ({ packages = [] }) => {
  const navigate = useNavigate();

  const handleClick = (slug) => {
    navigate(`/services/${slug}`);
  };

  return (
    <GridWrapper>
      <Title>Các Gói Dịch Vụ</Title>
      <Grid>
        {packages.map((pkg, index) => {
          const RandomIcon = iconSet[index % iconSet.length];
          return (
            <ServiceBox key={pkg.id} onClick={() => handleClick(pkg.slug)}>
              <IconWrapper>
                <RandomIcon size={36} />
              </IconWrapper>
              <ServiceTitle>{pkg.name}</ServiceTitle>
              <Description>{pkg.description}</Description>
            </ServiceBox>
          );
        })}
      </Grid>
    </GridWrapper>
  );
};

export default ServiceListGrid;
