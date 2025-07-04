// src/pages/Profile/ProfilePage.jsx
import React, { useState } from "react";
import AuthPage from "./AuthPage";
import AppointmentHistory from "./AppointmentHistory";
import styled from "styled-components";

const Container = styled.div`
  max-width: 960px;
  margin: 40px auto;
  padding: 24px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  background: ${({ active }) => (active ? "#3b82f6" : "#e5e7eb")};
  color: ${({ active }) => (active ? "#fff" : "#1f2937")};
  cursor: pointer;
`;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Container>
      <Tabs style={{ marginTop: "20px" }}>
        <TabButton
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        >
          Thông tin cá nhân
        </TabButton>
        <TabButton
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        >
          Lịch sử đặt khám
        </TabButton>
      </Tabs>

      {activeTab === "profile" ? <AuthPage /> : <AppointmentHistory />}
    </Container>
  );
};

export default ProfilePage;
