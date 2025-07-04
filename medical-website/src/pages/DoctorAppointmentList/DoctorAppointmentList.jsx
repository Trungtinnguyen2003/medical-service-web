// src/pages/DoctorAppointmentList/DoctorAppointmentList.jsx
import React, { useState } from "react";
import DoctorManager from "../../components/DoctorManager/DoctorManager";
import DoctorProfileManager from "../../components/DoctorManager/DoctorProfileManager";
import DoctorPostForm from "../../components/DoctorManager/DoctorPostForm"; // ✅ thêm dòng này
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 220px;
  background-color: #4a148c;
  color: white;
  padding: 20px;
`;

const MenuItem = styled.div`
  margin-bottom: 15px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#facc15" : "white")};
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #f8fafc;
`;

const DoctorAppointmentList = () => {
  const [selected, setSelected] = useState("appointments");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const renderContent = () => {
    if (selected === "appointments") return <DoctorManager />;
    if (selected === "profile") return <DoctorProfileManager />;
    if (selected === "post") return <DoctorPostForm />; // ✅ thêm form đăng bài
    return null;
  };

  return (
    <Wrapper>
      <Sidebar>
        <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Bác sĩ</h3>
        <MenuItem
          active={selected === "appointments"}
          onClick={() => setSelected("appointments")}
        >
          Lịch hẹn
        </MenuItem>
        <MenuItem
          active={selected === "profile"}
          onClick={() => setSelected("profile")}
        >
          Thông tin
        </MenuItem>
        <MenuItem
          active={selected === "post"}
          onClick={() => setSelected("post")}
        >
          Đăng bài viết
        </MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Sidebar>

      <ContentWrapper>{renderContent()}</ContentWrapper>
    </Wrapper>
  );
};

export default DoctorAppointmentList;
