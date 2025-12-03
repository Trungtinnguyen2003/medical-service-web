import React, { useState } from "react";
import styled from "styled-components";

import PatientProfilePage from "../PatientProfilePage/PatientProfilePage";
import AppointmentHistoryPage from "../AppointmentHistoryPage/AppointmentHistoryPage";

const Container = styled.div`
  max-width: 1100px;
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
  font-weight: 600;
  border-radius: 8px;
  border: none;
  background: ${({ active }) => (active ? "#6366f1" : "#e5e7eb")};
  color: ${({ active }) => (active ? "#fff" : "#1f2937")};
  cursor: pointer;
`;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Container>
      <Tabs style={{ marginTop: "60px" }} >
        {/* <TabButton
          active={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        >
          Hồ sơ bệnh nhân
        </TabButton> */}

        <TabButton
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        >
          Phiếu khám bệnh
        </TabButton>
      </Tabs>

      {activeTab === "profile" ? (
        <PatientProfilePage />
      ) : (
        <AppointmentHistoryPage />
      )}
    </Container>
  );
};

export default ProfilePage;
