// src/pages/BookingFlow/StepTime.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

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
  SlotGroup,
  SlotButton,
  BottomBar,
  PrimaryButton,
} from "./style";

import { getBooking, saveBooking } from "./bookingStorage";

const StepTime = () => {
  const [params] = useSearchParams();

  const doctorId = params.get("doctorId");
  const departmentId = params.get("departmentId");
  const serviceId = params.get("serviceId");
  const date = params.get("date");

  const navigate = useNavigate();
  const booking = getBooking();

  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  useEffect(() => {
    if (!doctorId || !date) return;

    axios
      .get(
        `http://localhost:5000/doctors/${doctorId}/available-slots?date=${date}`
      )
      .then((res) => setSlots(res.data))
      .catch((err) => console.log("❌ Lỗi lấy giờ:", err));
  }, [doctorId, date]);

  const morningSlots = slots.filter((s) => s.period === "morning");
  const afternoonSlots = slots.filter((s) => s.period === "afternoon");

const handleNext = () => {
  const slot = slots.find((x) => x.id === selectedSlotId);

  saveBooking({
    ...booking,
    timeSlot: slot,
  });

  // 🔥 Điều hướng đúng flow booking
 navigate("/chon-ho-so");

};


  return (
    <PageWrapper>
      <Layout>
        <Sidebar>
          <SidebarTitle>Thông tin khám</SidebarTitle>
          <SidebarItem>
            <b>Bác sĩ:</b> {booking?.doctor?.name}
          </SidebarItem>
          <SidebarItem>
            <b>Ngày khám:</b> {date}
          </SidebarItem>
        </Sidebar>

        <Main>
          <MainHeader>Chọn khung giờ khám</MainHeader>

          <StepTitle>Các giờ còn nhận khám</StepTitle>

          <StepDescription>
            Các giờ khả dụng được hiển thị theo phân công của bác sĩ trong ngày.
          </StepDescription>

          {/* 🌤 Buổi sáng */}
          {morningSlots.length > 0 && (
            <>
              <h4>🌤 Buổi sáng</h4>
              <SlotGroup>
                {morningSlots.map((slot) => (
                  <SlotButton
                    key={slot.id}
                    active={selectedSlotId === slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                  >
                    {slot.label}
                  </SlotButton>
                ))}
              </SlotGroup>
            </>
          )}

          {/* ☀️ Buổi chiều */}
          {afternoonSlots.length > 0 && (
            <>
              <h4>☀️ Buổi chiều</h4>
              <SlotGroup>
                {afternoonSlots.map((slot) => (
                  <SlotButton
                    key={slot.id}
                    active={selectedSlotId === slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                  >
                    {slot.label}
                  </SlotButton>
                ))}
              </SlotGroup>
            </>
          )}

          <BottomBar>
            <button
              onClick={() =>
                navigate(
                  `/booking?stepName=date&doctorId=${doctorId}&departmentId=${departmentId}&serviceId=${serviceId}`
                )
              }
            >
              « Quay lại
            </button>

            <PrimaryButton
              disabled={!selectedSlotId}
              onClick={handleNext}
            >
              Tiếp tục
            </PrimaryButton>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepTime;
