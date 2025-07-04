import React, { useState } from "react";
import UserRegisterForm from "../../components/Auth/UserRegisterForm";
import DoctorRegisterForm from "../../components/Auth/DoctorRegisterForm";
import bgImg from "../../assets/images/7.jpg";

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `url(${bgImg})`, backgroundSize: "cover", padding: 40 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", padding: 30, borderRadius: 12 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Tạo tài khoản</h2>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <button onClick={() => setActiveTab("user")} style={{ padding: 10, marginRight: 10, background: activeTab === "user" ? "#6a1b9a" : "#eee", color: activeTab === "user" ? "#fff" : "#000", border: "none", borderRadius: 6 }}>
            Người dùng
          </button>
          <button onClick={() => setActiveTab("doctor")} style={{ padding: 10, background: activeTab === "doctor" ? "#6a1b9a" : "#eee", color: activeTab === "doctor" ? "#fff" : "#000", border: "none", borderRadius: 6 }}>
            Bác sĩ
          </button>
        </div>
        {activeTab === "user" ? <UserRegisterForm /> : <DoctorRegisterForm />}
      </div>
    </div>
  );
};

export default RegisterPage;
