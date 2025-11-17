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
  BottomBar
} from "./style";

const StepDoctorDepartment = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const doctorId = params.get("doctorId");
    const booking = getBooking()
  const [doctor, setDoctor] = useState(null);

  // 🟦 Lấy thông tin bác sĩ và chuyên khoa
  useEffect(() => {
    if (!doctorId) return;

    doctorService.getDoctorById(doctorId).then((res) => {
      console.log("Doctor:", res);
      setDoctor(res);
    });
  }, [doctorId]);

  const chooseDepartment = (dep) => {
  saveBooking({
    ...booking,
    doctor: {
      id: doctor.id,
      name: doctor.name,
      title: doctor.title,
    },
    department: dep,
    departmentId: dep.id,
    
  });

  navigate(
    `/booking?stepName=service&doctorId=${doctorId}&departmentId=${dep.id}`
  );
};

    const goBackDoctorList = () => {
    navigate(`/booking?stepName=doctor`);
  };

  if (!doctor) return <div>Đang tải dữ liệu...</div>;

  return (
    <PageWrapper>
      <Layout>
        <Sidebar>
          <SidebarTitle>Bác sĩ đã chọn</SidebarTitle>
          <SidebarItem>
            <b>{doctor.title} {doctor.name}</b>
          </SidebarItem>
        </Sidebar>

        <Main>
          <MainHeader>Chọn chuyên khoa</MainHeader>

          <StepTitle>Bác sĩ đang làm việc tại các chuyên khoa:</StepTitle>

          <StepDescription>
            Vui lòng chọn 1 chuyên khoa bên dưới.
          </StepDescription>

          <List>
            {doctor.departments?.map((dep) => (
              <ListItem key={dep.id} onClick={() => chooseDepartment(dep)}>
                <ItemMain>
                  <ItemTitle>{dep.name}</ItemTitle>
                  {dep.description && (
                    <ItemSub>{dep.description}</ItemSub>
                  )}
                </ItemMain>
                
              </ListItem>
            ))}
          </List>
               {/* 🔙 Nút quay lại */}
          <BottomBar style={{ marginBottom: "20px" }}>
            <button onClick={goBackDoctorList} style={{ fontSize: "15px" }}>
              &laquo; Quay lại danh sách bác sĩ
            </button>
          </BottomBar>

        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepDoctorDepartment;
