// src/pages/BookingFlow/StepDate.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
} from "./style";

import CalendarPicker from "../../components/Booking/CalendarPicker";
import { getBooking, saveBooking } from "./bookingStorage";

const StepDate = () => {
  const [params] = useSearchParams();
  const doctorId = params.get("doctorId");
  const departmentId = params.get("departmentId");
  const serviceId = params.get("serviceId");

  const navigate = useNavigate();

  // ép đọc lại booking từ localStorage
  const [bk, setBk] = useState(getBooking());

  useEffect(() => {
    setBk(getBooking());
  }, []);

  const handleSelectDate = (date) => {
    saveBooking({ ...bk, date });

    navigate(
      `/booking?stepName=time&doctorId=${doctorId}&departmentId=${departmentId}&serviceId=${serviceId}&date=${date}`
    );
  };

  return (
    <PageWrapper>
      <Layout>
        <Sidebar>
          <SidebarTitle>Thông tin khám</SidebarTitle>

          {bk?.doctor && (
            <SidebarItem>
              <b>Bác sĩ:</b> {bk.doctor.name}
            </SidebarItem>
          )}

          {bk?.department && (
            <SidebarItem>
              <b>Chuyên khoa:</b> {bk.department.name}
            </SidebarItem>
          )}

          {bk?.service && (
            <SidebarItem>
              <b>Dịch vụ:</b> {bk.service.title || bk.service.name}
            </SidebarItem>
          )}
        </Sidebar>

        <Main>
          <MainHeader>Chọn ngày khám</MainHeader>

          <StepTitle>Vui lòng chọn ngày bác sĩ còn nhận lịch</StepTitle>

          <StepDescription>
            Ngày sáng màu là ngày bác sĩ đang có lịch làm việc.
          </StepDescription>

          <CalendarPicker doctorId={doctorId} onSelectDate={handleSelectDate} />

          <BottomBar>
            <button
              onClick={() =>
                navigate(
                  `/booking?stepName=service&doctorId=${doctorId}&departmentId=${departmentId}`
                )
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

export default StepDate;
