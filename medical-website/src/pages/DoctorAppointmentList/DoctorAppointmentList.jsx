// ================================================
// DoctorAppointmentList.jsx — Sidebar đẹp như Admin
// ================================================
import React, { useState } from "react";
import styled from "styled-components";
import { 
  FiCalendar,
  FiUser,
  FiFileText,
  FiMessageCircle,
  FiClipboard,
  FiLogOut,
} from "react-icons/fi";

import DoctorManager from "../../components/DoctorManager/DoctorManager";
import DoctorProfileManager from "../../components/DoctorManager/DoctorProfileManager";
import DoctorPostForm from "../../components/DoctorManager/DoctorPostForm";
import DoctorChatPage from "../../components/DoctorManager/DoctorChatPage";
import DoctorConsultationList from "../../components/DoctorManager/DoctorConsultationList";
import { useNavigate } from "react-router-dom";


// ======================== STYLE ========================

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
`;

const Sidebar = styled.div`
  width: 220px;
  padding: 20px 16px;
  background: linear-gradient(160deg, #8e44ad, #6c2ba5, #4a148c);
  color: white;
  display: flex;
  flex-direction: column;
  border-radius: 0 18px 18px 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
`;

const SidebarTitle = styled.h3`
  margin: 28px 0 22px 0;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  opacity: 0.95;
  letter-spacing: 0.4px;
`;

const MenuItem = styled.div`
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  transition: 0.25s ease;

  color: ${({ active }) => (active ? "#ffdd67" : "white")};
  background: ${({ active }) =>
    active ? "rgba(255,255,255,0.18)" : "transparent"};

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  svg {
    font-size: 16px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 25px 35px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;


// ======================== MAIN ========================

const DoctorAppointmentList = () => {
  const [selected, setSelected] = useState("appointments");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderContent = () => {
    switch (selected) {
      case "appointments":
        return <DoctorManager />;
      case "profile":
        return <DoctorProfileManager />;
      case "post":
        return <DoctorPostForm />;
      case "consultations":
        return <DoctorConsultationList />;
      case "chat":
        return <DoctorChatPage />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Sidebar>
        <SidebarTitle>Bác sĩ</SidebarTitle>

        <MenuItem
          active={selected === "appointments"}
          onClick={() => setSelected("appointments")}
        >
          <FiCalendar /> Lịch hẹn
        </MenuItem>

        <MenuItem
          active={selected === "profile"}
          onClick={() => setSelected("profile")}
        >
          <FiUser /> Thông tin cá nhân
        </MenuItem>

        <MenuItem
          active={selected === "post"}
          onClick={() => setSelected("post")}
        >
          <FiFileText /> Đăng bài viết
        </MenuItem>

        <MenuItem
          active={selected === "consultations"}
          onClick={() => setSelected("consultations")}
        >
          <FiClipboard /> Câu hỏi tư vấn
        </MenuItem>

        <MenuItem
          active={selected === "chat"}
          onClick={() => setSelected("chat")}
        >
          <FiMessageCircle /> Tin nhắn tư vấn
        </MenuItem>

        <MenuItem onClick={handleLogout} style={{ marginTop: 18 }}>
          <FiLogOut /> Đăng xuất
        </MenuItem>
      </Sidebar>

      <ContentWrapper>{renderContent()}</ContentWrapper>
    </Wrapper>
  );
};

export default DoctorAppointmentList;
