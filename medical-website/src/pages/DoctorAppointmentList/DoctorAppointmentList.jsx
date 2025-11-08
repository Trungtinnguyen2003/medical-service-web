// src/pages/DoctorAppointmentList/DoctorAppointmentList.jsx
import React, { useState } from "react";
import DoctorManager from "../../components/DoctorManager/DoctorManager";
import DoctorProfileManager from "../../components/DoctorManager/DoctorProfileManager";
import DoctorPostForm from "../../components/DoctorManager/DoctorPostForm";
import DoctorChatPage from "../../components/DoctorManager/DoctorChatPage";
import styled from "styled-components";
import DoctorConsultationList from "../../components/DoctorManager/DoctorConsultationList";
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
  padding: 15px;
  background-color: #f8fafc;
`;

const DoctorAppointmentList = () => {
  // để test nhanh bạn có thể set mặc định là "consultations"
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
    if (selected === "post") return <DoctorPostForm />;
    if (selected === "consultations") return <DoctorConsultationList />;
    if (selected === "chat") return <DoctorChatPage />;
    return null;
  };

  return (
    <Wrapper>
      <Sidebar>
        <h3 style={{ marginTop: "70px", marginBottom: "20px" }}>Bác sĩ</h3>

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
        

        {/* ✅ ĐÃ DI CHUYỂN VÀO TRONG SIDEBAR */}
        <MenuItem
          active={selected === "consultations"}
          onClick={() => setSelected("consultations")}
        >
          Câu hỏi tư vấn
        </MenuItem>

        <MenuItem
  active={selected === "chat"}
  onClick={() => setSelected("chat")}
>
  Tin nhắn tư vấn
</MenuItem>


        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Sidebar>

      <ContentWrapper>{renderContent()}</ContentWrapper>
    </Wrapper>
  );
};

export default DoctorAppointmentList;
