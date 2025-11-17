import React, { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";
import doctorService from "../../services/doctorService";
import appointmentService from "../../services/appointmentService";
import axios from "axios";
import CalendarPicker from "./CalendarPicker";

import { useNavigate } from "react-router-dom";

import {
  SubHeader, Header, InputRow, InputGroup,
  Input, Select, Button, Icon
} from "./style";

const ServiceBookingForm = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", gender: "",
    date_of_birth: "", address: "", appointment_date: "",
    department_id: "", doctor_id: "", slot_id: "", symptoms: ""
  });

  const navigate = useNavigate();
  
  // 🏥 Lấy danh sách chuyên khoa
  useEffect(() => {
    departmentService.getAll().then(setDepartments);
  }, []);

  // 👨‍⚕️ Lấy danh sách bác sĩ theo khoa
  useEffect(() => {
    if (formData.department_id) {
      doctorService.getByDepartment(formData.department_id)
        .then((res) => {
          setDoctors(res);
          setFormData((prev) => ({ ...prev, doctor_id: "", slot_id: "" }));
        })
        .catch((err) => console.error("❌ Lỗi lấy bác sĩ:", err));
    } else {
      setDoctors([]);
    }
  }, [formData.department_id]);


  
  // ⏰ Lấy danh sách khung giờ bác sĩ trực trong ngày đã chọn
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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
        name: "", email: "", phone: "", gender: "",
        date_of_birth: "", address: "", appointment_date: "",
        department_id: "", doctor_id: "", slot_id: "", symptoms: ""
      });
      setDoctors([]);
      setAvailableSlots([]);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  // 🕒 Tách buổi sáng / buổi chiều
  const morningSlots = availableSlots.filter((s) => s.period === "morning");
  const afternoonSlots = availableSlots.filter((s) => s.period === "afternoon");

  return (
    <>
      <SubHeader>Đặt dịch vụ lẻ</SubHeader>
      <Header>Gặp bác sĩ chuyên khoa</Header>

      {/* Chọn khoa & bác sĩ */}
      <InputRow>
        <InputGroup>
          <Select name="department_id" onChange={handleChange} value={formData.department_id}>
            <option value="">Chọn chuyên khoa</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </Select>
        </InputGroup>

        <InputGroup>
          <Select
            name="doctor_id"
            onChange={handleChange}
            value={formData.doctor_id}
            disabled={!formData.department_id}
          >
            <option value="">Chọn bác sĩ</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </Select>
        </InputGroup>
      </InputRow>

      {/* Họ tên / email */}
      <InputRow>
        <InputGroup><Input name="name" placeholder="Họ tên" onChange={handleChange} value={formData.name} /><Icon>👤</Icon></InputGroup>
        <InputGroup><Input name="email" placeholder="Email" onChange={handleChange} value={formData.email} /><Icon>📧</Icon></InputGroup>
      </InputRow>

      {/* SĐT / Ngày sinh / Giới tính */}
      <InputRow>
        <InputGroup><Input name="phone" placeholder="SĐT" onChange={handleChange} value={formData.phone} /><Icon>📞</Icon></InputGroup>
        <InputGroup><Input name="date_of_birth" type="date" onChange={handleChange} value={formData.date_of_birth} /><Icon>🎂</Icon></InputGroup>
        <InputGroup>
          <Select name="gender" onChange={handleChange} value={formData.gender}>
            <option value="">Giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Select>
        </InputGroup>
      </InputRow>

      {/* Địa chỉ / Ngày hẹn */}
     {/* -------------------- ĐỊA CHỈ -------------------- */}
<InputRow>
  <InputGroup>
    <Input
      name="address"
      placeholder="Địa chỉ"
      onChange={handleChange}
      value={formData.address}
    />
    <Icon>🏠</Icon>
  </InputGroup>
</InputRow>

{/* -------------------- LỊCH DẠNG BẢNG -------------------- */}
{formData.doctor_id && (
  <div style={{ marginTop: "20px", marginBottom: "20px" }}>
    <CalendarPicker
      doctorId={formData.doctor_id}
      onSelectDate={(date) => {
        setFormData({ ...formData, appointment_date: date });
      }}
    />
  </div>
)}


      {/* Hiển thị khung giờ */}
      {formData.doctor_id && formData.appointment_date && (
        <div style={{ margin: "20px 0" }}>
          <h4 style={{ color: "#6b21a8", marginBottom: 8 }}>⏰ Chọn khung giờ bác sĩ đang trực</h4>

          {loadingSlots ? (
            <p style={{ color: "#777" }}>Đang tải khung giờ...</p>
          ) : availableSlots.length === 0 ? (
            <p style={{ color: "#777" }}>Không có khung giờ trống cho ngày này.</p>
          ) : (
            <>
              {morningSlots.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 600, color: "#6b21a8" }}>🌤 Buổi sáng</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {morningSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setFormData({ ...formData, slot_id: slot.id })}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 20,
                          border: "1px solid #ccc",
                          background:
                            formData.slot_id === slot.id ? "#6b21a8" : "white",
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
                  <p style={{ fontWeight: 600, color: "#6b21a8" }}>☀️ Buổi chiều</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {afternoonSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setFormData({ ...formData, slot_id: slot.id })}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 20,
                          border: "1px solid #ccc",
                          background:
                            formData.slot_id === slot.id ? "#6b21a8" : "white",
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

      {/* Triệu chứng */}
      <InputRow>
        <InputGroup>
          <Input name="symptoms" placeholder="Triệu chứng, tình trạng..." onChange={handleChange} value={formData.symptoms} />
          <Icon>📝</Icon>
        </InputGroup>
      </InputRow>

      <Button onClick={handleSubmit}>Đặt lịch ngay</Button>
    </>
  );
};

export default ServiceBookingForm;
