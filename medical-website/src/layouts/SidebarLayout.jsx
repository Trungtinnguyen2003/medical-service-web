// src/layouts/SidebarLayout.jsx
import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Layout = styled.div`
  display: flex;
  padding: 24px;
`;

const Sidebar = styled.div`
  width: 260px;
  background: #f8fbff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 16px;
  border-radius: 16px;
  height: fit-content;
`;

const MenuItem = styled(NavLink)`
  display: block;
  padding: 14px 18px;
  margin-bottom: 8px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;

  &.active {
    background: #0ea5e9;
    color: white;
  }

  &:hover {
    background: #e0f2fe;
  }
`;

const Content = styled.div`
  flex: 1;
  padding-left: 32px;
`;

const SidebarLayout = ({ children }) => {
  return (
    <Layout>
      <Sidebar style={{ marginTop: "60px" }} >
        <MenuItem to="/profiles">🧑 Hồ sơ bệnh nhân</MenuItem>
        <MenuItem to="/appointments">📄 Phiếu khám bệnh</MenuItem>
      </Sidebar>

      <Content>{children}</Content>
    </Layout>
  );
};

export default SidebarLayout;
