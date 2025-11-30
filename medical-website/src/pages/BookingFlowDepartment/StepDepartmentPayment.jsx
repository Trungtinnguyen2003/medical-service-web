// src/pages/BookingFlowDepartment/StepDepartmentPayment.jsx

import React, { useState, useEffect } from "react";
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
import { API_BASE_URL } from "../../config";

const StepDepartmentPayment = () => {
  const navigate = useNavigate();
  const booking = getDeptBooking();

  const [method, setMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [clinicRoom, setClinicRoom] = useState(null);

  const amount = Number(booking?.service?.price) || 0;

  /* ======================================================
      ⭐ LOAD PHÒNG KHÁM — TỰ ĐỘNG LẤY TỪ 3 KIỂU DỮ LIỆU
     ====================================================== */
  useEffect(() => {
    const doctor = booking?.assigned_doctor;
    if (!doctor) return;

    // TH 1: Có clinicRoom đầy đủ từ API
    if (doctor.clinicRoom?.name) {
      setClinicRoom(doctor.clinicRoom);
      return;
    }

    // TH 2: Có Room từ API cũ
    if (doctor.Room?.name) {
      setClinicRoom(doctor.Room);
      return;
    }

    // TH 3: Chỉ có clinic_room_id → gọi API để lấy phòng
    const roomId =
      doctor.clinic_room_id ||
      doctor.clinic_room ||
      doctor.Room?.id;

    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/clinic-rooms/${roomId}`);
        const data = await res.json();
        if (data?.id) setClinicRoom(data);
      } catch (err) {
        console.log("Không tải được phòng khám:", err);
      }
    };

    fetchRoom();
  }, []);

  /* ======================================================
                ⭐ XỬ LÝ TẠO GIAO DỊCH THANH TOÁN
     ====================================================== */
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập.");
        return navigate("/login");
      }

      const payload = {
        service_id: booking.service?.id,
        doctor_id: booking.assigned_doctor?.id,
        appointment_date: booking.appointment_date,
        slot_id: booking.timeSlot?.id,
        department_id: booking.department_id,
        patient_profile_id: booking.profile?.id,

        clinic_room_id: clinicRoom?.id,

        amount,
        flow_type: "department",   // ⭐ THÊM VÀO ĐÂY ⭐
      };

      let endpoint = "";
      if (method === "vnpay")
        endpoint = `${API_BASE_URL}/api/payment/vnpay/create`;
      else if (method === "momo")
        endpoint = `${API_BASE_URL}/api/payment/momo/create`;
      else if (method === "paypal")
        endpoint = `${API_BASE_URL}/api/payment/paypal/create`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Không tạo được giao dịch");
      }

      saveDeptBooking({
        ...booking,
        payment_transaction_id: data.transactionId,
        payment_method: method,
      });

      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
                            ⭐ RENDER UI
     ====================================================== */
  return (
    <PageWrapper>
      <Layout>
        {/* ===== SIDEBAR BỆNH NHÂN ===== */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin bệnh nhân</SidebarTitle>
          <SidebarItem><b>Họ tên:</b> {booking.profile?.full_name}</SidebarItem>
          <SidebarItem><b>SĐT:</b> {booking.profile?.phone}</SidebarItem>
          <SidebarItem><b>Địa chỉ:</b> {booking.profile?.address}</SidebarItem>
        </Sidebar>

        {/* ===== MAIN ===== */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Chọn phương thức thanh toán</MainHeader>

          {/* VNPay */}
          <label
            onClick={() => setMethod("vnpay")}
            style={{
              border:
                method === "vnpay" ? "2px solid #0284c7" : "1px solid #d1d5db",
              display: "flex",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            <input
              type="radio"
              checked={method === "vnpay"}
              onChange={() => setMethod("vnpay")}
            />
            <div>
              <b>VNPay</b>
              <br />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Thanh toán ATM / Visa / QR VNPay
              </span>
            </div>
          </label>

          {/* MoMo */}
          <label
            onClick={() => setMethod("momo")}
            style={{
              border:
                method === "momo" ? "2px solid #db2777" : "1px solid #d1d5db",
              display: "flex",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            <input
              type="radio"
              checked={method === "momo"}
              onChange={() => setMethod("momo")}
            />
            <div>
              <b>Ví MoMo</b>
              <br />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Thanh toán ví điện tử, liên kết ngân hàng
              </span>
            </div>
          </label>

          {/* PayPal */}
          <label
            onClick={() => setMethod("paypal")}
            style={{
              border:
                method === "paypal" ? "2px solid #0f766e" : "1px solid #d1d5db",
              display: "flex",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            <input
              type="radio"
              checked={method === "paypal"}
              onChange={() => setMethod("paypal")}
            />
            <div>
              <b>PayPal</b>
              <br />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Thanh toán bằng PayPal
              </span>
            </div>
          </label>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: 10,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              {error}
            </div>
          )}

          <BottomBar>
            <button onClick={() => navigate("/booking-department?step=confirm")}>
              ← Quay lại
            </button>

            <PrimaryButton disabled={loading} onClick={handlePayment}>
              {loading ? "Đang xử lý..." : "Thanh toán ngay"}
            </PrimaryButton>
          </BottomBar>
        </Main>

        {/* ===== SIDEBAR THÔNG TIN THANH TOÁN ===== */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin thanh toán</SidebarTitle>

          <SidebarItem><b>Chuyên khoa:</b> {booking.department?.name}</SidebarItem>

          <SidebarItem><b>Bác sĩ:</b> {booking.assigned_doctor?.name}</SidebarItem>

          <SidebarItem>
            <b>Phòng khám:</b>{" "}
            {clinicRoom
              ? `${clinicRoom.name}${clinicRoom.code ? ` (${clinicRoom.code})` : ""}`
              : "Đang tải..."}
          </SidebarItem>

          <SidebarItem><b>Dịch vụ:</b> {booking.service?.title}</SidebarItem>

          <SidebarItem><b>Ngày khám:</b> {booking.appointment_date}</SidebarItem>

          <SidebarItem><b>Giờ khám:</b> {booking.timeSlot?.label}</SidebarItem>

          <SidebarItem><b>Tổng cộng:</b> {amount.toLocaleString()} đ</SidebarItem>
        </Sidebar>

      </Layout>
    </PageWrapper>
  );
};

export default StepDepartmentPayment;
