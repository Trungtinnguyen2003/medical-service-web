import React from "react";
import styled from "styled-components";

const BannerWrapper = styled.section`
  position: relative;
  height: 320px;
 background: linear-gradient(135deg,rgb(255, 255, 255),rgb(157, 122, 218)); /* tím nhạt gradient */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #003c5a;
`;

const Content = styled.div`
  max-width: 800px;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 16px;
  color: #004d40;
  letter-spacing: -0.5px;
`;

const Description = styled.p`
  font-size: 17px;
  color: #37474f;
  line-height: 1.6;
`;

const CategoryBanner = ({
  title = "Tin tức",
  description = "Khám phá những chia sẻ, kiến thức sức khỏe mới nhất từ chuyên gia của chúng tôi.",
}) => {
  return (
    <BannerWrapper>
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
    </BannerWrapper>
  );
};

export default CategoryBanner;
