// src/pages/BookingFlowDepartment/StepDepartmentProfileCreate.jsx

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
  Select,
  BottomBar,
  PrimaryButton,
} from "../BookingFlow/style";

import { getDeptBooking, saveDeptBooking } from "./deptBookingStorage";
import patientProfileService from "../../services/patientProfile.service";

const StepDepartmentProfileCreate = () => {
  const navigate = useNavigate();
  const booking = getDeptBooking();

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    job: "",
    id_type: "CCCD",
    id_number: "",
    nationality: "",
    ethnicity: "",
    address: "",
    relationship: "self",
  });

  const handleSubmit = async () => {
    try {
      const res = await patientProfileService.createProfile(form);

      if (res?.profile) {
        saveDeptBooking({
          ...booking,
          profile: res.profile,
        });

        navigate("/booking-department?step=profile");
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
        {/* SIDEBAR */}
        <Sidebar  style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          <SidebarItem><b>Chuyên khoa:</b> {booking.department?.name}</SidebarItem>
          <SidebarItem><b>Dịch vụ:</b> {booking.service?.title}</SidebarItem>
          <SidebarItem><b>Bác sĩ:</b> {booking.assigned_doctor?.name}</SidebarItem>
          <SidebarItem><b>Ngày khám:</b> {booking.appointment_date}</SidebarItem>
          <SidebarItem><b>Giờ khám:</b> {booking.timeSlot?.label}</SidebarItem>
        </Sidebar>

        {/* MAIN FORM */}
        <Main  style={{ marginTop: "60px" }}>
          <MainHeader>Tạo hồ sơ bệnh nhân</MainHeader>

          <StepTitle>Thông tin chung</StepTitle>
          <StepDescription>
            Hồ sơ này sẽ được dùng cho lần khám này và các lần sau.
          </StepDescription>

          {/* FORM INPUTS */}
          <FormGroup>
            <label>Họ và tên *</label>
            <Input
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Ngày sinh *</label>
            <Input
              type="date"
              value={form.date_of_birth}
              onChange={(e) =>
                setForm({ ...form, date_of_birth: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Giới tính *</label>
            <Select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <label>Số điện thoại *</label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Nghề nghiệp *</label>
            <Input
              value={form.job}
              onChange={(e) =>
                setForm({ ...form, job: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Mã định danh *</label>
            <div style={{ display: "flex", gap: 10 }}>
              <Select
                style={{ width: 150 }}
                value={form.id_type}
                onChange={(e) =>
                  setForm({ ...form, id_type: e.target.value })
                }
              >
                <option value="CCCD">CCCD</option>
                <option value="CMND">CMND</option>
                <option value="Passport">Passport</option>
              </Select>

              <Input
                value={form.id_number}
                onChange={(e) =>
                  setForm({ ...form, id_number: e.target.value })
                }
              />
            </div>
          </FormGroup>

          <FormGroup>
            <label>Quốc gia *</label>
            <Input
              value={form.nationality}
              onChange={(e) =>
                setForm({ ...form, nationality: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Dân tộc *</label>
            <Input
              value={form.ethnicity}
              onChange={(e) =>
                setForm({ ...form, ethnicity: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Địa chỉ *</label>
            <Input
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </FormGroup>

          <BottomBar>
            <button onClick={() => navigate("/booking-department?step=profile")}>
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

export default StepDepartmentProfileCreate;
