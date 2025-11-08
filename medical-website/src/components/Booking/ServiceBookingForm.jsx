import React, { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";
import doctorService from "../../services/doctorService";
import appointmentService from "../../services/appointmentService";
import { useNavigate } from "react-router-dom"; // thêm

import {
  SubHeader, Header, InputRow, InputGroup,
  Input, Select, Button, Icon
} from "./style";

const ServiceBookingForm = () => {
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", gender: "",
    date_of_birth: "", address: "", appointment_date: "", appointment_time: "",
    department_id: "", doctor_id: "", 
    // service_id: "", 
    symptoms: ""
  });


  
  useEffect(() => {
    departmentService.getAll().then(setDepartments);
  }, []);

  useEffect(() => {
  if (formData.department_id) {
    doctorService.getByDepartment(formData.department_id)
      .then((res) => {
        setDoctors(res);
        setFormData(prev => ({ ...prev, doctor_id: "" }));
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy bác sĩ:", err.response?.data || err.message);
      });
  } else {
    setDoctors([]);
  }
}, [formData.department_id]);


  useEffect(() => {
    if (formData.service_id) {
      doctorService.getDoctorsByService(formData.service_id).then((res) => {
        setDoctors(res);
        setFormData(prev => ({ ...prev, doctor_id: "" }));
      });
    }
  }, [formData.service_id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate(); // thêm

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để đặt lịch");
      navigate("/login");
      return;
    }
    try {
      await appointmentService.create(formData);
      alert("✅ Đặt lịch dịch vụ thành công!");
      setFormData({
        name: "", email: "", phone: "", gender: "",
        date_of_birth: "", address: "", appointment_date: "", appointment_time: "",
        department_id: "", doctor_id: "", service_id: "", symptoms: ""
      });
      setServices([]);
      setDoctors([]);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <SubHeader>Đặt dịch vụ lẻ</SubHeader>
      <Header>Gặp bác sĩ chuyên khoa</Header>

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
          {/* <Select name="service_id" onChange={handleChange} value={formData.service_id} disabled={!formData.department_id}>
            <option value="">Chọn dịch vụ</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </Select> */}
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup>
          <Select name="doctor_id" onChange={handleChange} value={formData.doctor_id} disabled={!formData.department_id}>
            <option value="">Chọn bác sĩ</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </Select>
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup><Input name="name" placeholder="Họ tên" onChange={handleChange} value={formData.name} /><Icon>👤</Icon></InputGroup>
        <InputGroup><Input name="email" placeholder="Email" onChange={handleChange} value={formData.email} /><Icon>📧</Icon></InputGroup>
      </InputRow>

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

      <InputRow>
        <InputGroup><Input name="address" placeholder="Địa chỉ" onChange={handleChange} value={formData.address} /><Icon>🏠</Icon></InputGroup>
        <InputGroup><Input name="appointment_date" type="date" onChange={handleChange} value={formData.appointment_date} /><Icon>📅</Icon></InputGroup>
        <InputGroup><Input name="appointment_time" type="time" onChange={handleChange} value={formData.appointment_time} /><Icon>⏰</Icon></InputGroup>
      </InputRow>

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
