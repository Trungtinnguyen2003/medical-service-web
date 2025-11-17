// src/pages/BookingFlow/StepProfile.jsx
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
} from "./style";

import { getBooking, saveBooking } from "./bookingStorage";
import patientProfileService from "../../services/patientProfile.service";

const StepProfile = () => {
  const navigate = useNavigate();
  const booking = getBooking();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(
    booking.profile ? booking.profile.id : null
  );

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await patientProfileService.getMyProfiles();

        if (Array.isArray(res)) {
          setProfiles(res);

          // ❗ Nếu chưa có hồ sơ → chuyển sang tạo hồ sơ
          if (res.length === 0) {
            navigate("/booking/create-profile");

          }
        }
      } catch (err) {
        console.error("Lỗi lấy hồ sơ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleNext = () => {
    const profile = profiles.find((p) => p.id === selectedId);
    if (!profile) {
      alert("Vui lòng chọn một hồ sơ");
      return;
    }

    saveBooking({ ...booking, profile });
    navigate("/xac-nhan-thong-tin");
  };

  if (loading) return <div style={{ padding: 40 }}>Đang tải hồ sơ...</div>;

  return (
    <PageWrapper>
      <Layout>
        <Sidebar>
          <SidebarTitle>Thông tin đặt khám</SidebarTitle>

          {booking.department && (
            <SidebarItem>
              <b>Chuyên khoa:</b> {booking.department.name}
            </SidebarItem>
          )}
          {booking.service && (
            <SidebarItem>
              <b>Dịch vụ:</b> {booking.service.title || booking.service.name}
            </SidebarItem>
          )}
          <SidebarItem>
            <b>Ngày khám:</b> {booking.date}
          </SidebarItem>
          <SidebarItem>
            <b>Giờ khám:</b> {booking.timeSlot?.label}
          </SidebarItem>
        </Sidebar>

        <Main>
          <MainHeader>Chọn hồ sơ bệnh nhân</MainHeader>
          <StepTitle>Chọn người sẽ đi khám</StepTitle>
          <StepDescription>
            Chọn một hồ sơ hoặc tạo mới nếu chưa có hồ sơ nào.
          </StepDescription>

          <List>
            {profiles.map((p) => (
              <ListItem key={p.id} onClick={() => setSelectedId(p.id)}>
                <ItemMain>
                  <ItemTitle>{p.full_name}</ItemTitle>
                  <ItemSub>Ngày sinh: {p.date_of_birth}</ItemSub>
                  <ItemSub>SĐT: {p.phone}</ItemSub>
                  <ItemSub>Địa chỉ: {p.address}</ItemSub>
                </ItemMain>
                <input
                  type="radio"
                  checked={selectedId === p.id}
                  readOnly
                />
              </ListItem>
            ))}
          </List>

          <BottomBar>
            <button onClick={() => navigate("/chon-gio")}>« Quay lại</button>

            <PrimaryButton onClick={handleNext}>
              Tiếp tục
            </PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepProfile;
