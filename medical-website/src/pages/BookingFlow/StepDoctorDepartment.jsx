// src/pages/BookingFlow/StepDoctorDepartment.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import doctorService from "../../services/doctorService";
import { getBooking, saveBooking } from "./bookingStorage";

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
} from "./style";

// Animation styles
const fadeIn = { animation: "fadeIn 0.6s ease" };
const slideUp = { animation: "slideUp 0.6s ease" };

const StepDoctorDepartment = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const doctorId = params.get("doctorId");
  const booking = getBooking();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    doctorService.getDoctorById(doctorId).then((res) => {
      setDoctor(res);
    });
  }, [doctorId]);

  const chooseDepartment = (dep) => {
  saveBooking({
    ...booking,
    doctor,                    // 🔥 GIỮ NGUYÊN BÁC SĨ ĐẦY ĐỦ
    doctorId: doctor.id,
    department: dep,
    departmentId: dep.id,
  });

  navigate(
    `/booking?stepName=service&doctorId=${doctor.id}&departmentId=${dep.id}`
  );
};


  const goBackDoctorList = () => navigate(`/booking?stepName=doctor`);

  if (!doctor) return <div>Đang tải dữ liệu...</div>;

  return (
    <PageWrapper style={fadeIn}>
      <Layout>
        {/* =============== SIDEBAR =============== */}
        <Sidebar style={{ marginTop: "60px", ...slideUp }}>
          <SidebarTitle>Bác sĩ đã chọn</SidebarTitle>

          {/* BOX TRẮNG giống StepService */}
          <SidebarItem
            style={{
              fontSize: "16px",
              background: "#fff",
              padding: "14px 18px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              border: "1px solid #eef2f7",
              lineHeight: "1.4",
              transition: "0.25s ease",
            }}
          >
            <b style={{ color: "#005fa3", fontSize: "17px" }}>
              {doctor.title} {doctor.name}
            </b>
          </SidebarItem>

          {/* ghi chú nhỏ */}
          <SidebarItem style={{ marginTop: 10 }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>
              Vui lòng chọn chuyên khoa mà bác sĩ đang công tác.
            </span>
          </SidebarItem>
        </Sidebar>

        {/* =============== MAIN CONTENT =============== */}
        <Main style={{ marginTop: "60px" }}>
          <MainHeader style={slideUp}>Chọn chuyên khoa</MainHeader>

          <StepTitle style={slideUp}>
            Bác sĩ đang làm việc tại các chuyên khoa:
          </StepTitle>

          <StepDescription style={slideUp}>
            Vui lòng chọn một chuyên khoa để tiếp tục đặt lịch.
          </StepDescription>

          {/* LIST DEPARTMENTS */}
          <List style={{ marginTop: 20 }}>
            {doctor.departments?.map((dep, i) => (
              <ListItem
                key={dep.id}
                onClick={() => chooseDepartment(dep)}
                style={{
                  cursor: "pointer",
                  background: "#fff",
                  borderRadius: 14,
                  padding: 20,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "0.25s",
                  marginBottom: 18,
                  ...slideUp,
                  animationDelay: `${0.1 * i}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 18px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.05)";
                }}
              >
                <ItemMain>
                  <ItemTitle style={{ color: "#0077c2", fontSize: 18 }}>
                    {dep.name}
                  </ItemTitle>

                  {dep.description && (
                    <ItemSub style={{ fontSize: 14, opacity: 0.75 }}>
                      {dep.description}
                    </ItemSub>
                  )}
                </ItemMain>
              </ListItem>
            ))}
          </List>

          {/* BACK BUTTON */}
          <BottomBar style={{ marginTop: 35 }}>
            <button
              onClick={goBackDoctorList}
              style={{
                fontSize: 15,
                padding: "8px 14px",
              }}
            >
              &laquo; Quay lại danh sách bác sĩ
            </button>
          </BottomBar>
        </Main>
      </Layout>

      {/* KEYFRAME ANIMATION */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PageWrapper>
  );
};

export default StepDoctorDepartment;
