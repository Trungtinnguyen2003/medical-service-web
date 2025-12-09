// src/pages/BookingFlowDepartment/StepDepartmentSelect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import departmentService from "../../services/departmentService";
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
  List,
  ListItem,
  ItemMain,
  ItemTitle,
  ItemSub,
  BottomBar,
} from "../BookingFlow/style"; // 🔥 dùng lại style chuẩn

// ====================== ANIMATION ======================
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

// Inject keyframes giống StepSubject.jsx
const injectKeyframes = () => {
  if (document.getElementById("dept-select-animations")) return;

  const style = document.createElement("style");
  style.id = "dept-select-animations";
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; } 
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
};

const StepDepartmentSelect = ({ onNext }) => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const booking = getDeptBooking();

  useEffect(() => {
    injectKeyframes();
    departmentService.getAll().then((res) => {
  const filtered = (res || []).filter(
    (d) => !d.name.toLowerCase().includes("cận")
  );
  setDepartments(filtered);
});

  }, []);

  const handleSelect = (dept) => {
      localStorage.removeItem("deptBooking");
    saveDeptBooking({
      ...booking,
      department: dept,
      department_id: dept.id,
    });

    navigate(`/booking-department?step=service&departmentId=${dept.id}`);



  };

  return (
    <PageWrapper style={styles.fadeIn}>
      <Layout>
        {/* ================= SIDEBAR ================= */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarTitle>Thông tin đã chọn</SidebarTitle>

          <SidebarItem>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>
              Hãy chọn chuyên khoa để tiếp tục.
            </span>
          </SidebarItem>
        </Sidebar>

        {/* ================= MAIN ================= */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader>Vui lòng chọn chuyên khoa</MainHeader>

          <StepTitle>Danh sách chuyên khoa</StepTitle>
          <StepDescription>
            Vui lòng chọn chuyên khoa phù hợp với nhu cầu khám của bạn.
          </StepDescription>

          <List>
            {departments.map((dept) => (
              <ListItem
                key={dept.id}
                onClick={() => handleSelect(dept)}
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
                  <ItemTitle>{dept.name}</ItemTitle>
                  <ItemSub>{dept.description || "—"}</ItemSub>
                </ItemMain>
              </ListItem>
            ))}
          </List>

          <BottomBar>
            <button onClick={() => navigate(`/dat-lich`)}>&laquo; Quay lại</button>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDepartmentSelect;
