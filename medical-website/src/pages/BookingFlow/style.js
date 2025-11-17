// src/pages/BookingFlow/style.js
import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5fbff;
  padding: 24px 0;
  font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont,
    sans-serif;
`;

export const Layout = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
`;

export const Sidebar = styled.div`
  flex: 0 0 280px;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
  font-size: 14px;
  color: #0f172a;
`;

export const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const SidebarItem = styled.div`
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: #4b5563;
`;

export const Main = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
  padding: 18px 22px 22px;
`;

export const MainHeader = styled.div`
  border-radius: 10px;
  padding: 10px 16px;
  background: linear-gradient(90deg, #00a6ff, #00d4ff);
  color: #ffffff;
  font-weight: 700;
  margin: -18px -22px 20px;
  display: flex;
  justify-content: center;
`;

export const StepTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
`;

export const StepDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
`;

export const List = styled.div`
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

export const ListItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: none;
  background: #ffffff;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #f0f9ff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemMain = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ItemTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const ItemSub = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

export const ItemPrice = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0ea5e9;
`;

export const BottomBar = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;

  button {
    border: none;
    background: none;
    cursor: pointer;
    color: #0ea5e9;
    font-weight: 500;
  }
`;

export const PrimaryButton = styled.button`
  background: #0ea5e9;
  color: white;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0284c7;
  }
`;

export const SlotGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const SlotButton = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid ${({ active }) => (active ? "#0284c7" : "#d1d5db")};
  background: ${({ active }) => (active ? "#e0f2fe" : "#ffffff")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ disabled }) => (disabled ? "#9ca3af" : "#111827")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    font-weight: 600;
    margin-bottom: 6px;
  }
`;

export const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d0d7de;
  background: white;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 2px rgb(0 102 255 / 20%);
  }
`;
