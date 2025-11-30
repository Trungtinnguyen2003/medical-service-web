// src/pages/BookingFlowDepartment/StepDepartmentConfirm.jsx

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
  BottomBar,
  PrimaryButton,
} from "../BookingFlow/style";

import { getDeptBooking, saveDeptBooking } from "./deptBookingStorage";
import appointmentService from "../../services/appointmentService";

const StepDepartmentConfirm = () => {
  const navigate = useNavigate();
  const booking = getDeptBooking();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const payload = {
        profile_id: booking.profile?.id,
        department_id: booking.department_id,
        service_id: booking.service?.id,
        doctor_id: booking.assigned_doctor?.id,
        appointment_date: booking.appointment_date,
        slot_id: booking.timeSlot?.id,
        amount: booking.service?.price || 0,
      };

      // ⭐ KHÔNG tạo lịch ngay → chuyển sang bước thanh toán giống flow bác sĩ
      saveDeptBooking({
        ...booking,
        payload,
      });

      navigate("/booking-department/payment");
    } catch (err) {
      alert("Lỗi khi xác nhận thông tin!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Layout>
        {/* ===== SIDEBAR ===== */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          <SidebarItem><b>Chuyên khoa:</b> {booking.department?.name}</SidebarItem>
          <SidebarItem><b>Dịch vụ:</b> {booking.service?.title}</SidebarItem>
          <SidebarItem><b>Bác sĩ:</b> {booking.assigned_doctor?.name}</SidebarItem>
          <SidebarItem><b>Ngày khám:</b> {booking.appointment_date}</SidebarItem>

          <SidebarItem>
            <b>Phòng khám:</b>{" "}
            {booking.assigned_doctor?.clinicRoom?.name
              ? `${booking.assigned_doctor.clinicRoom.name} (${booking.assigned_doctor.clinicRoom.code})`
              : "Chưa gán phòng"}
          </SidebarItem>

          <SidebarItem><b>Giờ khám:</b> {booking.timeSlot?.label}</SidebarItem>
          <SidebarItem><b>Hồ sơ:</b> {booking.profile?.full_name}</SidebarItem>
        </Sidebar>

        {/* ===== MAIN ===== */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Xác nhận thông tin</MainHeader>

          {/* BOX XÁC NHẬN */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              padding: 0,
              marginBottom: 25,
            }}
          >
            <div
              style={{
                background: "#00b3ff",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px 8px 0 0",
                fontWeight: "bold",
              }}
            >
              Xác nhận thông tin khám
            </div>

            <table style={{ width: "100%", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f5faff" }}>
                  <th style={th}>#</th>
                  <th style={th}>Chuyên khoa</th>
                  <th style={th}>Dịch vụ</th>
                  <th style={th}>Bác sĩ</th>
                  <th style={th}>Phòng khám</th>
                  <th style={th}>Thời gian khám</th>
                  <th style={th}>Tiền khám</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={td}>1</td>
                  <td style={td}>{booking.department?.name}</td>
                  <td style={td}>{booking.service?.title}</td>
                  <td style={td}>{booking.assigned_doctor?.name}</td>

                  <td style={td}>
                    {booking.assigned_doctor?.clinicRoom?.name || "Chưa gán"}
                    {booking.assigned_doctor?.clinicRoom?.code
                      ? ` (${booking.assigned_doctor.clinicRoom.code})`
                      : ""}
                  </td>

                  <td style={td}>
                    {booking.timeSlot?.label} <br />
                    {booking.appointment_date}
                  </td>

                  <td style={td}>
                    {booking.service?.price?.toLocaleString("vi-VN") || 0} đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BOX THÔNG TIN BỆNH NHÂN */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                background: "#00b3ff",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px 8px 0 0",
                fontWeight: "bold",
              }}
            >
              Thông tin bệnh nhân
            </div>

            <div
              style={{
                padding: 20,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                fontSize: 15,
              }}
            >
              <div>
                <div><b>Họ và tên:</b> {booking.profile?.full_name}</div>
                <div><b>Ngày sinh:</b> {booking.profile?.date_of_birth}</div>
                <div><b>Dân tộc:</b> {booking.profile?.ethnicity || "—"}</div>
                <div><b>Địa chỉ:</b> {booking.profile?.address}</div>
              </div>

              <div>
                <div><b>Giới tính:</b> {booking.profile?.gender}</div>
                <div><b>SĐT:</b> {booking.profile?.phone}</div>
                <div><b>Nghề nghiệp:</b> {booking.profile?.job}</div>
                <div><b>CCCD:</b> {booking.profile?.id_number}</div>
              </div>
            </div>

            <div
              style={{
                background: "#fff4f4",
                margin: 16,
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 13,
                color: "#e11d48",
              }}
            >
              ❗ Nếu hủy phiếu khám đúng thời hạn, quý khách sẽ được hoàn tiền.
            </div>
          </div>

          {/* ===== BUTTON ===== */}
          <BottomBar>
            <button onClick={() => navigate("/booking-department?step=profile")}>
              « Quay lại
            </button>

            <PrimaryButton disabled={loading} onClick={handleConfirm}>
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

const th = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #f0f0f0",
};

export default StepDepartmentConfirm;
