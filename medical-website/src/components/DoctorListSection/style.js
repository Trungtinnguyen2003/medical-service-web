import styled from "styled-components";

// Vùng tổng thể section
export const Section = styled.section`
  padding: 80px 20px;
  background-color: #f8f9fc;
  text-align: center;
`;

// Subtitle nhỏ phía trên tiêu đề
export const Subtitle = styled.p`
  font-size: 14px;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 8px;
`;

// Tiêu đề chính
export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 40px;
`;

// Lưới bác sĩ responsive
export const DoctorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  justify-content: center;
`;

// Card từng bác sĩ
export const DoctorCard = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

// Hình đại diện
export const Avatar = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
`;

// Nội dung trong card
export const CardBody = styled.div`
  padding: 16px;
  background: white;
`;

// Tên bác sĩ
export const Name = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
`;

// Vị trí/chức danh
export const Speciality = styled.p`
  font-size: 14px;
  color: #64748b;
`;

// Lớp overlay khi hover
export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  border-radius: 16px;
  z-index: 2;
`;

// Nút "Xem chi tiết"
export const DetailButton = styled.button`
  background: #ffffff;
  color: #003366;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e0f7fa;
  }
`;
