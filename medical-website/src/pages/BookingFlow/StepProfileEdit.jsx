// src/pages/BookingFlow/StepProfileEdit.jsx
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
} from "./style";

import { getBooking } from "./bookingStorage";
import patientProfileService from "../../services/patientProfile.service";

const StepProfileEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const booking = getBooking();

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
    relationship: ""
  });

  // 🔥 LOAD PROFILE ĐÚNG CÁCH (fix lỗi blank)
  const fetchProfile = async () => {
    try {
      const list = await patientProfileService.getMyProfiles();
      const p = list.find((item) => item.id == id);

      if (!p) {
        alert("Không tìm thấy hồ sơ cần sửa");
        navigate("/chon-ho-so");
        return;
      }

      // ⭐ Quan trọng: phải fill đủ các trường đang có
      setForm({
        full_name: p.full_name || "",
        date_of_birth: p.date_of_birth || "",
        gender: p.gender || "",
        phone: p.phone || "",
        job: p.job || "",
        id_type: p.id_type || "CCCD",
        id_number: p.id_number || "",
        nationality: p.nationality || "",
        ethnicity: p.ethnicity || "",
        address: p.address || "",
        relationship: p.relationship || ""
      });

    } catch (err) {
      console.error(err);
      alert("Lỗi tải hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await patientProfileService.updateProfile(id, form);
      if (res) {
        alert("Cập nhật hồ sơ thành công!");
        navigate("/chon-ho-so");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật hồ sơ");
    }
  };

  if (loading)
    return <div style={{ padding: 40 }}>Đang tải hồ sơ...</div>;

  return (
    <PageWrapper>
      <Layout>
        {/* SIDEBAR */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          <SidebarItem>
            <b>Chuyên khoa:</b> {booking.department?.name}
          </SidebarItem>
          <SidebarItem>
            <b>Dịch vụ:</b> {booking.service?.title}
          </SidebarItem>
          <SidebarItem>
            <b>Ngày khám:</b> {booking.date}
          </SidebarItem>
          <SidebarItem>
            <b>Giờ khám:</b> {booking.timeSlot?.label}
          </SidebarItem>
        </Sidebar>

        {/* MAIN */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Sửa hồ sơ bệnh nhân</MainHeader>
          <StepTitle>Điều chỉnh thông tin hồ sơ</StepTitle>
          <StepDescription>
            Những thông tin này sẽ được lưu và sử dụng lần khám sau.
          </StepDescription>

          {/* FORM INPUTS */}
          <FormGroup>
            <label>Họ và tên *</label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
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
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <label>Số điện thoại *</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Nghề nghiệp *</label>
            <Input
              value={form.job}
              onChange={(e) => setForm({ ...form, job: e.target.value })}
            />
          </FormGroup>

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
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </FormGroup>

          {/* BUTTONS */}
          <BottomBar>
            <button onClick={() => navigate("/chon-ho-so")}>« Quay lại</button>
            <PrimaryButton onClick={handleUpdate}>Lưu thay đổi</PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepProfileEdit;
