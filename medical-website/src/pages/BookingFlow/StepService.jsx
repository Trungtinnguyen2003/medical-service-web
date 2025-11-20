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

// ====================== ANIMATION CSS ======================
const styles = {
  fadeIn: {
    animation: "fadeIn 0.6s ease forwards",
    opacity: 0,
  },
  slideUp: {
    animation: "slideUp 0.6s ease forwards",
    opacity: 0,
    transform: "translateY(20px)",
  },
};

// inject keyframes vào DOM
const injectKeyframes = () => {
  if (document.getElementById("stepService-animations")) return;

  const style = document.createElement("style");
  style.id = "stepService-animations";
  style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; } to { opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
  `;
  document.head.appendChild(style);
};

const StepService = () => {
  const [params] = useSearchParams();
  const subjectId = params.get("subjectId");
  const navigate = useNavigate();
  const booking = getBooking();

  const [baseService, setBaseService] = useState(null);

  useEffect(() => {
    injectKeyframes(); // thêm animation keyframes

    serviceService.getAllServices().then((res) => {
      if (!res || res.length === 0) return;

      let base = res.find((s) => s.is_base_service === true);

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

    saveBooking({
      ...booking,
      doctorId: params.get("doctorId"),
      departmentId: params.get("departmentId"),
      service: baseService,
      serviceId: baseService.id,
      doctor: booking.doctor, // vẫn giữ doctor cũ
      department: booking.department,
    });

    navigate(
      `/booking?stepName=date&doctorId=${params.get(
        "doctorId"
      )}&departmentId=${params.get(
        "departmentId"
      )}&serviceId=${baseService.id}`
    );
  };

  return (
    <PageWrapper style={styles.fadeIn}>
      <Layout>
        {/* ================= SIDEBAR ================= */}
        <Sidebar style={{ marginTop: "60px", ...styles.slideUp }}>
          <SidebarTitle>Thông tin đã chọn</SidebarTitle>

          {booking?.department && (
            <SidebarItem>
              <b>Chuyên khoa:</b> {booking.department.name}
            </SidebarItem>
          )}

          {/* ⭐ HIỂN THỊ TÊN BÁC SĨ ĐÃ CHỌN */}
          {booking?.doctor && (
            <SidebarItem>
              <b>Bác sĩ:</b> {booking.doctor.name}
            </SidebarItem>
          )}

          <SidebarItem>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>
              Hãy kiểm tra lại thông tin trước khi tiếp tục.
            </span>
          </SidebarItem>
        </Sidebar>

        {/* ================= MAIN ================= */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader style={styles.slideUp}>Vui lòng chọn dịch vụ</MainHeader>

          <StepTitle style={styles.slideUp}>Dịch vụ khám ban đầu</StepTitle>
          <StepDescription style={styles.slideUp}>
            Đây là dịch vụ khám tổng quát ban đầu. Bác sĩ sẽ kiểm tra, đánh giá
            và chỉ định các cận lâm sàng (siêu âm, xét nghiệm…) nếu cần.
          </StepDescription>

          {!baseService && <p>Đang tải dịch vụ khám ban đầu...</p>}

          {baseService && (
            <List style={styles.fadeIn}>
              <ListItem
                onClick={handleSelect}
                style={{
                  cursor: "pointer",
                  borderRadius: "12px",
                  transition: "0.25s",
                  animation: "fadeIn 0.7s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <ItemMain>
                  <ItemTitle>
                    {baseService.title || baseService.name}
                  </ItemTitle>

                  {baseService.description && (
                    <ItemSub>{baseService.description}</ItemSub>
                  )}

                  {baseService.schedule_note && (
                    <ItemSub>
                      <b>Lịch khám:</b> {baseService.schedule_note}
                    </ItemSub>
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
                  `/booking?stepName=department&doctorId=${params.get(
                    "doctorId"
                  )}`
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
