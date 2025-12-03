import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
`;

const AddButton = styled(Link)`
  padding: 10px 18px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  &:hover {
    background: #2563eb;
  }
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
`;

const Field = styled.div`
  font-size: 15px;
  margin-bottom: 6px;
`;

const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 20px;
`;

const Action = styled.span`
  color: ${(p) => (p.danger ? "red" : "#0284c7")};
  cursor: pointer;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  margin-top: 40px;
`;

const PatientProfilePage = () => {
  const [profiles, setProfiles] = useState([]);

  const fetchProfiles = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/patient-profiles/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfiles(res.data);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <Wrapper>
      <Header>
        <Title>Hồ sơ bệnh nhân</Title>
        <AddButton to="/profile/add">➕ Thêm hồ sơ</AddButton>
      </Header>

      {profiles.length === 0 ? (
        <EmptyMessage>Bạn chưa có hồ sơ bệnh nhân nào.</EmptyMessage>
      ) : (
        profiles.map((p) => (
          <Card key={p.id}>
            <Field>👤 <b>{p.full_name}</b></Field>
            <Field>🎂 {p.birthday}</Field>
            <Field>📞 {p.phone}</Field>
            <Field>⚥ {p.gender}</Field>
            <Field>📍 {p.address}</Field>

            <Actions>
              <Action danger>Xóa hồ sơ</Action>
              <Action>Sửa hồ sơ</Action>
              <Action>Chi tiết</Action>
            </Actions>
          </Card>
        ))
      )}
    </Wrapper>
  );
};

export default PatientProfilePage;
