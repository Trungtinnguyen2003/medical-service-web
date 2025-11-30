// src/pages/BookingFlowDepartment/StepDepartmentTime.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appointmentService from "../../services/appointmentService";
import { getDeptBooking, saveDeptBooking } from "./deptBookingStorage";

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
} from "../BookingFlow/style";

const StepDepartmentTime = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const booking = getDeptBooking();

  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const res = await appointmentService.getTimeSlots();
      setSlots(res);
    } catch (e) {
      console.log("Lỗi tải slot:", e);
    }
  };

  const handleNext = async () => {
    if (processing) return;               // ❗ CHẶN DOUBLE SUBMIT
    setProcessing(true);

    if (!selectedSlotId) {
      alert("Vui lòng chọn khung giờ");
      setProcessing(false);              // ❗ KHÔI PHỤC NẾU LỖI
      return;
    }

    const slot = slots.find((s) => s.id === selectedSlotId);

    try {
      const result = await appointmentService.autoAssignAppointment({
        department_id: booking.department_id,
        service_id: booking.service.id,
        appointment_date: booking.appointment_date,
        slot_id: selectedSlotId,
      });

      const assignedDoctor = result.doctor_assigned;

      if (!assignedDoctor) {
        alert("Không có bác sĩ rảnh trong khung giờ này");
        setProcessing(false);
        return;
      }

      // ⭐ Lưu dữ liệu mới – xoá sạch dữ liệu cũ
      // ⭐ Lưu dữ liệu mới – không còn appointment_id
saveDeptBooking({
  department: booking.department,
  department_id: booking.department_id,
  service: booking.service,
  appointment_date: booking.appointment_date,
  timeSlot: slot,
  assigned_doctor: assignedDoctor
});


      // ⭐ Xoá dữ liệu cũ để lần sau không auto-submit lại
      localStorage.removeItem("deptBooking_old");
      
      navigate(`/booking-department?step=profile`);
    } catch (err) {
      alert(err.response?.data?.message || "Không thể gán bác sĩ");
    }

    setProcessing(false); // ❗ KHÔI PHỤC TRẠNG THÁI
  };

  return (
    <PageWrapper>
      <Layout>
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin khám</SidebarTitle>
          <SidebarItem><b>Chuyên khoa:</b> {booking?.department?.name}</SidebarItem>
          <SidebarItem><b>Dịch vụ:</b> {booking?.service?.title}</SidebarItem>
          <SidebarItem><b>Ngày khám:</b> {booking?.appointment_date}</SidebarItem>
        </Sidebar>

        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Chọn giờ khám</MainHeader>

          <StepTitle>Vui lòng chọn khung giờ</StepTitle>
          <StepDescription>
            Hệ thống sẽ tự phân công bác sĩ theo khung giờ bạn chọn.
          </StepDescription>

          <SlotGroup>
            {slots.map((slot) => (
              <SlotButton
                key={slot.id}
                active={selectedSlotId === slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
              >
                {slot.label}
              </SlotButton>
            ))}
          </SlotGroup>

          <BottomBar>
            <button onClick={() => navigate(`/booking-department?step=date`)}>
              « Quay lại
            </button>

            <button disabled={processing} onClick={handleNext}>
              {processing ? "Đang xử lý..." : "Tiếp tục »"}
            </button>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDepartmentTime;
