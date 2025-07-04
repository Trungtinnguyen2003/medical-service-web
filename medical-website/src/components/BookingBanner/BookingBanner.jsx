import React from "react";
import styled from "styled-components";

const BannerWrapper = styled.div`
  background: url("/images/banner-booking.jpg") center/cover no-repeat;
  padding: 80px 20px;
  text-align: center;
  color: white;
  border-radius: 20px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(79, 199, 207, 0.5); /* Overlay màu đậm */
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const BannerTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const BannerSubtitle = styled.p`
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
`;

const BookingBanner = () => {
  return (
    <BannerWrapper>
      <BannerTitle>Đặt Lịch Khám Ngay Hôm Nay</BannerTitle>
      <BannerSubtitle>
        Chăm sóc sức khỏe chủ động – Đặt lịch với bác sĩ chuyên môn, đúng khoa, đúng thời điểm.
      </BannerSubtitle>
    </BannerWrapper>
  );
};

export default BookingBanner;
