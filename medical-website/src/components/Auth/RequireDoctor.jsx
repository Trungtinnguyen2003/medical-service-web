// src/components/Auth/RequireDoctor.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const RequireDoctor = ({ children }) => {
  const role = localStorage.getItem("userRole");

  if (role !== "doctor") {
    alert("Bạn không có quyền truy cập vào trang này.");
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireDoctor;
