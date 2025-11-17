// src/pages/BookingFlow/StepService.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import serviceService from "../../services/serviceService";

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
  ItemPrice,
  BottomBar,
} from "./style";

import { saveBooking, getBooking } from "./bookingStorage";

const StepService = () => {
  const [params] = useSearchParams();
  const subjectId = params.get("subjectId");

  const [baseService, setBaseService] = useState(null);
  const navigate = useNavigate();
  const booking = getBooking();

  // 🟦 Chỉ lấy dịch vụ khám ban đầu
  useEffect(() => {
    serviceService.getAllServices().then((res) => {
      if (!res || res.length === 0) return;

      // ⚡ 1) Ưu tiên lấy flag is_base_service = true
      let base = res.find((s) => s.is_base_service === true);

      // ⚡ 2) Nếu chưa có, fallback theo tên
      if (!base)
        base = res.find(
          (s) =>
            s.title?.toLowerCase()?.includes("khám bệnh ban đầu") ||
            s.name?.toLowerCase()?.includes("khám bệnh ban đầu")
        );

      if (base) setBaseService(base);
    });
  }, []);

  const handleSelect = () => {
    if (!baseService) return;

    // Lưu vào localStorage
  saveBooking({
  ...booking,
  doctorId: params.get("doctorId"),
  departmentId: params.get("departmentId"),
  service: baseService,
 serviceId: baseService.id,
 doctor: booking.doctor,        // thêm
 department: booking.department // thêm
});




  navigate(
  `/booking?stepName=date&doctorId=${params.get("doctorId")}&departmentId=${params.get("departmentId")}&serviceId=${baseService.id}`
);

  };

  return (
    <PageWrapper>
      <Layout>
        {/* ================= SIDEBAR ================= */}
        <Sidebar>
          <SidebarTitle>Thông tin cơ sở y tế</SidebarTitle>
          {/* <SidebarItem>
            <b>Cơ sở:</b> Phòng khám / Bệnh viện của bạn
          </SidebarItem> */}

          {booking?.department && (
            <SidebarItem>
              <b>Chuyên khoa:</b> {booking.department.name}
            </SidebarItem>
          )}
        </Sidebar>

        {/* ================= MAIN ================= */}
        <Main>
          <MainHeader>Vui lòng chọn dịch vụ</MainHeader>

          <StepTitle>Dịch vụ khám ban đầu</StepTitle>
          <StepDescription>
            Đây là dịch vụ khám tổng quát ban đầu. Bác sĩ sẽ kiểm tra, đánh giá
            và chỉ định các cận lâm sàng (siêu âm, xét nghiệm…) nếu cần.
          </StepDescription>

          {/* Nếu chưa load xong */}
          {!baseService && (
            <p>Đang tải dịch vụ khám ban đầu...</p>
          )}

          {/* Chỉ hiển thị đúng 1 dịch vụ */}
          {baseService && (
            <List>
              <ListItem onClick={handleSelect}>
                <ItemMain>
                  <ItemTitle>{baseService.title || baseService.name}</ItemTitle>

                  {baseService.description && (
                    <ItemSub>{baseService.description}</ItemSub>
                  )}

                  {baseService.schedule_note && (
                    <ItemSub>Lịch khám: {baseService.schedule_note}</ItemSub>
                  )}
                </ItemMain>

                <ItemPrice>
                  {baseService.price
                    ? `${baseService.price.toLocaleString()} đ`
                    : "—"}
                </ItemPrice>
              </ListItem>
            </List>
          )}

          <BottomBar>
           <button
  onClick={() =>
    navigate(
      `/booking?stepName=department&doctorId=${params.get("doctorId")}`
    )
  }
>
  &laquo; Quay lại
</button>

          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepService;
