import styled from "styled-components";
import { Link } from "react-router-dom";

export const Nav = styled.nav`
  position: absolute;
  top: 0;
  width: 100%;
  padding: 20px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  background: transparent;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
  }
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
`;

export const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 10px;
  }
`;

export const NavLinkItem = styled.li``;

export const NavLink = styled.a`
  text-decoration: none;
  color: rgb(82, 61, 114);
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
  transform: translateX(-50%); /* 👉 Căn giữa */
  &:hover {
    color: #d8b4fe;
  }
`;

export const UserIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  color: #fff;

  &:hover {
    color: #fcd34d;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  background: white;
  border-radius: 8px;
  padding: 10px 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 180px;
`;

export const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  font-size: 14px;

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const NavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    position: static;
    flex-direction: column;
    transform: none;
    margin-top: 10px;
  }
`;

export const NavBox = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  background-color: rgb(173, 149, 219);
  padding: 12px 40px; /* 👉 tăng padding để rộng ra */
  border-radius: 20px;
  // white-space: nowrap; /* ✅ ngăn xuống dòng */
  max-width: 100%; /* hoặc bỏ giới hạn */
  // overflow-x: auto; /* nếu không đủ, có thể scroll ngang */

  @media (max-width: 768px) {
    flex-direction: column;
    transform: none;
    margin-top: 10px;
  }
`;

export const NewsDropdown = styled.div`
  // margin-top: 1px;
  position: absolute;
  top: 100%;
  left: 0;
  background: #f5f3ff; /* tím nhạt dịu nhẹ */
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  z-index: 999;
  min-width: 200px;
  padding: 8px 0;
  animation: fadeSlideDown 0.25s ease-in-out;

  @keyframes fadeSlideDown {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const NewsDropdownItem = styled(Link)`
  display: block;
  padding: 10px 18px;
  text-decoration: none;
  color: #4c1d95; /* tím đậm */
  font-size: 15px;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background-color: #ede9fe; /* tím sáng hơn */
    padding-left: 22px;
  }
`;
