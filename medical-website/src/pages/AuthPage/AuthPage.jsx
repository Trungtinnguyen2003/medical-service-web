// src/pages/Profile/EditProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getProfileByToken, updateProfile } from "../../services/authService";
import {
  Container,
  Title,
  Form,
  FormRow,
  Input,
  Label,
  Select,
  ButtonGroup,
  SaveButton,
  CancelButton,
  Avatar
} from "./style";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "Nam",
    password: "",
    city: "",
    state: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileByToken();
        const user = res.data;
        const [firstName, ...rest] = user.name.split(" ");
        const lastName = rest.join(" ");

        setFormData({
          firstName: firstName || "",
          lastName: lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          date_of_birth: user.date_of_birth || "",
          gender: user.gender || "Nam",
          password: "",
          city: "",
          state: "",
        });

        const avatarUrl = user.avatar?.startsWith("http")
          ? user.avatar
          : `http://localhost:5000${user.avatar}`;
        setAvatarPreview(avatarUrl);
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const token = localStorage.getItem("token");

        const res = await axios.post("http://localhost:5000/auth/profile/avatar", form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const avatarUrl = res.data.avatar?.startsWith("http")
          ? res.data.avatar
          : `http://localhost:5000${res.data.avatar}`;
        setAvatarPreview(avatarUrl);
      }

      const fullName = `${formData.firstName} ${formData.lastName}`;
      const payload = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
      };

      await updateProfile(localStorage.getItem("userId"), payload);

      alert("Cập nhật hồ sơ thành công!");
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <Container style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", paddingTop: "40px" }}>
      <Title>✍️ Chỉnh sửa thông tin cá nhân</Title>

      <Form onSubmit={handleSubmit}>
        <FormRow>
          <Label>Ảnh đại diện</Label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </FormRow>

        {avatarPreview && (
          <FormRow>
            <Avatar src={avatarPreview} alt="avatar" />
          </FormRow>
        )}

        <FormRow>
          <Label>Họ</Label>
          <Input name="firstName" value={formData.firstName} onChange={handleChange} />
          <Label>Tên</Label>
          <Input name="lastName" value={formData.lastName} onChange={handleChange} />
        </FormRow>

        <FormRow>
          <Label>Email</Label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} />
          <Label>Mật khẩu mới (nếu đổi)</Label>
          <Input name="password" type="password" value={formData.password} onChange={handleChange} />
        </FormRow>

        <FormRow>
          <Label>Địa chỉ</Label>
          <Input name="address" value={formData.address} onChange={handleChange} />
          <Label>Số điện thoại</Label>
          <Input name="phone" value={formData.phone} onChange={handleChange} />
        </FormRow>

        <FormRow>
          <Label>Ngày sinh</Label>
          <Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
          <Label>Giới tính</Label>
          <Select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </Select>
        </FormRow>

        <ButtonGroup>
          <CancelButton type="button">Huỷ bỏ</CancelButton>
          <SaveButton type="submit">Lưu thay đổi</SaveButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default EditProfile;
