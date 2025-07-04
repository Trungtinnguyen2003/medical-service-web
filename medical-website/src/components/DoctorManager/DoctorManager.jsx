import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Content = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #f8fafc;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
`;

const Th = styled.th`
  background-color: #f3f4f6;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
  color: white;
  background-color: ${({ status }) =>
    status === "confirmed"
      ? "#10b981"
      : status === "pending"
      ? "#f59e0b"
      : "#ef4444"};
`;

const DoctorManager = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/appointments/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch khám:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/appointments/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Cập nhật trạng thái thành công");
      fetchAppointments();
    } catch (err) {
      alert("❌ Lỗi khi cập nhật trạng thái");
      console.error(err);
    }
  };

  return (
    <Content>
      <Title>Lịch hẹn của tôi</Title>
      <Table>
        <thead>
          <tr>
            <Th>Họ tên</Th>
            <Th>Email</Th>
            <Th>Điện thoại</Th>
            <Th>Giới tính</Th>
            <Th>Ngày sinh</Th>
            <Th>Địa chỉ</Th>
            <Th>Ngày</Th>
            <Th>Giờ</Th>
            <Th>Triệu chứng</Th>
            <Th>Dịch vụ</Th>
            <Th>Gói</Th>
            <Th>Trạng thái</Th>
          </tr>
        </thead>
        <tbody>
  {appointments.map((a) => (
    <tr key={a.id}>
      <Td>{a.name || a.user?.name || "--"}</Td>
      <Td>{a.email || a.user?.email || "--"}</Td>
      <Td>{a.phone || a.user?.phone || "--"}</Td>
      <Td>{a.gender || a.user?.gender || "--"}</Td>
      <Td>{a.date_of_birth || a.user?.date_of_birth || "--"}</Td>
      <Td>{a.address || a.user?.address || "--"}</Td>
      <Td>{a.appointment_date}</Td>
      <Td>{a.appointment_time}</Td>
      <Td>{a.symptoms || "--"}</Td>
      <Td>{a.service?.title || "--"}</Td>
      <Td>{a.servicePackage?.name || "--"}</Td>
      <Td>
        {a.status === "pending" ? (
          <>
            <button onClick={() => updateStatus(a.id, "done")}>
              ✅ Đã khám
            </button>
            <button onClick={() => updateStatus(a.id, "cancelled")}>
              ❌ Hủy
            </button>
          </>
        ) : (
          <Status status={a.status}>{a.status}</Status>
        )}
      </Td>
    </tr>
  ))}
</tbody>

      </Table>
    </Content>
  );
};

export default DoctorManager;
