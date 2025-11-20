// src/components/Doctor/DoctorManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ClinicalExamModal from "../Doctor/ClinicalExamModal";


const Content = styled.div`
  flex: 1;
  padding: 25px;
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
  position: sticky;
  top: 0;
  z-index: 1;
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
      : status === "done"
      ? "#3b82f6"
      : "#ef4444"};
  text-transform: capitalize;
`;

const DoctorManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/appointments/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy lịch khám:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/appointments/doctor/${id}/status`,
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
      <Title style={{ marginTop: "40px" }}>Lịch hẹn của tôi</Title>

      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
        <div style={{ maxHeight: "70vh", overflow: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Họ tên</Th>
                {/* <Th>Email</Th> */}
                <Th>Điện thoại</Th>
                <Th>Giới tính</Th>
                <Th>Ngày sinh</Th>
                <Th>Địa chỉ</Th>
                <Th>Ngày</Th>
                <Th>Giờ</Th>
                {/* <Th>Triệu chứng</Th> */}
                <Th>Dịch vụ</Th>
                {/* <Th>Gói</Th> */}
                <Th>Trạng thái / Hành độngg</Th>
              </tr>
            </thead>
            <tbody>
  {appointments.map((a, i) => {
    const p = a.patientProfile; // profile mới

    return (
      <tr key={a.id} style={{ background: i % 2 ? "#fafafa" : "#ffffff" }}>
        {/* HỌ TÊN */}
        <Td style={{ fontWeight: 600, color: "#4f46e5" }}>
          {p?.full_name || "--"}
        </Td>

        {/* EMAIL (không có email trong hồ sơ → để trống) */}
        {/* <Td>{a.user?.email || "--"}</Td> */}

        {/* SĐT */}
        <Td>{p?.phone || "--"}</Td>

        {/* GIỚI TÍNH */}
        <Td>{p?.gender || "--"}</Td>

        {/* NGÀY SINH */}
        <Td>{p?.date_of_birth || "--"}</Td>

        {/* ĐỊA CHỈ */}
        <Td>{p?.address || "--"}</Td>

        {/* NGÀY */}
        <Td>{a.appointment_date}</Td>

        {/* GIỜ */}
        <Td>{a.appointment_time}</Td>

        {/* TRIỆU CHỨNG */}
        {/* <Td>{a.symptoms || "--"}</Td> */}

        {/* DỊCH VỤ */}
        <Td>{a.bookedService?.title || "--"}</Td>

        {/* GÓI */}
        {/* <Td>{a.servicePackage?.name || "--"}</Td> */}

        {/* ACTION */}
        <Td>
          {a.status === "confirmed" ? (
            <>
              <button
                onClick={() => setSelectedAppointment(a)}
                style={{
                  marginRight: 6,
                  background: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                🩺 Khám
              </button>

              <button
                onClick={() => updateStatus(a.id, "cancelled")}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                ❌ Hủy
              </button>
            </>
          ) : (
            <Status status={a.status}>{a.status}</Status>
          )}
        </Td>
      </tr>
    );
  })}

  {appointments.length === 0 && (
    <tr>
      <Td
        colSpan="12"
        style={{
          textAlign: "center",
          color: "#6b7280",
          padding: 24,
        }}
      >
        Chưa có lịch hẹn
      </Td>
    </tr>
  )}
</tbody>

          </Table>
        </div>
      </div>

      {/* Modal Khám lâm sàng */}
      {selectedAppointment && (
        <ClinicalExamModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onDone={() => {
            setSelectedAppointment(null);
            fetchAppointments();
          }}
        />
      )}
    </Content>
  );
};

export default DoctorManager;
