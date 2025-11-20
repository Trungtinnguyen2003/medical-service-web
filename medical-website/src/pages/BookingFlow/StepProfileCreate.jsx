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
} from "./style";

import { saveBooking, getBooking } from "./bookingStorage";
import patientProfileService from "../../services/patientProfile.service";

const StepProfileCreate = () => {
  const navigate = useNavigate();
  const booking = getBooking();

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
        saveBooking({
          ...booking,
          profile: res.profile,
        });

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
        {/* Sidebar */}
        <Sidebar>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          <SidebarItem><b>Chuyên khoa:</b> {booking.department?.name}</SidebarItem>
          <SidebarItem><b>Dịch vụ:</b> {booking.service?.title}</SidebarItem>
          <SidebarItem><b>Ngày khám:</b> {booking.date}</SidebarItem>
          <SidebarItem><b>Giờ khám:</b> {booking.timeSlot?.label}</SidebarItem>
        </Sidebar>

        {/* Main form */}
        <Main>
          <MainHeader>Tạo hồ sơ bệnh nhân</MainHeader>
          <StepTitle>Thông tin chung</StepTitle>

          <StepDescription>
            Hồ sơ này sẽ được lưu lại cho những lần đặt khám sau.
          </StepDescription>

          {/* Họ tên */}
          <FormGroup>
            <label>Họ và tên *</label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </FormGroup>

          {/* Ngày sinh */}
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

          {/* Giới tính */}
          <FormGroup>
            <label>Giới tính *</label>
            <Select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </Select>
          </FormGroup>

          {/* Số điện thoại */}
          <FormGroup>
            <label>Số điện thoại *</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </FormGroup>

          {/* Nghề nghiệp */}
          <FormGroup>
            <label>Nghề nghiệp *</label>
            <Input
              value={form.job}
              onChange={(e) => setForm({ ...form, job: e.target.value })}
            />
          </FormGroup>

          {/* Mã định danh */}
          <FormGroup>
            <label>Mã định danh / CCCD *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <Select
                style={{ width: "150px" }}
                value={form.id_type}
                onChange={(e) => setForm({ ...form, id_type: e.target.value })}
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

          {/* Quốc gia */}
          <FormGroup>
            <label>Quốc gia *</label>
            <Input
              value={form.nationality}
              onChange={(e) =>
                setForm({ ...form, nationality: e.target.value })
              }
            />
          </FormGroup>

          {/* Dân tộc */}
          <FormGroup>
            <label>Dân tộc *</label>
            <Input
              value={form.ethnicity}
              onChange={(e) =>
                setForm({ ...form, ethnicity: e.target.value })
              }
            />
          </FormGroup>

          {/* Địa chỉ */}
          <FormGroup>
            <label>Địa chỉ *</label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </FormGroup>

          {/* Buttons */}
          <BottomBar>
            <button onClick={() => navigate("/chon-ho-so")}>« Quay lại</button>
            <PrimaryButton onClick={handleSubmit}>Tạo hồ sơ</PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepProfileCreate;
