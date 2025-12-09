// src/pages/AuthPage/AppointmentHistoryPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import dayjs from "dayjs";
import PrescriptionDetail from "../../components/PrescriptionDetail/PrescriptionDetail";
// import ClsResultDetailPatient from "../../components/Doctor/ClsResultDetailPatient";
import ClsResultDetail from "../../components/Doctor/ClsResultDetail";


// ============ LAYOUT CHUNG ============

const Wrapper = styled.div`
  display: flex;
  padding: 24px;
  gap: 24px;
`;

const Sidebar = styled.div`
  width: 260px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarItem = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  color: ${(p) => (p.active ? "#0284c7" : "#000")};
  background: ${(p) => (p.active ? "#e0f2fe" : "transparent")};
  &:hover {
    background: #f1f5f9;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 12px;
`;

// ============ TAB PHIẾU KHÁM ============

const TabRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Tab = styled.div`
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
  background: ${(p) => (p.active ? "#0284c7" : "#e5e7eb")};
  color: ${(p) => (p.active ? "white" : "#374151")};
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

const Th = styled.th`
  padding: 12px;
  background: #f3f4f6;
  font-weight: 600;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  text-transform: capitalize;
  background: ${(p) =>
    p.s === "done"
      ? "#3b82f6"
      : p.s === "confirmed"
      ? "#10b981"
      : p.s === "cancelled"
      ? "#ef4444"
      : "#f59e0b"};
`;

// ============ HỒ SƠ BỆNH NHÂN ============

const ProfileCard = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  box-shadow: rgba(149, 157, 165, 0.12) 0px 8px 24px;
`;

const ProfileRow = styled.div`
  font-size: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #374151;

  span.label {
    min-width: 120px;
    color: #6b7280;
  }

  b {
    color: #111827;
    margin-left: 4px;
  }

  i {
    margin-right: 10px;
    font-size: 16px;
    color: #6b7280;
    width: 18px;
    text-align: center;
  }
`;

const FooterActions = styled.div`
  border-top: 1px solid #e5e7eb;
  margin-top: 16px;
  padding-top: 12px;
  display: flex;
  gap: 20px;
  font-size: 15px;
`;

const FooterBtn = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  color: ${(p) => (p.danger ? "red" : p.blue ? "#0284c7" : "#374151")};

  &:hover {
    text-decoration: underline;
  }

  i {
    font-size: 14px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  margin-top: 40px;
`;

// ============ MODAL POPUP ============

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  width: 620px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 18px;
  padding: 24px 24px 20px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #111827;
  }
`;

const ModalBody = styled.div`
  margin-top: 8px;
`;

// ============ FORM TRONG MODAL ============

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1.1fr;
  gap: 14px 18px;
  margin-top: 8px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const Label = styled.label`
  margin-bottom: 4px;
  color: #4b5563;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18);
  }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18);
  }
`;

const ModalActions = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }
`;

const SecondaryButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;

const TopActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px 0 16px;
`;

const AddProfileBtn = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: #059669;
  color: #ffffff;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  i {
    font-size: 13px;
  }

  &:hover {
    background: #047857;
  }
