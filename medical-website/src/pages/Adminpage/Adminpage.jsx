// src/pages/AdminPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import {
  FiUsers,
  FiUserCheck,
  FiGrid,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiLogOut,
  FiFileText,
  FiBookmark,
  FiPackage,
  FiActivity,
  FiLayers,
} from "react-icons/fi";

import UserManager from "../../components/Admin/UserManager";
import DoctorManager from "../../components/Admin/DoctorManager";
import DepartmentManager from "../../components/Admin/DepartmentManager";
import ServiceManager from "../../components/Admin/ServiceManager";
import PackageManager from "../../components/Admin/PackageManager";
import DoctorApprovalManager from "../../components/Admin/DoctorApprovalManager";
import PostCategoryManager from "../../components/Admin/PostCategoryManager";
import TimeSlotManager from "../../components/Admin/TimeSlotManager";
import AdminPostApproval from "../../components/Admin/AdminPostApproval";
import AppointmentManager from "../../components/Admin/AppointmentManager";
import DoctorScheduleManager from "../../components/Admin/DoctorScheduleManager";
import MedicineManager from "../../components/Admin/MedicineManager";
import ClinicRoomManager from "../../components/Admin/ClinicRoomManager";

import { useNavigate } from "react-router-dom";

// =================== STYLE TỐI ƯU ===================

// Wrapper
const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f6fa;
`;

// Sidebar
const Sidebar = styled.div`
  width: 210px;
  padding: 20px 16px;
  background: linear-gradient(160deg, #74a6d7ff, #3e8faaff, #5a6dcbff);
  color: white;
  display: flex;
  flex-direction: column;
  border-radius: 0 18px 18px 0;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.12);
`;

// Sidebar Title
const SidebarTitle = styled.h3`
  margin: 35px 0 22px 0;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.4px;
  opacity: 0.95;
`;

// Menu Item
const MenuItem = styled.div`
  padding: 9px 12px;
  margin-bottom: 6px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  transition: 0.2s ease;

  color: ${({ active }) => (active ? "#ffea7a" : "white")};
  background: ${({ active }) =>
    active ? "rgba(255,255,255,0.18)" : "transparent"};

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;

// Content Area
const Content = styled.div`
  flex: 1;
  padding: 28px 38px;
  background: #f8fafc;

  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// =================== COMPONENT ===================

const AdminPage = () => {
  const [selected, setSelected] = useState("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Render components
  const renderContent = () => {
    switch (selected) {
      case "user":
        return <UserManager />;
      case "doctor":
        return <DoctorManager />;
      case "department":
        return <DepartmentManager />;
      case "service":
        return <ServiceManager />;
      case "package":
        return <PackageManager />;
      case "doctor-approval":
        return <DoctorApprovalManager />;
      case "post-category":
        return <PostCategoryManager />;
      case "post-approval":
        return <AdminPostApproval />;
      case "appointment":
        return <AppointmentManager />;
      case "time-slot":
        return <TimeSlotManager />;
      case "doctor-schedule":
        return <DoctorScheduleManager />;
      case "medicine":
        return <MedicineManager />;
      case "clinic-room":
        return <ClinicRoomManager />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Sidebar>
        <SidebarTitle>Quản trị hệ thống</SidebarTitle>

        <MenuItem active={selected === "user"} onClick={() => setSelected("user")}>
          <FiUsers /> Người dùng
        </MenuItem>

        <MenuItem active={selected === "doctor"} onClick={() => setSelected("doctor")}>
          <FiUserCheck /> Bác sĩ
        </MenuItem>

        <MenuItem active={selected === "department"} onClick={() => setSelected("department")}>
          <FiGrid /> Chuyên khoa
        </MenuItem>

        <MenuItem active={selected === "service"} onClick={() => setSelected("service")}>
          <FiBriefcase /> Dịch vụ
        </MenuItem>

        <MenuItem active={selected === "clinic-room"} onClick={() => setSelected("clinic-room")}>
          <FiLayers /> Phòng khám
        </MenuItem>

        <hr style={{ margin: "14px 0", borderColor: "rgba(255,255,255,0.2)" }} />

        <MenuItem active={selected === "time-slot"} onClick={() => setSelected("time-slot")}>
          <FiClock /> Khung giờ khám
        </MenuItem>

        <MenuItem active={selected === "doctor-schedule"} onClick={() => setSelected("doctor-schedule")}>
          <FiCalendar /> Lịch làm việc
        </MenuItem>

        <hr style={{ margin: "14px 0", borderColor: "rgba(255,255,255,0.2)" }} />

        <MenuItem active={selected === "appointment"} onClick={() => setSelected("appointment")}>
          <FiActivity /> Lịch hẹn
        </MenuItem>

        <MenuItem active={selected === "medicine"} onClick={() => setSelected("medicine")}>
          <FiPackage /> Thuốc
        </MenuItem>

        <MenuItem active={selected === "post-approval"} onClick={() => setSelected("post-approval")}>
          <FiFileText /> Duyệt bài
        </MenuItem>

        <MenuItem active={selected === "post-category"} onClick={() => setSelected("post-category")}>
          <FiBookmark /> Danh mục
        </MenuItem>

        <MenuItem onClick={handleLogout} style={{ marginTop: 22 }}>
          <FiLogOut /> Đăng xuất
        </MenuItem>
      </Sidebar>

      <Content>{renderContent()}</Content>
    </Wrapper>
  );
};

export default AdminPage;
