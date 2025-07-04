// src/pages/DoctorTeamPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorBanner from '../../components/DoctorPage/DoctorBanner';
import doctorService from '../../services/doctorService';
import departmentService from '../../services/departmentService';

import {
  Container,
  Sidebar,
  SidebarTitle,
  DeptItem,
  Content,
  DoctorGrid,
  DoctorCard,
  DoctorAvatar,
  DoctorInfo,
  ButtonGroup,
  Button,
  DoctorName,
  DoctorSpecialty,
} from './DoctorTeamPage.style';

const DoctorTeamPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      const list = await departmentService.getAllDepartments();
      setDepartments(list);
      if (list.length > 0) {
        setSelectedDept(list[0].id);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedDept) return;
      const res = await departmentService.getDoctorsByDepartment(selectedDept);
const approvedDoctors = res.filter((doc) => doc.user && doc.user.status === "approved");
setDoctors(approvedDoctors);
    };    
    fetchDoctors();
  }, [selectedDept]);
  

  return (
    <>
      <DoctorBanner />
      <Container>
        <Sidebar>
          <SidebarTitle>Chuyên khoa</SidebarTitle>
          {departments.map((dept) => (
            <DeptItem
              key={dept.id}
              active={dept.id === selectedDept}
              onClick={() => setSelectedDept(dept.id)}
            >
              {dept.name}
            </DeptItem>
          ))}
        </Sidebar>

        <Content>
          <h2>Bác sĩ thuộc {departments.find((d) => d.id === selectedDept)?.name}</h2>
          <DoctorGrid>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <DoctorCard key={doctor.id}>
                  <DoctorAvatar
  src={
    doctor.avatar
      ? `http://localhost:5000${doctor.avatar}`
      : '/images/default-doctor.jpg'
  }
/>

                  <DoctorInfo>
                    <DoctorName>{doctor.name}</DoctorName>
                    <DoctorSpecialty>Học hàm học vị: {doctor.degree}</DoctorSpecialty>
                    <DoctorSpecialty>Kinh nghiệm: {doctor.experience_years} năm</DoctorSpecialty>
                    <DoctorSpecialty>Chức vụ: {doctor.position}</DoctorSpecialty>

                    <ButtonGroup>
                      <Button onClick={() => navigate(`/doctors/${doctor.id}`)}>XEM CHI TIẾT</Button>
                      
                    </ButtonGroup>
                  </DoctorInfo>
                </DoctorCard>
              ))
            ) : (
              <p>Hiện chưa có bác sĩ trong chuyên khoa này.</p>
            )}
          </DoctorGrid>
        </Content>
      </Container>
    </>
  );
};

export default DoctorTeamPage;
