// src/pages/BookingFlow/StepSubject.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import departmentService from "../../services/departmentService";
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
import { saveBooking } from "./bookingStorage";

const StepSubject = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    departmentService.getAll().then(setDepartments);
  }, []);

  const handleSelect = (dept) => {
    saveBooking({ department: dept, service: null, date: null, timeSlot: null });
    navigate(`/booking?stepName=service&subjectId=${dept.id}`);
  };

  return (
    <PageWrapper>
      <Layout>
        <Sidebar>
          <SidebarTitle>Thông tin cơ sở y tế</SidebarTitle>
          <SidebarItem>
            <b>Phòng khám / Bệnh viện của bạn</b>
            <br />
            (Bạn có thể thay bằng logo + địa chỉ cố định)
          </SidebarItem>
        </Sidebar>

        <Main>
          <MainHeader>Vui lòng chọn chuyên khoa</MainHeader>
          <StepTitle>Chọn chuyên khoa muốn khám</StepTitle>
          <StepDescription>
            Danh sách chuyên khoa của hệ thống. Hãy chọn chuyên khoa phù hợp với
            tình trạng hiện tại của bạn.
          </StepDescription>

          <List>
            {departments.map((dept) => (
              <ListItem key={dept.id} onClick={() => handleSelect(dept)}>
                <ItemMain>
                  <ItemTitle>{dept.name}</ItemTitle>
                  {dept.description && (
                    <ItemSub>{dept.description}</ItemSub>
                  )}
                </ItemMain>
                <span>Chọn &raquo;</span>
              </ListItem>
            ))}
          </List>

          <BottomBar>
            <span>Quay lại</span>
          </BottomBar>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepSubject;
