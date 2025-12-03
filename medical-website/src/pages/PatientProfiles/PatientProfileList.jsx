// src/pages/PatientProfiles/PatientProfileList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import SidebarLayout from "../../layouts/SidebarLayout";

const Card = styled.div`
  background: white;
  padding: 22px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 18px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.04);
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 24px;
`;

const Row = styled.div`
  margin-bottom: 8px;
  font-size: 15px;

  span {
    font-weight: 600;
    color: #0a4b8f;
  }
`;

const PatientProfileList = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/patient-profiles/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfiles(res.data));
  }, []);

  return (
    <SidebarLayout>
      <Title>Danh sách hồ sơ bệnh nhân</Title>

      {profiles.map((p) => (
        <Card key={p.id}>
          <Row>
            <span>Họ và tên:</span> {p.full_name}
          </Row>
          <Row>
            <span>Ngày sinh:</span> {p.date_of_birth}
          </Row>
          <Row>
            <span>Giới tính:</span> {p.gender}
          </Row>
          <Row>
            <span>Số điện thoại:</span> {p.phone}
          </Row>
          <Row>
            <span>Địa chỉ:</span> {p.address}
          </Row>
        </Card>
      ))}
    </SidebarLayout>
  );
};

export default PatientProfileList;
