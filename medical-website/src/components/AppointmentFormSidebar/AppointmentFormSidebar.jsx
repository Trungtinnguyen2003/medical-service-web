import React, { useEffect, useState } from "react";
import { Wrapper, Title, Input, Select, Button } from "./style";
import departmentService from "../../services/departmentService";
import doctorService from "../../services/doctorService";
import appointmentService from "../../services/appointmentService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppointmentFormSidebar = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    appointment_date: "",
    department_id: "",
    doctor_id: "",
    slot_id: "",
    symptoms: "",
  });

  const navigate = useNavigate();

  // 🏥 Lấy danh sách chuyên khoa
  useEffect(() => {
    departmentService.getAll().then(setDepartments);
  }, []);

  // 👨‍⚕️ Lấy danh sách bác sĩ theo chuyên khoa
  useEffect(() => {
    if (formData.department_id) {
      doctorService
        .getByDepartment(formData.department_id)
        .then((res) => {
          setDoctors(res);
          setFormData((prev) => ({ ...prev, doctor_id: "", slot_id: "" }));
        })
        .catch((err) => console.error("❌ Lỗi lấy bác sĩ:", err));
    } else {
      setDoctors([]);
    }
  }, [formData.department_id]);

  // ⏰ Lấy khung giờ bác sĩ trực trong ngày đã chọn
  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date) {
      setLoadingSlots(true);
      axios
        .get(
          `http://localhost:5000/doctors/${formData.doctor_id}/available-slots?date=${formData.appointment_date}`
        )
        .then((res) => {
          setAvailableSlots(res.data);
          setLoadingSlots(false);
        })
        .catch((err) => {
          console.error("❌ Lỗi lấy khung giờ:", err);
          setLoadingSlots(false);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [formData.doctor_id, formData.appointment_date]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🩺 Gửi form đặt lịch
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để đặt lịch");
      navigate("/login");
      return;
    }

    if (!formData.slot_id) {
      alert("Vui lòng chọn khung giờ khám");
      return;
    }

    try {
      await appointmentService.create(formData);
      alert("✅ Đặt lịch thành công!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
        appointment_date: "",
        department_id: "",
        doctor_id: "",
        slot_id: "",
        symptoms: "",
      });
      setDoctors([]);
      setAvailableSlots([]);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  const morningSlots = availableSlots.filter((s) => s.period === "morning");
  const afternoonSlots = availableSlots.filter((s) => s.period === "afternoon");

  return (
    <Wrapper>
      <Title>Đặt lịch khám</Title>

      <Select
        name="department_id"
        onChange={handleChange}
        value={formData.department_id}
      >
        <option value="">Chọn chuyên khoa</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </Select>

      <Select
        name="doctor_id"
        onChange={handleChange}
        value={formData.doctor_id}
        disabled={!formData.department_id}
      >
        <option value="">Chọn bác sĩ</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </Select>

      <Input
        name="name"
        placeholder="Họ tên"
        onChange={handleChange}
        value={formData.name}
      />
      <Input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
      />
      <Input
        name="phone"
        placeholder="Số điện thoại"
        onChange={handleChange}
        value={formData.phone}
      />
      <Select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Giới tính</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </Select>

      <Input
        name="date_of_birth"
        type="date"
        value={formData.date_of_birth}
        onChange={handleChange}
      />
      <Input
        name="address"
        placeholder="Địa chỉ"
        onChange={handleChange}
        value={formData.address}
      />
      <Input
        name="appointment_date"
        type="date"
        value={formData.appointment_date}
        onChange={handleChange}
      />

      {/* Khung giờ bác sĩ trực */}
      {formData.doctor_id && formData.appointment_date && (
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontWeight: 600, color: "#334155" }}>⏰ Chọn khung giờ:</p>
          {loadingSlots ? (
            <p style={{ color: "#666" }}>Đang tải khung giờ...</p>
          ) : availableSlots.length === 0 ? (
            <p style={{ color: "#666" }}>Không có khung giờ trống.</p>
          ) : (
            <>
              {morningSlots.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ color: "#3b82f6", fontWeight: 500 }}>🌤 Buổi sáng</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {morningSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, slot_id: slot.id }))
                        }
                        style={{
                          padding: "5px 10px",
                          borderRadius: 20,
                          border: "1px solid #ccc",
                          background:
                            formData.slot_id === slot.id
                              ? "#3b82f6"
                              : "white",
                          color:
                            formData.slot_id === slot.id ? "white" : "#333",
                          cursor: "pointer",
                        }}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {afternoonSlots.length > 0 && (
                <div>
                  <p style={{ color: "#3b82f6", fontWeight: 500 }}>☀️ Buổi chiều</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {afternoonSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, slot_id: slot.id }))
                        }
                        style={{
                          padding: "5px 10px",
                          borderRadius: 20,
                          border: "1px solid #ccc",
                          background:
                            formData.slot_id === slot.id
                              ? "#3b82f6"
                              : "white",
                          color:
                            formData.slot_id === slot.id ? "white" : "#333",
                          cursor: "pointer",
                        }}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Input
        name="symptoms"
        placeholder="Triệu chứng, tình trạng..."
        onChange={handleChange}
        value={formData.symptoms}
      />

      <Button onClick={handleSubmit}>Gửi yêu cầu</Button>
    </Wrapper>
  );
};

export default AppointmentFormSidebar;
