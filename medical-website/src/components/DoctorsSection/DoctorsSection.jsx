import React, { useEffect, useState } from 'react';
import {
  Section, Background, FormCard, Header, SubHeader, InputRow,
  InputGroup, Input, Select, Button, Icon
} from './style';
import AOS from 'aos';
import 'aos/dist/aos.css';
import bgImage from '../../assets/images/11.jpg';

import appointmentService from '../../services/appointmentService';
import departmentService from '../../services/departmentService';

const DoctorSection = ({ packageId = null }) => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    appointment_date: '',
    appointment_time: '',
    department_id: '',
    doctor_id: '',
    package_id: packageId
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchDepartments();
  }, []);

  // khi chọn chuyên khoa thì gọi danh sách bác sĩ theo khoa
  useEffect(() => {
    if (formData.department_id) {
      departmentService.getDoctorsByDepartment(formData.department_id).then(setDoctors);
    } else {
      setDoctors([]);
    }
  }, [formData.department_id]);

  const fetchDepartments = async () => {
    const data = await departmentService.getAll();
    setDepartments(data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await appointmentService.create(formData);
      alert('Đặt lịch thành công!');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  return (
    <Section>
      <Background style={{ backgroundImage: `url(${bgImage})` }}>
        <FormCard data-aos="zoom-in">
          <SubHeader>Đặt lịch hẹn</SubHeader>
          <Header>Gặp gỡ chuyên gia của chúng tôi</Header>

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
              <Select name="doctor_id" onChange={handleChange} value={formData.doctor_id}>
                <option value="">Chọn bác sĩ</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </Select>
            </InputGroup>
          </InputRow>

          <InputRow>
            <InputGroup>
              <Input name="name" type="text" placeholder="Họ tên của bạn" onChange={handleChange} />
              <Icon>👤</Icon>
            </InputGroup>
            <InputGroup>
              <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
              <Icon>📧</Icon>
            </InputGroup>
          </InputRow>

          <InputRow>
            <InputGroup>
              <Input name="phone" type="tel" placeholder="Số điện thoại" onChange={handleChange} />
              <Icon>📞</Icon>
            </InputGroup>
            <InputGroup>
              <Input name="date_of_birth" type="date" onChange={handleChange} />
              <Icon>🎂</Icon>
            </InputGroup>
            <InputGroup>
              <Select name="gender" onChange={handleChange}>
                <option value="">Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Select>
            </InputGroup>
          </InputRow>

          <InputRow>
            <InputGroup>
              <Input name="address" type="text" placeholder="Địa chỉ liên hệ" onChange={handleChange} />
              <Icon>🏠</Icon>
            </InputGroup>
            <InputGroup>
              <Input name="appointment_date" type="date" onChange={handleChange} />
              <Icon>📅</Icon>
            </InputGroup>
            <InputGroup>
              <Input name="appointment_time" type="time" onChange={handleChange} />
              <Icon>⏰</Icon>
            </InputGroup>
          </InputRow>

          <Button onClick={handleSubmit}>Đặt lịch ngay</Button>
        </FormCard>
      </Background>
    </Section>
  );
};

export default DoctorSection;
  