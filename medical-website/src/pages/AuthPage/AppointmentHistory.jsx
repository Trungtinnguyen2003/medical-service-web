import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import dayjs from "dayjs";

const Wrapper = styled.div`
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
`;

const Th = styled.th`
  padding: 14px 16px;
  background-color: #f3f4f6;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 15px;
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: ${({ status }) =>
    status === "confirmed"
      ? "#10b981"
      : status === "cancelled"
      ? "#ef4444"
      : "#f59e0b"};
`;

const EmptyRow = styled.tr`
  td {
    padding: 20px;
    text-align: center;
    color: #6b7280;
    font-style: italic;
  }
`;

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/appointments/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📋 Appointments:", res.data);
        setAppointments(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử:", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Wrapper>
      <Title>Lịch sử đặt khám</Title>
      <Table>
        <thead>
          <tr>
            <Th>Ngày</Th>
            <Th>Buổi</Th>
            <Th>Dịch vụ / Gói</Th>
            <Th>Bác sĩ</Th>
            <Th>Trạng thái</Th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <EmptyRow>
              <td colSpan="5">Không có lịch hẹn nào.</td>
            </EmptyRow>
          ) : (
            appointments.map((item) => (
              <tr key={item.id}>
                <Td>{dayjs(item.appointment_date).format("DD/MM/YYYY")}</Td>
                <Td>{item.appointment_time || "—"}</Td>
                <Td>{item.service?.title || item.service_package?.name || "—"}</Td>
                <Td>{item.doctor?.name || "—"}</Td>
                <Td>
                  <Status status={item.status}>{item.status}</Status>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default AppointmentHistory;
