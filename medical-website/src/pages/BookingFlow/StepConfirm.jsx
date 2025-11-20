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
  BottomBar,
  PrimaryButton,
} from "./style";

import { getBooking, clearBooking } from "./bookingStorage";
import appointmentService from "../../services/appointmentService";

const StepConfirm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      patient_profile_id: booking.profile.id,
      doctor_id: booking.doctor?.id,
    };

    try {
      setLoading(true);
      // await appointmentService.create(payload);
      // clearBooking();
      navigate("/thanh-toan");

    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Layout>
        {/* ========================== SIDEBAR ============================= */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          {booking.department && (
            <SidebarItem>
              <b>Chuyên khoa:</b> {booking.department.name}
            </SidebarItem>
          )}

          {booking.service && (
            <SidebarItem>
              <b>Dịch vụ:</b> {booking.service.title}
            </SidebarItem>
          )}

          {booking.date && (
            <SidebarItem>
              <b>Ngày khám:</b> {booking.date}
            </SidebarItem>
          )}

          {booking.timeSlot && (
            <SidebarItem>
              <b>Giờ khám:</b> {booking.timeSlot.label}
            </SidebarItem>
          )}
        </Sidebar>

        {/* =========================== MAIN CONTENT =========================== */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Xác nhận thông tin</MainHeader>

          {/* 🔹 BOX 1 — THÔNG TIN CƠ SỞ Y TẾ */}
          {/* <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              padding: 20,
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
              Thông tin cơ sở y tế
            </div>

            <div style={{ padding: 15 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{booking.service?.hospital_name || "Phòng khám MedPro"}</p>

              <p style={{ fontSize: 14, marginTop: 6, opacity: 0.9 }}>
                {booking.service?.hospital_address || "Địa chỉ cơ sở y tế của bạn"}
              </p>
            </div>
          </div> */}

          {/* 🔹 BOX 2 — XÁC NHẬN THÔNG TIN KHÁM */}
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
                  <td style={td}>{booking.doctor?.name || "Chưa chọn bác sĩ"}</td>
                  <td style={td}>
  {booking.doctor?.clinicRoom?.name || "Chưa gán"}
  {booking.doctor?.clinicRoom?.code ? ` (${booking.doctor.clinicRoom.code})` : ""}
</td>

                  <td style={td}>
                    {booking.timeSlot?.label} <br /> {booking.date}
                  </td>
                  <td style={td}>
                    {booking.service?.price?.toLocaleString() || 0} đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

         {/* 🔹 BOX 3 — THÔNG TIN BỆNH NHÂN */}
<div
  style={{
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    padding: 0,
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
      lineHeight: "22px",
    }}
  >
    {/* CỘT TRÁI */}
    <div>
      <div><b>Họ và tên:</b> {booking?.profile?.full_name || "—"}</div>
      <div><b>Ngày sinh:</b> {booking?.profile?.date_of_birth || "—"}</div>
      <div><b>Dân tộc:</b> {booking?.profile?.ethnicity || "—"}</div>
      <div><b>Địa chỉ:</b> {booking?.profile?.address || "—"}</div>
    </div>

    {/* CỘT PHẢI */}
    <div>
      <div><b>Giới tính:</b> {booking?.profile?.gender || "—"}</div>
      <div><b>SĐT:</b> {booking?.profile?.phone || "—"}</div>
      <div><b>Nghề nghiệp:</b> {booking?.profile?.job || "—"}</div>
      <div><b>CCCD:</b> {booking?.profile?.id_number || "—"}</div>
    </div>
  </div>

  <div
    style={{
      background: "#fff4f4",
      borderRadius: 8,
      padding: "12px 16px",
      margin: 16,
      color: "#e11d48",
      fontSize: 13,
    }}
  >
    ❗ Trong thời gian quy định, nếu quý khách hủy phiếu khám sẽ được hoàn lại tiền khám và các dịch vụ đặt thêm.
  </div>
</div>




          {/* BUTTONS */}
          <BottomBar>
            <button onClick={() => navigate("/chon-ho-so")}>
              « Quay lại
            </button>

            <PrimaryButton onClick={handleConfirm} disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận"}
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

export default StepConfirm;
