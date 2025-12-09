import styled from "styled-components";

/* ===== PAGE WRAPPER ===== */
export const PageWrapper = styled.div`
  display: flex;
  padding: 40px 32px;
  gap: 32px;
  background: linear-gradient(135deg, #eef2ff 0%, #f9fafb 40%, #e0f2fe 100%);
  min-height: 100vh;
`;

/* ===== SIDEBAR ===== */
export const Sidebar = styled.div`
  width: 280px;
  background: rgba(255, 255, 255, 0.75);
  padding: 24px;
  border-radius: 24px;
  backdrop-filter: blur(14px);
  border: 1px solid rgba(226, 232, 255, 0.8);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
`;

/* ===== SEARCH BOX ===== */
export const SearchBox = styled.input`
  width: 100%;
  padding: 13px 16px;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: white;
  margin-bottom: 22px;
  font-size: 14px;
  outline: none;
  transition: 0.25s ease;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(167, 180, 255, 0.5);
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 14px;
`;

export const DeptItem = styled.div`
  padding: 12px 16px;
  margin-bottom: 10px;
  font-size: 15px;
  border-radius: 14px;
  cursor: pointer;
  background: ${(p) =>
    p.active
      ? "linear-gradient(135deg, #4f46e5, #2563eb)"
      : "rgba(255,255,255,0.8)"};
  color: ${(p) => (p.active ? "white" : "#334155")};
  font-weight: ${(p) => (p.active ? 600 : 500)};
  transition: 0.25s ease;

  &:hover {
    background: ${(p) =>
      p.active
        ? "linear-gradient(135deg, #4f46e5, #2563eb)"
        : "rgba(226,232,255,0.8)"};
  }
`;

/* ===== CONTENT ===== */
export const Content = styled.div`
  flex: 1;
`;

/* ===== CARD GRID ===== */
export const DoctorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
`;

/* ===== DOCTOR CARD ===== */
export const DoctorCard = styled.div`
  display: flex;
  background: white;
  border-radius: 22px;
  padding: 20px;
  gap: 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
  }
`;

export const DoctorAvatar = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 16px;
  object-fit: cover;
`;

export const DoctorInfo = styled.div`
  flex: 1;
`;

export const DoctorName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
`;

export const DoctorMeta = styled.p`
  font-size: 14px;
  color: #475569;
  margin-top: 4px;
`;

export const Button = styled.button`
  margin-top: 14px;
  padding: 10px 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  border: none;
  border-radius: 14px;
  color: white;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
  }
`;
