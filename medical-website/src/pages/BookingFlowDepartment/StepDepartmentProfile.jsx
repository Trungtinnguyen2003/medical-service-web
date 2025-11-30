// src/pages/BookingFlowDepartment/StepDepartmentProfile.jsx

import React, { useEffect, useState } from "react";
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
  List,
  ListItem,
  ItemMain,
  ItemTitle,
  ItemSub,
  BottomBar,
  PrimaryButton,
} from "../BookingFlow/style";

import { getDeptBooking, saveDeptBooking } from "./deptBookingStorage";
import patientProfileService from "../../services/patientProfile.service";

const StepDepartmentProfile = () => {
  const navigate = useNavigate();
  const booking = getDeptBooking();

  const [profiles, setProfiles] = useState([]);
  const [selectedId, setSelectedId] = useState(
    booking.profile ? booking.profile.id : null
  );
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await patientProfileService.getMyProfiles();

        if (list.length === 0) {
          navigate("/booking-department/create-profile");
          return;
        }

        setProfiles(list);
      } catch (err) {
        console.error("Lỗi load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const handleNext = () => {
    const profile = profiles.find((p) => p.id === selectedId);

    if (!profile) {
      alert("Vui lòng chọn một hồ sơ");
      return;
    }

    saveDeptBooking({
      ...booking,
      profile,
    });

    navigate("/booking-department?step=confirm");
  };

  if (loading) return <div style={{ padding: 40 }}>Đang tải hồ sơ...</div>;

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
            <b>Bác sĩ:</b> {booking.assigned_doctor?.name}
          </SidebarItem>

          <SidebarItem>
            <b>Ngày khám:</b> {booking.appointment_date}
          </SidebarItem>

          <SidebarItem>
            <b>Giờ khám:</b> {booking.timeSlot?.label}
          </SidebarItem>
        </Sidebar>

        {/* MAIN */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Chọn hồ sơ bệnh nhân</MainHeader>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <StepTitle>Chọn người sẽ đi khám</StepTitle>

            <button
              onClick={() =>
                navigate("/booking-department/create-profile")
              }
              style={{
                background: "#00AEEF",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ➕ Thêm hồ sơ
            </button>
          </div>

          <StepDescription>
            Bạn có thể chọn hồ sơ đã tạo hoặc tạo hồ sơ mới cho người thân.
          </StepDescription>

          <List>
            {profiles.map((p) => {
              const expanded = expandedId === p.id;

              return (
                <ListItem
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  style={{
                    cursor: "pointer",
                    border:
                      selectedId === p.id
                        ? "2px solid #00AEEF"
                        : "1px solid #ddd",
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    marginBottom: "20px",
                    position: "relative",
                  }}
                >
                  {/* NÚT SỬA HỒ SƠ */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking-department/edit-profile/${p.id}`)

                    }}
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 60,
                      background: "#f1f5f9",
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: "1px solid #d0d7df",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    ✏️ Sửa
                  </button>

                  {/* Radio chọn */}
                  <input
                    type="radio"
                    checked={selectedId === p.id}
                    readOnly
                    style={{ position: "absolute", top: 22, right: 20 }}
                  />

                  {/* Nội dung hồ sơ */}
                  <ItemMain>
                    <ItemTitle style={{ fontSize: "20px", color: "#00AEEF" }}>
                      {p.full_name}
                    </ItemTitle>

                    <ItemSub>Ngày sinh: {p.date_of_birth}</ItemSub>
                    <ItemSub>Số điện thoại: {p.phone}</ItemSub>
                    <ItemSub>Địa chỉ: {p.address}</ItemSub>

                    <div style={{ marginTop: 10 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expanded ? null : p.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#00AEEF",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {expanded ? "Ẩn bớt ▲" : "Xem thêm ▼"}
                      </button>
                    </div>

                    {expanded && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: 12,
                          background: "#f7faff",
                          borderRadius: 8,
                          border: "1px solid #e2ecf5",
                        }}
                      >
                        <ItemSub>Nghề nghiệp: {p.job || "—"}</ItemSub>
                        <ItemSub>Giới tính: {p.gender || "—"}</ItemSub>
                        <ItemSub>Dân tộc: {p.ethnicity || "—"}</ItemSub>
                        <ItemSub>Quốc gia: {p.nationality || "—"}</ItemSub>
                        <ItemSub>Loại giấy tờ: {p.id_type || "—"}</ItemSub>
                        <ItemSub>Mã định danh: {p.id_number || "—"}</ItemSub>
                      </div>
                    )}
                  </ItemMain>
                </ListItem>
              );
            })}
          </List>

          <BottomBar>
            <button
              onClick={() =>
                navigate("/booking-department?step=time")
              }
            >
              « Quay lại
            </button>

            <PrimaryButton onClick={handleNext}>Tiếp tục</PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDepartmentProfile;
