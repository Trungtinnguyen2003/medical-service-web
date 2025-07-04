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
import AdminPostApproval from "../../components/Admin/AdminPostApproval";
import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này


const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 220px;
  background-color:rgb(85, 72, 139);
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
  const navigate = useNavigate(); // 👈 khởi tạo điều hướng
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
        return <DoctorApprovalManager />; // ✅ Thêm dòng này
      case "post-category":
         return <PostCategoryManager />;
      case "post-approval":
        return <AdminPostApproval />;
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Sidebar>
      <h3 style={{ marginTop: "40px", marginBottom : "20px" }}>Quản trị hệ thống</h3>
        <MenuItem active={selected === "user"} onClick={() => setSelected("user")}>Người dùng</MenuItem>
        <MenuItem active={selected === "doctor"} onClick={() => setSelected("doctor")}>Bác sĩ</MenuItem>
        <MenuItem active={selected === "department"} onClick={() => setSelected("department")}>Chuyên khoa</MenuItem>
        <MenuItem active={selected === "service"} onClick={() => setSelected("service")}>Dịch vụ</MenuItem>
        <MenuItem active={selected === "package"} onClick={() => setSelected("package")}>Gói dịch vụ</MenuItem>
        <MenuItem active={selected === "post-approval"} onClick={() => setSelected("post-approval")}>
  Duyệt bài viết
</MenuItem>

        <MenuItem
  active={selected === "post-category"}
  onClick={() => setSelected("post-category")}
>
  Danh mục tin tức
</MenuItem>

        <MenuItem onClick={() => setSelected("doctor-approval")}>
  Phê duyệt bác sĩ
</MenuItem>     
<MenuItem onClick={handleLogout}>Đăng xuất</MenuItem> {/* ✅ Nút đăng xuất */} 
      </Sidebar>

      <Content>
        {renderContent()}
      </Content>
    </Wrapper>
  );
};

export default AdminPage;
