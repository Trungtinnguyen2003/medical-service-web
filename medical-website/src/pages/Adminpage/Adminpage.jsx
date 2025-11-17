// src/pages/AdminPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import UserManager from "../../components/Admin/UserManager";
import DoctorManager from "../../components/Admin/DoctorManager";
import DepartmentManager from "../../components/Admin/DepartmentManager";
import ServiceManager from "../../components/Admin/ServiceManager";
import PackageManager from "../../components/Admin/PackageManager";
import DoctorApprovalManager from "../../components/Admin/DoctorApprovalManager";
import PostCategoryManager from "../../components/Admin/PostCategoryManager";
import TimeSlotManager from "../../components/Admin/TimeSlotManager"; // ✅ thêm
import AdminPostApproval from "../../components/Admin/AdminPostApproval";
import AppointmentManager from "../../components/Admin/AppointmentManager"; // ✅ thêm dòng này
import { useNavigate } from "react-router-dom";
import DoctorScheduleManager from "../../components/Admin/DoctorScheduleManager";
import MedicineManager from "../../components/Admin/MedicineManager";


const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 220px;
  background-color: rgb(85, 72, 139);
  color: white;
  padding: 20px;
`;

const MenuItem = styled.div`
  margin-bottom: 15px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#facc15" : "white")};
`;

const Content = styled.div`
  margin-top: 20px;
  flex: 1;
  padding: 40px;
  background-color: #f8fafc;
`;

const AdminPage = () => {
  const [selected, setSelected] = useState("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
        return <AppointmentManager />; // ✅ thêm case hiển thị component quản lý lịch hẹn
         case "time-slot": // ✅ hiển thị khung giờ
        return <TimeSlotManager />;
      case "doctor-schedule": // ✅ hiển thị lịch làm việc bác sĩ
        return <DoctorScheduleManager />;
      case "medicine":
        return <MedicineManager />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Sidebar>
        <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Quản trị hệ thống</h3>
        <MenuItem active={selected === "user"} onClick={() => setSelected("user")}>
          Người dùng
        </MenuItem>
        <MenuItem active={selected === "doctor"} onClick={() => setSelected("doctor")}>
          Bác sĩ
        </MenuItem>
        <MenuItem active={selected === "department"} onClick={() => setSelected("department")}>
          Chuyên khoa
        </MenuItem>
        <MenuItem active={selected === "service"} onClick={() => setSelected("service")}>
          Dịch vụ
        </MenuItem>
        {/* <MenuItem active={selected === "package"} onClick={() => setSelected("package")}>
          Gói dịch vụ
        </MenuItem> */}
          {/* ✅ thêm 2 menu mới để test */}
        <hr className="my-3 border-gray-400" />
        <MenuItem active={selected === "time-slot"} onClick={() => setSelected("time-slot")}>
          Quản lý Khung giờ
        </MenuItem>
        <MenuItem active={selected === "doctor-schedule"} onClick={() => setSelected("doctor-schedule")}>
          Lịch làm việc bác sĩ
        </MenuItem>
        <hr className="my-3 border-gray-400" />
        <MenuItem active={selected === "appointment"} onClick={() => setSelected("appointment")}>
          Duyệt lịch hẹn
        </MenuItem> {/* ✅ Thêm mục menu mới */}
        <MenuItem active={selected === "medicine"} onClick={() => setSelected("medicine")}>
  Quản lý Thuốc
</MenuItem>

        <MenuItem active={selected === "post-approval"} onClick={() => setSelected("post-approval")}>
          Duyệt bài viết
        </MenuItem>
        <MenuItem active={selected === "post-category"} onClick={() => setSelected("post-category")}>
          Danh mục tin tức
        </MenuItem>
        {/* <MenuItem onClick={() => setSelected("doctor-approval")}>Phê duyệt bác sĩ</MenuItem> */}
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Sidebar>

      <Content>{renderContent()}</Content>
    </Wrapper>
  );
};

export default AdminPage;
