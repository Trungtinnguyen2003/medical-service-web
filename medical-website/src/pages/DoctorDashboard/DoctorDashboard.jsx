// src/pages/DoctorDashboard/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import appointmentService from "../../services/appointmentService";

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

const Content = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #f8fafc;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #4a148c;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  background-color: #ffffff;
`;

const Row = styled.div`
  margin-bottom: 8px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #555;
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
  background-color: ${(props) =>
    props.status === "pending"
      ? "#ffe082"
      : props.status === "confirmed"
      ? "#c8e6c9"
      : "#ffcdd2"};
  color: ${(props) =>
    props.status === "pending"
      ? "#ff6f00"
      : props.status === "confirmed"
      ? "#2e7d32"
      : "#c62828"};
`;

const ButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  background-color: ${(props) => (props.reject ? "#e53935" : "#2e7d32")};
  color: white;
`;

const DoctorDashboard = () => {
  const [selected, setSelected] = useState("appointments");
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getByDoctor();
      setAppointments(data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch khám:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      fetchAppointments(); // reload lại
    } catch (err) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  useEffect(() => {
    if (selected === "appointments") {
      fetchAppointments();
    }
  }, [selected]);

  const renderContent = () => {
    switch (selected) {
      case "appointments":
        return (
          <>
            <Title>Lịch hẹn của tôi</Title>
            {appointments.length === 0 ? (
              <p>Không có lịch hẹn nào.</p>
            ) : (
              appointments.map((a) => (
                <Card key={a.id}>
                  <Row>
                    <Label>Bệnh nhân:</Label>{" "}
                    {a.user ? `${a.user.name} (${a.user.email})` : "Không xác định"}
                  </Row>
                  <Row>
                    <Label>Ngày:</Label> {a.appointment_date} — {a.appointment_time}
                  </Row>
                  <Row>
                    <Label>Dịch vụ:</Label>{" "}
                    {a.service?.title || a.servicePackage?.name || "Không xác định"}
                  </Row>
                  <Row>
                    <Label>Triệu chứng:</Label> {a.symptoms || "—"}
                  </Row>
                  <Row>
                    <Label>Trạng thái:</Label>{" "}
                    <Status status={a.status}>{a.status}</Status>
                  </Row>
                  {a.status === "pending" && (
                    <ButtonGroup>
                      <Button onClick={() => updateStatus(a.id, "confirmed")}>Xác nhận</Button>
                      <Button reject onClick={() => updateStatus(a.id, "cancelled")}>
                        Từ chối
                      </Button>
                    </ButtonGroup>
                  )}
                </Card>
              ))
            )}
          </>
        );

      case "info":
        return <p>Thông tin bác sĩ (đang phát triển)</p>;

      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Sidebar>
        <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Bác sĩ</h3>
        <MenuItem active={selected === "appointments"} onClick={() => setSelected("appointments")}>
          Lịch hẹn
        </MenuItem>
        <MenuItem active={selected === "info"} onClick={() => setSelected("info")}>
          Thông tin bác sĩ
        </MenuItem>
        <MenuItem onClick={() => window.location.href = "/login"}>Đăng xuất</MenuItem>
      </Sidebar>
      <Content>{renderContent()}</Content>
    </Wrapper>
  );
};

export default DoctorDashboard;
