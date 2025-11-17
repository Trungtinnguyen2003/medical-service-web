import React, { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";
import appointmentService from "../../services/appointmentService";
import serviceService from "../../services/serviceService";
import { useNavigate } from "react-router-dom";
import {
  SubHeader, Header, InputRow, InputGroup,
  Input, Select, Button, Icon
} from "./style";

const DepartmentBookingForm = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", gender: "",
    date_of_birth: "", address: "", appointment_date: "",
    department_id: "", service_id: "", symptoms: ""
  });
  const [baseService, setBaseService] = useState(null); // dịch vụ Khám bệnh ban đầu
  const navigate = useNavigate();

  // 🏥 Lấy chuyên khoa
  useEffect(() => {
    departmentService.getAll().then(setDepartments);
  }, []);

  // 🧩 Lấy dịch vụ “Khám bệnh ban đầu”
  useEffect(() => {
    serviceService.getAllServices().then((res) => {
      const base = res.find((s) => s.title === "Khám bệnh ban đầu");
      if (base) setBaseService(base);
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🩺 Gửi form
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để đặt lịch");
      navigate("/login");
      return;
    }

    if (!formData.department_id) {
      alert("Vui lòng chọn chuyên khoa");
      return;
    }

    try {
      await appointmentService.create({
        ...formData,
        service_id: baseService?.id || null,
        doctor_id: null, // 👈 để BE tự gán
      });
      alert("✅ Đặt lịch thành công! Hệ thống sẽ sắp bác sĩ tự động.");
      setFormData({
        name: "", email: "", phone: "", gender: "",
        date_of_birth: "", address: "", appointment_date: "",
        department_id: "", service_id: "", symptoms: ""
      });
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <SubHeader>Đặt lịch khám theo chuyên khoa</SubHeader>
      <Header>Khám bệnh ban đầu cùng bác sĩ chuyên khoa</Header>

      {/* Chọn khoa */}
      <InputRow>
        <InputGroup>
          <Select
            name="department_id"
            onChange={handleChange}
            value={formData.department_id}
          >
            <option value="">Chọn chuyên khoa</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </Select>
        </InputGroup>
      </InputRow>

      {/* Thông tin cá nhân */}
      <InputRow>
        <InputGroup>
          <Input name="name" placeholder="Họ tên" onChange={handleChange} value={formData.name} />
          <Icon>👤</Icon>
        </InputGroup>
        <InputGroup>
          <Input name="email" placeholder="Email" onChange={handleChange} value={formData.email} />
          <Icon>📧</Icon>
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup>
          <Input name="phone" placeholder="SĐT" onChange={handleChange} value={formData.phone} />
          <Icon>📞</Icon>
        </InputGroup>
        <InputGroup>
          <Input name="date_of_birth" type="date" onChange={handleChange} value={formData.date_of_birth} />
          <Icon>🎂</Icon>
        </InputGroup>
        <InputGroup>
          <Select name="gender" onChange={handleChange} value={formData.gender}>
            <option value="">Giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Select>
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup>
          <Input name="address" placeholder="Địa chỉ" onChange={handleChange} value={formData.address} />
          <Icon>🏠</Icon>
        </InputGroup>
        <InputGroup>
          <Input name="appointment_date" type="date" onChange={handleChange} value={formData.appointment_date} />
          <Icon>📅</Icon>
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup>
          <Input name="symptoms" placeholder="Triệu chứng, tình trạng..." onChange={handleChange} value={formData.symptoms} />
          <Icon>📝</Icon>
        </InputGroup>
      </InputRow>

      {/* Hiển thị giá dịch vụ nếu có */}
      {baseService && (
        <p style={{ color: "#6b21a8", fontWeight: 600, textAlign: "center" }}>
          💰 Phí khám ban đầu: {baseService.price?.toLocaleString() || "—"} VNĐ
        </p>
      )}

      <Button onClick={handleSubmit}>Đặt lịch ngay</Button>
    </>
  );
};

export default DepartmentBookingForm;
