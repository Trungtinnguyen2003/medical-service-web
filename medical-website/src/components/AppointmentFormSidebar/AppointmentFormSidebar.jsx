import React, { useEffect, useState } from 'react';
import { Wrapper, Title, Input, Select, Button } from './style';
import departmentService from '../../services/departmentService';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';

const AppointmentFormSidebar = () => {
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    appointment_date: "",
    appointment_time: "",
    symptoms: "",
    department_id: "",
    service_id: "",
    doctor_id: "",
  });

  useEffect(() => {
    departmentService.getAll().then(setDepartments);
  }, []);

  useEffect(() => {
    if (formData.department_id) {
      departmentService.getServicesByDepartment(formData.department_id).then((res) => {
        setServices(res);
        setFormData(prev => ({
          ...prev,
          service_id: "",
          doctor_id: ""
        }));
        setDoctors([]);
      });
    }
  }, [formData.department_id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, []);
  

  useEffect(() => {
    if (formData.service_id) {
      doctorService.getDoctorsByService(formData.service_id).then((res) => {
        setDoctors(res);
        setFormData(prev => ({
          ...prev,
          doctor_id: ""
        }));
      });
    }
  }, [formData.service_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await appointmentService.create(formData);
      alert("✅ Đặt lịch thành công!");

      // Reset
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
        appointment_date: "",
        appointment_time: "",
        symptoms: "",
        department_id: "",
        service_id: "",
        doctor_id: "",
      });
      setServices([]);
      setDoctors([]);
    } catch (err) {
      if (err.response?.data?.message) {
        alert("❌ " + err.response.data.message);
      } else {
        alert("❌ Đã xảy ra lỗi: " + err.message);
      }
    }
  };

  return (
    <Wrapper>
      <Title>Đặt lịch khám</Title>

      <Select name="department_id" onChange={handleChange} value={formData.department_id}>
        <option value="">Chọn chuyên khoa</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>{dept.name}</option>
        ))}
      </Select>

      <Select name="service_id" onChange={handleChange} value={formData.service_id} disabled={!formData.department_id}>
        <option value="">Chọn dịch vụ</option>
        {services.map((svc) => (
          <option key={svc.id} value={svc.id}>{svc.title}</option>
        ))}
      </Select>

      <Select name="doctor_id" onChange={handleChange} value={formData.doctor_id} disabled={!formData.service_id}>
        <option value="">Chọn bác sĩ</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>{doc.name}</option>
        ))}
      </Select>

      <Input name="name" value={formData.name} placeholder="Họ tên" onChange={handleChange} />
      <Input name="email" value={formData.email} placeholder="Email" onChange={handleChange} />
      <Input name="phone" value={formData.phone} placeholder="Số điện thoại" onChange={handleChange} />

      <Select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Giới tính</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </Select>

      <Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
      <Input name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} />
      <Input name="appointment_date" type="date" value={formData.appointment_date} onChange={handleChange} />
      <Input name="appointment_time" type="time" value={formData.appointment_time} onChange={handleChange} />
      <Input name="symptoms" placeholder="Triệu chứng, tình trạng..." value={formData.symptoms} onChange={handleChange} />

      <Button onClick={handleSubmit}>Gửi yêu cầu</Button>
    </Wrapper>
  );
};

export default AppointmentFormSidebar;
