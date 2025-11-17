// src/pages/BookingFlow/StepProfileCreate.jsx
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
  FormGroup,
  Input,
  BottomBar,
  PrimaryButton,
} from "./style";

import { saveBooking, getBooking } from "./bookingStorage";
import patientProfileService from "../../services/patientProfile.service";

const StepProfileCreate = () => {
  const navigate = useNavigate();
  const booking = getBooking();

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Nam",
    phone: "",
    address: "",
    email: "",
    relationship: "self",
  });

  const handleSubmit = async () => {
    try {
      const res = await patientProfileService.createProfile(form);

      if (res?.profile) {
        saveBooking({
          ...booking,
          profile: res.profile,
        });

        // ➜ Tạo xong quay lại trang chọn hồ sơ
        navigate("/chon-ho-so");
      } else {
        alert("Không tạo được hồ sơ");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi tạo hồ sơ");
    }
  };

  return (
    <PageWrapper>
      <Layout>
        <Sidebar>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          <SidebarItem>
            <b>Chuyên khoa:</b> {booking.department?.name}
          </SidebarItem>

          <SidebarItem>
            <b>Dịch vụ:</b> {booking.service?.title || booking.service?.name}
          </SidebarItem>

          <SidebarItem>
            <b>Ngày khám:</b> {booking.date}
          </SidebarItem>

          <SidebarItem>
            <b>Giờ khám:</b> {booking.timeSlot?.label}
          </SidebarItem>
        </Sidebar>

        <Main>
          <MainHeader>Tạo hồ sơ bệnh nhân</MainHeader>
          <StepTitle>Nhập thông tin người khám</StepTitle>

          <StepDescription>
            Hồ sơ này sẽ được lưu lại cho những lần đặt khám sau.
          </StepDescription>

          <FormGroup>
            <label>Họ và tên</label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Ngày sinh</label>
            <Input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Số điện thoại</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Địa chỉ</label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </FormGroup>

          <BottomBar>
            <button onClick={() => navigate("/chon-ho-so")}>
              « Quay lại
            </button>

            <PrimaryButton onClick={handleSubmit}>
              Tạo hồ sơ
            </PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepProfileCreate;
