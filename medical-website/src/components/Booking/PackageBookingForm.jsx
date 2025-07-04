import React, { useEffect, useState } from "react";
import appointmentService from "../../services/appointmentService";
import servicePackageService from "../../services/servicePackageService";
import { useNavigate } from "react-router-dom"; // thêm dòng này
import {
  SubHeader, Header, InputRow, InputGroup,
  Input, Select, Button, Icon
} from "./style";

const PackageBookingForm = () => {
  const [packages, setPackages] = useState([]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", gender: "",
    date_of_birth: "", address: "", appointment_date: "", appointment_time: "",
    package_id: ""
  });

  useEffect(() => {
    servicePackageService.getAll().then(setPackages);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      alert("Đặt lịch gói khám thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };


  return (
    <>
      <SubHeader>Đặt gói dịch vụ</SubHeader>
      <Header>Chăm sóc sức khỏe trọn gói</Header>

      <InputRow>
        <InputGroup>
          <Select name="package_id" onChange={handleChange} value={formData.package_id}>
            <option value="">Chọn gói khám</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup><Input name="name" placeholder="Họ tên" onChange={handleChange} /><Icon>👤</Icon></InputGroup>
        <InputGroup><Input name="email" placeholder="Email" onChange={handleChange} /><Icon>📧</Icon></InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup><Input name="phone" placeholder="SĐT" onChange={handleChange} /><Icon>📞</Icon></InputGroup>
        <InputGroup><Input name="date_of_birth" type="date" onChange={handleChange} /><Icon>🎂</Icon></InputGroup>
        <InputGroup>
          <Select name="gender" onChange={handleChange}>
            <option value="">Giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Select>
        </InputGroup>
      </InputRow>

      <InputRow>
        <InputGroup><Input name="address" placeholder="Địa chỉ" onChange={handleChange} /><Icon>🏠</Icon></InputGroup>
        <InputGroup><Input name="appointment_date" type="date" onChange={handleChange} /><Icon>📅</Icon></InputGroup>
        <InputGroup><Input name="appointment_time" type="time" onChange={handleChange} /><Icon>⏰</Icon></InputGroup>
      </InputRow>

      <Button onClick={handleSubmit}>Đặt trọn gói</Button>
    </>
  );
};

export default PackageBookingForm;
