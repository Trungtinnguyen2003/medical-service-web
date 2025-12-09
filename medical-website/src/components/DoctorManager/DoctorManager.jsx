// src/components/Doctor/DoctorManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ClinicalExamModal from "../Doctor/ClinicalExamModal";
import PrescriptionDetail from "../../components/PrescriptionDetail/PrescriptionDetail"; // ⭐ thêm dòng này
import ClsResultDetail from "../Doctor/ClsResultDetail";

/* ========================= STYLE ========================= */
const PageWrapper = styled.div`
  flex: 1;
  padding: 32px;
  background: #f4f7fb;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 22px;
  color: #1e293b;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
`;

const Th = styled.th`
  padding: 12px;
  background: #eef2ff;
  color: #312e81;
  font-weight: 600;
  border-bottom: 2px solid #c7d2fe;
  position: sticky;
  top: 0;
  z-index: 5;
`;

const Td = styled.td`
  padding: 16px 14px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
`;

const GroupTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 10px 0 4px;
`;

const InfoItem = styled.div`
  font-size: 13px;
  color: #475569;
  margin-bottom: 4px;

  span {
    color: #1e293b;
    font-weight: 500;
  }
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
  background: ${({ status }) =>
    status === "confirmed"
      ? "#10b981"
      : status === "pending"
      ? "#f59e0b"
      : status === "done"
      ? "#2563eb"
      : "#ef4444"};
`;

const ActionButton = styled.button`
  background: ${({ danger }) => (danger ? "#ef4444" : "#4f46e5")};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 6px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    opacity: 0.9;
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 24px;
  color: #6b7280;
`;

/* ========================= COMPONENT ========================= */

const DoctorManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null); // ⭐ để xem toa thuốc
  const [selectedCls, setSelectedCls] = useState(null);

  const [selectedAppointment, setSelectedAppointment] = useState(null);   // ⭐ để khám

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
      alert("Cập nhật trạng thái thành công");
      fetchAppointments();
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái");
      console.error(err);
    }
  };

  return (
    <PageWrapper>
      <Title >Lịch hẹn của tôi</Title>

      <Card>
        <div style={{ maxHeight: "72vh", overflow: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Hồ sơ bệnh nhân</Th>
                <Th>Ngày khám</Th>
                <Th>Giờ</Th>
                <Th>Dịch vụ</Th>
                <Th>Đơn thuốc</Th>
                <Th>Trạng thái / Hành động</Th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <Td colSpan="6">
                    <Empty>Không có lịch hẹn nào</Empty>
                  </Td>
                </tr>
              ) : (
                appointments.map((a, i) => {
                  const p = a.patientProfile;

                  return (
                    <React.Fragment key={a.id}>
                      <tr
                        style={{ background: i % 2 ? "#fafafa" : "#ffffff" }}
                      >
                        {/* ===================== HỒ SƠ BỆNH NHÂN ====================== */}
                        <Td>
                          <GroupTitle>🧑 Thông tin cá nhân</GroupTitle>
                          <InfoItem>Họ tên: <span>{p?.full_name || "--"}</span></InfoItem>
                          <InfoItem>Giới tính: <span>{p?.gender || "--"}</span></InfoItem>
                          <InfoItem>Ngày sinh: <span>{p?.date_of_birth || "--"}</span></InfoItem>
                          <InfoItem>Quan hệ: <span>{p?.relationship || "--"}</span></InfoItem>

                          <GroupTitle>📞 Liên hệ</GroupTitle>
                          <InfoItem>SĐT: <span>{p?.phone || "--"}</span></InfoItem>
                          <InfoItem>Địa chỉ: <span>{p?.address || "--"}</span></InfoItem>

                          <GroupTitle>🪪 Giấy tờ</GroupTitle>
                          <InfoItem>Loại: <span>{p?.id_type || "--"}</span></InfoItem>
                          <InfoItem>Số: <span>{p?.id_number || "--"}</span></InfoItem>
                          <InfoItem>Quốc tịch: <span>{p?.nationality || "--"}</span></InfoItem>
                          <InfoItem>Dân tộc: <span>{p?.ethnicity || "--"}</span></InfoItem>

                          <GroupTitle>📄 Khác</GroupTitle>
                          <InfoItem>Nghề nghiệp: <span>{p?.job || "--"}</span></InfoItem>

                          {a.symptoms && (
                            <InfoItem>Triệu chứng: <span>{a.symptoms}</span></InfoItem>
                          )}
                        </Td>

                        <Td>{a.appointment_date}</Td>
                        <Td>{a.appointment_time}</Td>
                        <Td>{a.bookedService?.title || "--"}</Td>

                        {/* ===================== ĐƠN THUỐC ====================== */}
                        <Td>
  {a.status === "done" ? (
    <>
      <ActionButton onClick={() => setSelectedPrescription(a.id)}>
        Xem đơn thuốc
      </ActionButton>

      <ActionButton onClick={() => setSelectedCls(a.id)}>
        Xem CLS
      </ActionButton>
    </>
  ) : (
    <span style={{ color: "#94a3b8", fontSize: 13 }}>
      Chưa kê đơn
    </span>
  )}
</Td>


                        {/* ===================== ACTION ====================== */}
                        <Td>
                          {a.status === "confirmed" ? (
                            <>
                              <ActionButton
                                onClick={() => setSelectedAppointment(a)}
                              >
                                🩺 Khám
                              </ActionButton>

                              <ActionButton
                                danger
                                onClick={() => updateStatus(a.id, "cancelled")}
                              >
                                Hủy
                              </ActionButton>
                            </>
                          ) : (
                            <Status status={a.status}>{a.status}</Status>
                          )}
                        </Td>
                      </tr>

                      {/* ===================== HIỆN ĐƠN THUỐC BÊN DƯỚI ====================== */}
                      {selectedPrescription === a.id && (
                        <tr>
                          <Td colSpan="6">
                            <PrescriptionDetail appointmentId={a.id} />
                          </Td>
                        </tr>
                      )}
                      {selectedCls === a.id && (
  <tr>
    <Td colSpan="6">
      <ClsResultDetail appointmentId={a.id} />
    </Td>
  </tr>
)}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </Card>

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

      
    </PageWrapper>
  );
};

export default DoctorManager;
