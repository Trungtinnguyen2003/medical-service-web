// src/pages/BookingFlow/StepConfirm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageWrapper,
  Layout,
  Sidebar,
  SidebarTitle,
  SidebarItem,
  Main,
  MainHeader,
  StepTitle,
  StepDescription,
  BottomBar,
  PrimaryButton,
} from "./style";
import { getBooking, clearBooking } from "./bookingStorage";
import appointmentService from "../../services/appointmentService";

const StepConfirm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const booking = getBooking();

  const handleConfirm = async () => {
    if (!booking.service || !booking.date || !booking.timeSlot || !booking.profile) {
      alert("Thiếu thông tin đặt khám, vui lòng thực hiện lại.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để đặt lịch");
      navigate("/login");
      return;
    }

    const payload = {
      service_id: booking.service.id,
      department_id: booking.department?.id || null,
      appointment_date: booking.date,
      slot_id: booking.timeSlot.id,
      patient_profile_id: booking.profile.id, // sau này bạn xử lý ở BE
      doctor_id: null, // để hệ thống tự gán
      // bạn có thể thêm symptoms, notes,... ở đây
    };

    try {
      setLoading(true);
      await appointmentService.create(payload);
      clearBooking();
      navigate("/dat-lich-thanh-cong");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Layout>
        <Sidebar>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>
          {booking.department && (
            <SidebarItem>
              <b>Chuyên khoa:</b> {booking.department.name}
            </SidebarItem>
          )}
          {booking.service && (
            <SidebarItem>
              <b>Dịch vụ:</b> {booking.service.title || booking.service.name}
            </SidebarItem>
          )}
          {booking.date && (
            <SidebarItem>
              <b>Ngày khám:</b> {booking.date}</SidebarItem>
          )}
          {booking.timeSlot && (
            <SidebarItem>
              <b>Giờ khám:</b> {booking.timeSlot.label}
            </SidebarItem>
          )}
        </Sidebar>

        <Main>
          <MainHeader>Xác nhận thông tin</MainHeader>
          <StepTitle>Kiểm tra lại thông tin trước khi đặt</StepTitle>
          <StepDescription>
            Vui lòng kiểm tra kỹ thông tin. Sau khi xác nhận, hệ thống sẽ gửi
            phiếu khám tới bạn.
          </StepDescription>

          <div style={{ fontSize: 14, color: "#111827" }}>
            <h4>Thông tin khám</h4>
            <p>
              <b>Cơ sở:</b> Phòng khám / Bệnh viện của bạn
            </p>
            {booking.department && (
              <p>
                <b>Chuyên khoa:</b> {booking.department.name}
              </p>
            )}
            {booking.service && (
              <p>
                <b>Dịch vụ:</b> {booking.service.title || booking.service.name}
              </p>
            )}
            {booking.date && (
              <p>
                <b>Ngày khám:</b> {booking.date}
              </p>
            )}
            {booking.timeSlot && (
              <p>
                <b>Giờ khám:</b> {booking.timeSlot.label}
              </p>
            )}

            <hr style={{ margin: "12px 0" }} />

            <h4>Thông tin bệnh nhân</h4>
            {booking.profile ? (
              <>
                <p>
                  <b>Họ và tên:</b> {booking.profile.full_name}
                </p>
                <p>
                  <b>Ngày sinh:</b> {booking.profile.date_of_birth}
                </p>
                <p>
                  <b>Giới tính:</b> {booking.profile.gender}
                </p>
                <p>
                  <b>SĐT:</b> {booking.profile.phone}
                </p>
                <p>
                  <b>Địa chỉ:</b> {booking.profile.address}
                </p>
              </>
            ) : (
              <p>Chưa chọn hồ sơ bệnh nhân.</p>
            )}

            <hr style={{ margin: "12px 0" }} />

            {booking.service?.price && (
              <p>
                <b>Tiền khám:</b>{" "}
                {booking.service.price.toLocaleString()} đ
              </p>
            )}
          </div>

          <BottomBar>
            <button onClick={() => navigate("/chon-ho-so")}>
              &laquo; Quay lại
            </button>
            <PrimaryButton onClick={handleConfirm} disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận đặt khám"}
            </PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepConfirm;
