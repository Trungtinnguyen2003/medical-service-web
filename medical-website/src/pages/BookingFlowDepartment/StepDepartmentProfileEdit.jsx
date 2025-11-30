// src/pages/BookingFlowDepartment/StepDepartmentProfileEdit.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import { getDeptBooking } from "./deptBookingStorage";
import patientProfileService from "../../services/patientProfile.service";

const StepDepartmentProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = getDeptBooking();

  const [loading, setLoading] = useState(true);
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
    relationship: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const list = await patientProfileService.getMyProfiles();
        const profile = list.find((p) => p.id == id);

        if (!profile) {
          alert("Không tìm thấy hồ sơ");
          navigate("/booking-department?step=profile");
          return;
        }

        setForm({
          full_name: profile.full_name || "",
          date_of_birth: profile.date_of_birth || "",
          gender: profile.gender || "",
          phone: profile.phone || "",
          job: profile.job || "",
          id_type: profile.id_type || "CCCD",
          id_number: profile.id_number || "",
          nationality: profile.nationality || "",
          ethnicity: profile.ethnicity || "",
          address: profile.address || "",
          relationship: profile.relationship || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSave = async () => {
    try {
      await patientProfileService.updateProfile(id, form);
      alert("Cập nhật hồ sơ thành công");
      navigate("/booking-department?step=profile");
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật hồ sơ");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Đang tải...</div>;

  return (
    <PageWrapper>
      <Layout>
        <Sidebar  style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          <SidebarItem><b>Chuyên khoa:</b> {booking.department?.name}</SidebarItem>
          <SidebarItem><b>Dịch vụ:</b> {booking.service?.title}</SidebarItem>
          <SidebarItem><b>Bác sĩ:</b> {booking.assigned_doctor?.name}</SidebarItem>
          <SidebarItem><b>Ngày khám:</b> {booking.appointment_date}</SidebarItem>
          <SidebarItem><b>Giờ khám:</b> {booking.timeSlot?.label}</SidebarItem>
        </Sidebar>

        <Main  style={{ marginTop: "60px" }}>
          <MainHeader>Sửa hồ sơ bệnh nhân</MainHeader>
          <StepTitle>Điều chỉnh thông tin</StepTitle>

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
            <PrimaryButton onClick={handleSave}>Lưu thay đổi</PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDepartmentProfileEdit;
