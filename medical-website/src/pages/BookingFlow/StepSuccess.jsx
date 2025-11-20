// src/pages/BookingFlow/StepSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getBooking } from "./bookingStorage";

// ================== STYLE GIỮ NGUYÊN ==================

const PageWrapper = styled.div`
  background: #f3f6fc;
  min-height: 50vh;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 50%;
  max-width: 400px;
  background: #fff;
  padding: 32px 40px;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #0a3d62;
  text-align: center;
  margin-bottom: 24px;
`;

const SuccessBadge = styled.div`
  background: #e7fff2;
  color: #0a8a47;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
  margin: 0 auto 20px auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 15px;
`;

const Label = styled.div`
  color: #6b7280;
`;

const Value = styled.div`
  font-weight: 600;
  color: #111827;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 28px;
  background: #6c2bd9;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: #5822b5;
  }
`;

// ================== TẠO MÃ PHIẾU KHÁM ==================

const generateTicketCode = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `T${year}${random}`;
};

// ================== COMPONENT ==================

const StepSuccess = () => {
  const navigate = useNavigate();

  const booking = getBooking(); // toàn bộ dữ liệu booking flow
  const [ticketCode, setTicketCode] = useState("");

  useEffect(() => {
    setTicketCode(generateTicketCode());
  }, []);

  return (
    <PageWrapper >
      <Card style={{ marginTop: "60px" }}> 
        <SuccessBadge>✔ Đặt lịch thành công</SuccessBadge>

        <Title>Phiếu Khám Bệnh</Title>

        {/* ================== Mã phiếu khám ================== */}
        <Row>
          <Label>Mã phiếu khám:</Label>
          <Value>{ticketCode}</Value>
        </Row>

        <Divider />

        {/* ================== THÔNG TIN BỆNH NHÂN ================== */}
        <Row>
          <Label>Họ tên bệnh nhân:</Label>
          <Value>{booking.profile?.full_name || "—"}</Value>
        </Row>

        <Row>
          <Label>Số điện thoại:</Label>
          <Value>{booking.profile?.phone || "—"}</Value>
        </Row>

        <Row>
          <Label>Năm sinh:</Label>
          <Value>{booking.profile?.date_of_birth?.split("-")[0] || "—"}</Value>
        </Row>

        <Divider />

        {/* ================== THÔNG TIN LỊCH KHÁM ================== */}
        <Row>
          <Label>Dịch vụ:</Label>
          <Value>{booking.service?.title || "—"}</Value>
        </Row>

        <Row>
          <Label>Bác sĩ:</Label>
          <Value>{booking.doctor?.name || "Chưa chọn bác sĩ"}</Value>
        </Row>

        <Row>
          <Label>Chuyên khoa:</Label>
          <Value>{booking.department?.name || "—"}</Value>
        </Row>

        <Row>
          <Label>Ngày khám:</Label>
          <Value>{booking.date || "—"}</Value>
        </Row>

        <Row>
          <Label>Giờ khám:</Label>
          <Value>{booking.timeSlot?.label || "—"}</Value>
        </Row>

        <Divider />

        {/* ================== THANH TOÁN ================== */}
        <Row>
          <Label>Hình thức thanh toán:</Label>
          <Value>Thanh toán tại quầy</Value>
        </Row>

        <Row>
          <Label>Trạng thái:</Label>
          <Value style={{ color: "#0a8a47" }}>Đã xác nhận</Value>
        </Row>

        <PrimaryButton onClick={() => navigate("/")}>
          Về trang chủ
        </PrimaryButton>
      </Card>
    </PageWrapper>
  );
};

export default StepSuccess;
