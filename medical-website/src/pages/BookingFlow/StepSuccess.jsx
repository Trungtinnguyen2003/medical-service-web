// src/pages/BookingFlow/StepSuccess.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PageWrapper,
  Layout,
  Main,
  MainHeader,
  StepTitle,
  StepDescription,
  PrimaryButton,
} from "./style";

const StepSuccess = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Layout>
        <Main style={{ margin: "0 auto" }}>
          <MainHeader>Đặt lịch thành công</MainHeader>
          <StepTitle>Cảm ơn bạn đã đặt lịch khám</StepTitle>
          <StepDescription>
            Thông tin lịch khám đã được ghi nhận. Vui lòng kiểm tra SMS / Email
            để xem chi tiết phiếu khám.
          </StepDescription>

          <PrimaryButton onClick={() => navigate("/")}>
            Về trang chủ
          </PrimaryButton>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepSuccess;
