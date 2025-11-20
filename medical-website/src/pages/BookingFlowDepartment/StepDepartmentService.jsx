// src/pages/BookingFlowDepartment/StepDepartmentService.jsx
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
} from "../BookingFlow/style";

import { saveDeptBooking, getDeptBooking } from "./deptBookingStorage";

// ====================== Animation ======================
const styles = {
  fadeIn: { animation: "fadeIn .6s ease", opacity: 0 },
  slideUp: { animation: "slideUp .6s ease", opacity: 0, transform: "translateY(15px)" },
};

const injectKeyframes = () => {
  if (document.getElementById("dept-service-anims")) return;

  const style = document.createElement("style");
  style.id = "dept-service-anims";
  style.innerHTML = `
    @keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} }
    @keyframes slideUp { from { opacity: 0; transform: translateY(15px);} 
                         to { opacity: 1; transform: translateY(0);} }
  `;
  document.head.appendChild(style);
};

const StepDepartmentService = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const booking = getDeptBooking();

  const [baseService, setBaseService] = useState(null);

  useEffect(() => {
    injectKeyframes();

    serviceService.getAllServices().then((res) => {
      if (!res || res.length === 0) return;

      let base = res.find((s) => s.is_base_service === true);

      if (!base) {
        base = res.find(
          (s) =>
            s.title?.toLowerCase()?.includes("khám bệnh ban đầu") ||
            s.name?.toLowerCase()?.includes("khám bệnh ban đầu")
        );
      }

      if (base) setBaseService(base);
    });
  }, []);

  const handleSelect = () => {
    if (!baseService) return;

    saveDeptBooking({
      ...booking,
      serviceId: baseService.id,
      service: baseService,
    });

    navigate(`/dat-lich?flow=department&step=date&serviceId=${baseService.id}`);
  };

  return (
    <PageWrapper style={styles.fadeIn}>
      <Layout>
        {/* ================= SIDEBAR ================= */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin đã chọn</SidebarTitle>

          {booking?.department && (
            <SidebarItem>
              <b>Chuyên khoa:</b> {booking.department.name}
            </SidebarItem>
          )}

          <SidebarItem>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>
              Vui lòng kiểm tra thông tin trước khi tiếp tục.
            </span>
          </SidebarItem>
        </Sidebar>

        {/* ================= MAIN ================= */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader style={styles.slideUp}>Vui lòng chọn dịch vụ</MainHeader>

          <StepTitle style={styles.slideUp}>Dịch vụ khám ban đầu</StepTitle>

          <StepDescription style={styles.slideUp}>
            Đây là dịch vụ khám lâm sàng ban đầu. Bác sĩ sẽ đánh giá và chỉ định cận lâm sàng nếu cần.
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
                  animation: "fadeIn .7s ease",
                }}
              >
                <ItemMain>
                  <ItemTitle>{baseService.title || baseService.name}</ItemTitle>

                  {baseService.description && (
                    <ItemSub>{baseService.description}</ItemSub>
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
            <button onClick={() => navigate(`/dat-lich?flow=department&step=department`)}>
              &laquo; Quay lại
            </button>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDepartmentService;