`;

// ============ COMPONENT CHÍNH ============

const AppointmentHistoryPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [tab, setTab] = useState("paid");
  const [activeMenu, setActiveMenu] = useState("appointments"); // 'profiles' | 'appointments'

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'view'
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Nam",
    phone: "",
    job: "",
    id_type: "CCCD",
    id_number: "",
    nationality: "Việt Nam",
    ethnicity: "",
    address: "",
    relationship: "self",
    old_address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ====== API: LẤY LỊCH HẸN ======
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Lỗi lấy lịch hẹn:", err);
    }
  };

  // ====== API: LẤY HỒ SƠ CỦA USER ======
  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/patient-profiles/my-profiles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfiles(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy hồ sơ bệnh nhân:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchProfiles();
  }, []);

  // ====== LỌC LỊCH THEO TAB ======
  const filterList = appointments.filter((a) => {
    if (tab === "paid") return a.status === "confirmed"; // Đã xác nhận
    if (tab === "unpaid") return a.status === "pending"; // Đã đặt
    if (tab === "done") return a.status === "done"; // Đã khám
    if (tab === "cancelled") return a.status === "cancelled"; // Đã hủy
    return true;
  });

  // ====== HANDLER POPUP + FORM ======

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedProfile(null);
    setProfileForm({
      full_name: "",
      date_of_birth: "",
      gender: "Nam",
      phone: "",
      job: "",
      id_type: "CCCD",
      id_number: "",
      nationality: "Việt Nam",
      ethnicity: "",
      address: "",
      relationship: "self",
      old_address: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (profile) => {
    setModalMode("edit");
    setSelectedProfile(profile);
    setProfileForm({
      full_name: profile.full_name || "",
      date_of_birth: profile.date_of_birth || "",
      gender: profile.gender || "Nam",
      phone: profile.phone || "",
      job: profile.job || "",
      id_type: profile.id_type || "CCCD",
      id_number: profile.id_number || "",
      nationality: profile.nationality || "Việt Nam",
      ethnicity: profile.ethnicity || "",
      address: profile.address || "",
      relationship: profile.relationship || "self",
      old_address: profile.old_address || "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (profile) => {
    setModalMode("view");
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (modalMode === "view") return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (modalMode === "create") {
        await axios.post(
          "http://localhost:5000/api/patient-profiles",
          profileForm,
          config
        );
      } else if (modalMode === "edit" && selectedProfile) {
        await axios.put(
          `http://localhost:5000/api/patient-profiles/${selectedProfile.id}`,
          profileForm,
          config
        );
      }

      await fetchProfiles();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi lưu hồ sơ:", err);
      alert("Không thể lưu hồ sơ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async (profile) => {
    const confirm = window.confirm(
      `Bạn có chắc muốn xóa hồ sơ "${profile.full_name}"?`
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/patient-profiles/${profile.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    } catch (err) {
      console.error("Lỗi xóa hồ sơ:", err);
      alert("Không thể xóa hồ sơ. Vui lòng thử lại.");
    }
  };

  // ========== RENDER ==========

  return (
    <>
      <Wrapper>
        {/* Sidebar */}
        <Sidebar style={{ marginTop: "60px" }}>
          <SidebarItem
            onClick={() => setActiveMenu("profiles")}
            active={activeMenu === "profiles"}
          >
            📄 Hồ sơ bệnh nhân
          </SidebarItem>

          <SidebarItem
            onClick={() => setActiveMenu("appointments")}
            active={activeMenu === "appointments"}
          >
            🧾 Phiếu khám bệnh
          </SidebarItem>

          <SidebarItem>🔔 Thông báo</SidebarItem>
        </Sidebar>

        {/* Content */}
        <Content>
          {activeMenu === "profiles" ? (
            <>
              <Title>Danh sách hồ sơ bệnh nhân</Title>

              <TopActionsRow>
                <AddProfileBtn onClick={openCreateModal} style={{ marginTop: "20px" }}>
                  <i className="fa-solid fa-plus"></i>
                  Thêm hồ sơ
                </AddProfileBtn>
              </TopActionsRow>

              {profiles.length === 0 ? (
                <EmptyMessage>Bạn chưa có hồ sơ bệnh nhân nào.</EmptyMessage>
              ) : (
                profiles.map((p) => (
                  <ProfileCard key={p.id}>
                    <ProfileRow>
                      <i className="fa-solid fa-user"></i>
                      <span className="label">Họ và tên:</span>{" "}
                      <b>{p.full_name}</b>
                    </ProfileRow>

                    <ProfileRow>
                      <i className="fa-solid fa-cake-candles"></i>
                      <span className="label">Ngày sinh:</span>{" "}
                      <b>{p.date_of_birth}</b>
                    </ProfileRow>

                    <ProfileRow>
                      <i className="fa-solid fa-venus-mars"></i>
                      <span className="label">Giới tính:</span>{" "}
                      <b>{p.gender}</b>
                    </ProfileRow>

                    <ProfileRow>
                      <i className="fa-solid fa-phone"></i>
                      <span className="label">Số điện thoại:</span>{" "}
                      <b>{p.phone}</b>
                    </ProfileRow>

                    {/* <ProfileRow>
                      <i className="fa-solid fa-people-group"></i>
                      <span className="label">Mối quan hệ:</span>{" "}
                      <b>{p.relationship || "self"}</b>
                    </ProfileRow> */}

                    <ProfileRow>
                      <i className="fa-solid fa-briefcase"></i>
                      <span className="label">Nghề nghiệp:</span>{" "}
                      <b>{p.job || "Chưa cập nhật"}</b>
                    </ProfileRow>

                    <ProfileRow>
                      <i className="fa-solid fa-id-card"></i>
                      <span className="label">Giấy tờ tùy thân:</span>{" "}
                      <b>
                        {p.id_type || "CCCD"} {p.id_number ? `- ${p.id_number}` : ""}
                      </b>
                    </ProfileRow>

                    <ProfileRow>
                      <i className="fa-solid fa-earth-asia"></i>
                      <span className="label">Quốc tịch:</span>{" "}
                      <b>{p.nationality || "Việt Nam"}</b>
                    </ProfileRow>

                    <ProfileRow>
                      <i className="fa-solid fa-users"></i>
                      <span className="label">Dân tộc:</span>{" "}
                      <b>{p.ethnicity || "Kinh"}</b>
                    </ProfileRow>

                    <ProfileRow>
                      <i className="fa-solid fa-location-dot"></i>
                      <span className="label">Địa chỉ:</span>{" "}
                      <b>{p.address}</b>
                    </ProfileRow>

                    {p.old_address && (
                      <ProfileRow style={{ opacity: 0.8, fontStyle: "italic" }}>
                        <i className="fa-solid fa-location-arrow"></i>
                        <span className="label">Địa chỉ cũ:</span>{" "}
                        <b>{p.old_address}</b>
                      </ProfileRow>
                    )}

                    <FooterActions>
                      <FooterBtn danger onClick={() => handleDeleteProfile(p)}>
                        <i className="fa-solid fa-trash"></i>
                        Xóa hồ sơ
                      </FooterBtn>

                      <FooterBtn blue onClick={() => openEditModal(p)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        Sửa hồ sơ
                      </FooterBtn>

                      <FooterBtn onClick={() => openViewModal(p)}>
                        <i className="fa-solid fa-circle-info"></i>
                        Chi tiết
                      </FooterBtn>
                    </FooterActions>
                  </ProfileCard>
                ))
              )}
            </>
          ) : (
            <>
              <Title>Danh sách phiếu khám bệnh</Title>

              <TabRow style={{ marginTop: "30px" }}>
                <Tab active={tab === "paid"} onClick={() => setTab("paid")}>
                  Đã xác nhận
                </Tab>
                <Tab active={tab === "unpaid"} onClick={() => setTab("unpaid")}>
                  Đã đặt
                </Tab>
                <Tab active={tab === "done"} onClick={() => setTab("done")}>
                  Đã khám
                </Tab>
                <Tab
                  active={tab === "cancelled"}
                  onClick={() => setTab("cancelled")}
                >
                  Đã hủy
                </Tab>
              </TabRow>

              <Table>
                <thead>
                  <tr>
                    <Th>Ngày</Th>
                    <Th>Giờ</Th>
                    <Th>Hồ sơ</Th>
                    <Th>Dịch vụ</Th>
                    <Th>Bác sĩ</Th>
                    <Th>Trạng thái</Th>
                  </tr>
                </thead>
                <tbody>
                  {filterList.map((a) => (
                    <React.Fragment key={a.id}>
                      <tr>
                        <Td>
                          {dayjs(a.appointment_date).format("DD/MM/YYYY")}
                        </Td>
                        <Td>{a.appointment_time}</Td>
                        <Td>{a.patientProfile?.full_name}</Td>
                        <Td>{a.service?.title || a.servicePackage?.name}</Td>
                        <Td>{a.doctor?.name}</Td>
                        <Td>
                          <Status s={a.status}>{a.status}</Status>
                        </Td>
                      </tr>

                      {a.status === "done" && (
  <tr>
    <Td colSpan={6}>
      <div
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          padding: "20px 24px",
          background: "#ffffff",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1e3a8a",
            marginBottom: "12px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "6px",
          }}
        >
          💊 Toa Thuốc & Chẩn đoán Tổng Quát
        </h3>

        <PrescriptionDetail appointmentId={a.id} />
      </div>
    </Td>
  </tr>
)}

{a.status === "done" && (
  <tr>
    <Td colSpan={6}>
      <div
        style={{
          marginTop: "-8px",
          padding: "20px 24px",
          background: "#ffffff",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#0369a1",
            marginBottom: "12px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "6px",
          }}
        >
          🧪 Thông Tin Tống Quát Cận Lâm Sàng
        </h3>

        <ClsResultDetail appointmentId={a.id} />
      </div>
    </Td>
  </tr>
)}


                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Content>
      </Wrapper>

      {/* MODAL THÊM / SỬA / CHI TIẾT HỒ SƠ */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalBox>
            <ModalHeader>
              <ModalTitle>
                {modalMode === "create"
                  ? "Thêm hồ sơ bệnh nhân"
                  : modalMode === "edit"
                  ? "Chỉnh sửa hồ sơ bệnh nhân"
                  : "Chi tiết hồ sơ bệnh nhân"}
              </ModalTitle>
              <CloseBtn onClick={closeModal}>&times;</CloseBtn>
            </ModalHeader>

            <ModalBody>
              {modalMode === "view" && selectedProfile ? (
                <>
                  <ProfileRow>
                    <i className="fa-solid fa-user"></i>
                    <span className="label">Họ và tên:</span>{" "}
                    <b>{selectedProfile.full_name}</b>
                  </ProfileRow>
                  <ProfileRow>
                    <i className="fa-solid fa-cake-candles"></i>
                    <span className="label">Ngày sinh:</span>{" "}
                    <b>{selectedProfile.date_of_birth}</b>
                  </ProfileRow>
                  <ProfileRow>
                    <i className="fa-solid fa-venus-mars"></i>
                    <span className="label">Giới tính:</span>{" "}
                    <b>{selectedProfile.gender}</b>
                  </ProfileRow>
                  <ProfileRow>
                    <i className="fa-solid fa-phone"></i>
                    <span className="label">Số điện thoại:</span>{" "}
                    <b>{selectedProfile.phone}</b>
                  </ProfileRow>
                  {/* <ProfileRow>
                    <i className="fa-solid fa-people-group"></i>
                    <span className="label">Mối quan hệ:</span>{" "}
                    <b>{selectedProfile.relationship || "self"}</b>
                  </ProfileRow> */}
                  <ProfileRow>
                    <i className="fa-solid fa-briefcase"></i>
                    <span className="label">Nghề nghiệp:</span>{" "}
                    <b>{selectedProfile.job || "Chưa cập nhật"}</b>
                  </ProfileRow>
                  <ProfileRow>
                    <i className="fa-solid fa-id-card"></i>
                    <span className="label">Giấy tờ tùy thân:</span>{" "}
                    <b>
                      {selectedProfile.id_type || "CCCD"}{" "}
                      {selectedProfile.id_number
                        ? `- ${selectedProfile.id_number}`
                        : ""}
                    </b>
                  </ProfileRow>
                  <ProfileRow>
                    <i className="fa-solid fa-earth-asia"></i>
                    <span className="label">Quốc tịch:</span>{" "}
                    <b>{selectedProfile.nationality || "Việt Nam"}</b>
                  </ProfileRow>
                  <ProfileRow>
                    <i className="fa-solid fa-users"></i>
                    <span className="label">Dân tộc:</span>{" "}
                    <b>{selectedProfile.ethnicity || "Kinh"}</b>
                  </ProfileRow>
                  <ProfileRow>
                    <i className="fa-solid fa-location-dot"></i>
                    <span className="label">Địa chỉ:</span>{" "}
                    <b>{selectedProfile.address}</b>
                  </ProfileRow>
                  {selectedProfile.old_address && (
                    <ProfileRow
                      style={{ opacity: 0.8, fontStyle: "italic" }}
                    >
                      <i className="fa-solid fa-location-arrow"></i>
                      <span className="label">Địa chỉ cũ:</span>{" "}
                      <b>{selectedProfile.old_address}</b>
                    </ProfileRow>
                  )}
                  <ModalActions>
                    <SecondaryButton onClick={closeModal}>
                      Đóng
                    </SecondaryButton>
                  </ModalActions>
                </>
              ) : (
                <form onSubmit={handleSubmitProfile}>
                  <FormGrid>
                    <FormGroup>
                      <Label>Họ và tên</Label>
                      <Input
                        name="full_name"
                        value={profileForm.full_name}
                        onChange={handleProfileChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Ngày sinh</Label>
                      <Input
                        type="date"
                        name="date_of_birth"
                        value={profileForm.date_of_birth || ""}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Giới tính</Label>
                      <Select
                        name="gender"
                        value={profileForm.gender}
                        onChange={handleProfileChange}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Số điện thoại</Label>
                      <Input
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>

                    {/* <FormGroup>
                      <Label>Mối quan hệ</Label>
                      <Select
                        name="relationship"
                        value={profileForm.relationship}
                        onChange={handleProfileChange}
                      >
                        <option value="self">Bản thân</option>
                        <option value="parent">Cha / Mẹ</option>
                        <option value="child">Con</option>
                        <option value="other">Khác</option>
                      </Select>
                    </FormGroup> */}

                    <FormGroup>
                      <Label>Nghề nghiệp</Label>
                      <Input
                        name="job"
                        value={profileForm.job}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Loại giấy tờ</Label>
                      <Select
                        name="id_type"
                        value={profileForm.id_type}
                        onChange={handleProfileChange}
                      >
                        <option value="CCCD">CCCD / CMND</option>
                        <option value="PASSPORT">Hộ chiếu</option>
                        <option value="OTHER">Khác</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Số giấy tờ</Label>
                      <Input
                        name="id_number"
                        value={profileForm.id_number}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Quốc tịch</Label>
                      <Input
                        name="nationality"
                        value={profileForm.nationality}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Dân tộc</Label>
                      <Input
                        name="ethnicity"
                        value={profileForm.ethnicity}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>

                    <FormGroup style={{ gridColumn: "1 / -1" }}>
                      <Label>Địa chỉ hiện tại</Label>
                      <Input
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>

                    <FormGroup style={{ gridColumn: "1 / -1" }}>
                      <Label>Địa chỉ cũ (nếu có)</Label>
                      <Input
                        name="old_address"
                        value={profileForm.old_address}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>
                  </FormGrid>

                  <ModalActions>
                    <SecondaryButton type="button" onClick={closeModal}>
                      Hủy
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={submitting}>
                      {submitting
                        ? "Đang lưu..."
                        : modalMode === "create"
                        ? "Thêm hồ sơ"
                        : "Lưu thay đổi"}
                    </PrimaryButton>
                  </ModalActions>
                </form>
              )}
            </ModalBody>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  );
};

export default AppointmentHistoryPage;
