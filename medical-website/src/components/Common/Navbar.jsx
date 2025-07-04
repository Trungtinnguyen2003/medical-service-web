import React, { useState, useEffect } from "react";
import {
  Nav,
  Logo,
  NavLinks,
  NavLinkItem,
  NavLink,
  UserIconWrapper,
  DropdownMenu,
  DropdownItem,
  NavBox,
  NewsDropdown, 
  NewsDropdownItem,
} from "./style";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postCategories, setPostCategories] = useState([]);
  const [showNewsDropdown, setShowNewsDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/post-categories");
        const data = await res.json();
        setPostCategories(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục tin tức:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleUserIconClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setShowDropdown((prev) => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <Nav>
      <Logo>
        <Link to="/">MedCare</Link>
      </Logo>
      <NavBox>
        <NavLinks>
          <NavLinkItem><NavLink as={Link} to="/">Home</NavLink></NavLinkItem>
          <NavLinkItem><NavLink as={Link} to="/about">Giới Thiệu</NavLink></NavLinkItem>
          <NavLinkItem><NavLink as={Link} to="/departments">Chuyên Khoa</NavLink></NavLinkItem>
          <NavLinkItem><NavLink as={Link} to="/services">Dịch Vụ</NavLink></NavLinkItem>
          <NavLinkItem><NavLink as={Link} to="/doctors">Bác Sĩ</NavLink></NavLinkItem>
          {/* Mục Tin Tức xổ xuống danh mục */}
          <NavLinkItem
            style={{ position: "relative" }}
            onMouseEnter={() => setShowNewsDropdown(true)}
            onMouseLeave={() => setShowNewsDropdown(false)}
          >
            <NavLink as={Link}>
              Tin tức ▼
            </NavLink>
            {showNewsDropdown && (
  <NewsDropdown>
    {postCategories.map((cat) => (
      <NewsDropdownItem
        key={cat.id}
        to={`/tin-tuc/danh-muc/${cat.slug}`}
      >
        {cat.name}
      </NewsDropdownItem>
    ))}
  </NewsDropdown>
)}

          </NavLinkItem>
        </NavLinks>

        <UserIconWrapper onClick={handleUserIconClick}>
          <FaUserCircle size={28} />
          {isLoggedIn && showDropdown && (
            <DropdownMenu>
              <DropdownItem to="/profile">Thông tin người dùng</DropdownItem>
              <DropdownItem as="button" onClick={handleLogout}>
                Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserIconWrapper>
      </NavBox>

      <Link
        to="/dat-lich"
        style={{
          background: "purple",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "20px",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        Đặt Lịch Ngay
      </Link>
    </Nav>
  );
};

export default Navbar;
