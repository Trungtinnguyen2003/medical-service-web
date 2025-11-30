// src/pages/BookingFlowDepartment/StepDepartmentDate.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import appointmentService from "../../services/appointmentService";
// import doctorService from "../../services/doctorService";
import { saveDeptBooking, getDeptBooking } from "./deptBookingStorage";

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
  BottomBar,
} from "../BookingFlow/style";

import CalendarPickerDepartment from "../../components/Booking/CalendarPickerDepartment";

const StepDepartmentDate = () => {
  const navigate = useNavigate();
  const booking = getDeptBooking();

  // ⭐ StepDepartmentDate.jsx (đã sửa đúng logic)
const handleSelectDate = async (date) => {

  // 🔥 1) Lấy bác sĩ LÀM VIỆC trong ngày (không check slot)
  const doctors = await appointmentService.getDoctorsWorkingOnDay(
    booking.department_id,
    date
  );

  // ❗ Chỉ báo lỗi nếu KHÔNG AI LÀM VIỆC NGÀY NÀY
  if (!doctors || doctors.length === 0) {
    alert("Không có bác sĩ làm việc trong ngày này.");
    return;
  }

  // ⭐ Không chọn bác sĩ ở bước này — chỉ lưu ngày
  saveDeptBooking({
    ...booking,
    appointment_date: date,
    assigned_doctor: null,
      appointment_id: null,   // ⭐ xoá lịch cũ
  });

  // ⭐ Chuyển sang bước chọn giờ
  navigate(`/booking-department?step=time`);
};


  return (
    <PageWrapper>
      <Layout>
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin khám</SidebarTitle>
          <SidebarItem><b>Chuyên khoa:</b> {booking?.department?.name}</SidebarItem>
          <SidebarItem><b>Dịch vụ:</b> {booking?.service?.title}</SidebarItem>
        </Sidebar>

        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Chọn ngày khám</MainHeader>

          <StepTitle>Vui lòng chọn ngày phù hợp</StepTitle>

          <StepDescription>
            Hệ thống sẽ tự phân công bác sĩ theo lịch cá nhân.
          </StepDescription>

          <CalendarPickerDepartment onSelectDate={handleSelectDate} />

          <BottomBar>
            <button
              onClick={() =>
                navigate(`/booking-department?step=service&departmentId=${booking.department_id}`)
              }
            >
              « Quay lại
            </button>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDepartmentDate;
