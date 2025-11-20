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
import { getBooking, saveBooking } from "./bookingStorage";
import { API_BASE_URL } from "../../config";

const StepPayment = () => {
  const navigate = useNavigate();
  const booking = getBooking();

  const [method, setMethod] = useState("vnpay"); // default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = Number(booking?.service?.price) || 0;

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
        package_id: null,
        doctor_id: booking.doctor?.id,
        appointment_date: booking.date,
        slot_id: booking.timeSlot?.id,
        department_id: booking.department?.id,
        patient_profile_id: booking.profile?.id,
        clinic_room_id: booking?.doctor?.clinic_room_id,

        amount,
      };

      // ==============================
      // CHỌN API TƯƠNG ỨNG
      // ==============================
      let endpoint = "";

      if (method === "vnpay") {
        endpoint = `${API_BASE_URL}/api/payment/vnpay/create`;
      } else if (method === "momo") {
        endpoint = `${API_BASE_URL}/api/payment/momo/create`;
      } else if (method === "paypal") {
        endpoint = `${API_BASE_URL}/api/payment/paypal/create`;
      }

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
        setError(data.message || "Không tạo được giao dịch");
        return;
      }

      // LƯU LẠI TRANSACTION CỦA ĐƠN HÀNG
      saveBooking({
        payment_transaction_id: data.transactionId,
        payment_method: method,
      });

      // Nếu là PayPal hoặc VNPay hoặc MoMo → đều redirect
      window.location.href = data.paymentUrl;

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Layout>

        {/* ------------------ CỘT 1: Bệnh nhân ------------------ */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin bệnh nhân</SidebarTitle>
          <SidebarItem><b>Họ tên:</b> {booking.profile?.full_name}</SidebarItem>
          <SidebarItem><b>SĐT:</b> {booking.profile?.phone}</SidebarItem>
          <SidebarItem><b>Địa chỉ:</b> {booking.profile?.address}</SidebarItem>
        </Sidebar>

        {/* ------------------ CỘT 2: Chọn phương thức thanh toán ------------------ */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Chọn phương thức thanh toán</MainHeader>

          {/* VNPay */}
          <label
            onClick={() => setMethod("vnpay")}
            style={{
              border: method === "vnpay" ? "2px solid #0284c7" : "1px solid #d1d5db",
              display: "flex",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 14
            }}
          >
            <input
              type="radio"
              checked={method === "vnpay"}
              onChange={() => setMethod("vnpay")}
            />
            <div>
              <b>VNPay</b><br />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Thanh toán ATM / Visa / QR VNPay
              </span>
            </div>
          </label>

          {/* MoMo */}
          <label
            onClick={() => setMethod("momo")}
            style={{
              border: method === "momo" ? "2px solid #db2777" : "1px solid #d1d5db",
              display: "flex",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 14
            }}
          >
            <input
              type="radio"
              checked={method === "momo"}
              onChange={() => setMethod("momo")}
            />
            <div>
              <b>Ví MoMo</b><br />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Thanh toán ví điện tử, liên kết ngân hàng
              </span>
            </div>
          </label>

          {/* PAYPAL */}
          <label
            onClick={() => setMethod("paypal")}
            style={{
              border: method === "paypal" ? "2px solid #0f766e" : "1px solid #d1d5db",
              display: "flex",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 14
            }}
          >
            <input
              type="radio"
              checked={method === "paypal"}
              onChange={() => setMethod("paypal")}
            />
            <div>
              <b>PayPal</b><br />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                Thanh toán bằng PayPal (Visa / MasterCard)
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
            <button onClick={() => navigate("/xac-nhan-thong-tin")}>
              ← Quay lại
            </button>

            <PrimaryButton disabled={loading} onClick={handlePayment}>
              {loading ? "Đang xử lý..." : "Thanh toán ngay"}
            </PrimaryButton>
          </BottomBar>
        </Main>

        {/* ------------------ CỘT 3: Thông tin dịch vụ ------------------ */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin thanh toán</SidebarTitle>
          <SidebarItem><b>Chuyên khoa:</b> {booking.department?.name}</SidebarItem>
          <SidebarItem><b>Bác sĩ:</b> {booking.doctor?.name}</SidebarItem>
          <SidebarItem><b>Dịch vụ:</b> {booking.service?.title}</SidebarItem>
          <SidebarItem><b>Ngày khám:</b> {booking.date}</SidebarItem>
          <SidebarItem><b>Giờ khám:</b> {booking.timeSlot?.label}</SidebarItem>
          <SidebarItem><b>Tổng cộng:</b> {amount.toLocaleString()} đ</SidebarItem>
        </Sidebar>

      </Layout>
    </PageWrapper>
  );
};

export default StepPayment;
