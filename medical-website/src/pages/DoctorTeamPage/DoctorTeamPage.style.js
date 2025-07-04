import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 40px 30px;
  gap: 30px;
  background-color: #f4f9ff;
`;

export const Sidebar = styled.div`
  width: 260px;
  background-color: #eaf4ff;
  padding: 20px;
  border-radius: 8px;
`;

export const SidebarTitle = styled.h3`
  font-size: 20px;
  color: #114e92;
  margin-bottom: 15px;
  border-bottom: 2px solid #114e92;
  padding-bottom: 5px;
`;

export const DeptItem = styled.div`
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#114e92" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: 0.3s;

  &:hover {
    background-color: #114e92;
    color: white;
  }
`;

export const Content = styled.div`
  flex: 1;
`;

export const DoctorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const DoctorCard = styled.div`
  display: flex;
  background-color: #f0f9ff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const DoctorAvatar = styled.img`
  width: 220px;
  height: auto;
  object-fit: cover;
`;

export const DoctorInfo = styled.div`
  padding: 20px;
  flex: 1;
`;

export const DoctorName = styled.h3`
  font-size: 22px;
  color: #114e92;
  margin-bottom: 10px;
`;

export const DoctorSpecialty = styled.p`
  margin: 4px 0;
  color: #333;
`;

export const ButtonGroup = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 15px;
`;

export const Button = styled.button`
  background-color: ${(props) => (props.primary ? "#1da1f2" : "#114e92")};
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`;
