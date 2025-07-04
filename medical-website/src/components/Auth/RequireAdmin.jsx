import React from "react";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
