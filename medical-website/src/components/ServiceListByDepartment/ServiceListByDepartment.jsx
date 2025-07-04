import React, { useState } from "react";
import "./ServiceListByDepartment.css";
import { Link } from "react-router-dom";

const ServiceListByDepartment = ({ services }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!services || services.length === 0) {
    return <p className="no-service">Không có dịch vụ nào được hiển thị.</p>;
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="service-list-vertical">
      <h3 className="section-title">Các dịch vụ chuyên khoa</h3>
      {services.map((service) => (
        <div
          key={service.id}
          className={`vertical-service-item ${expandedId === service.id ? "expanded" : ""}`}
          onClick={() => toggleExpand(service.id)}
        >
          <div className="image-wrapper">
            <img
              src={`http://localhost:5000${service.image_url}`}
              alt={service.title}
              className="mini-service-image"
            />
          </div>
          <div className="text-content">
            <h4 className="vertical-service-title">{service.title}</h4>
            <p className="vertical-service-description">{service.description}</p>

            {/* Hiển thị label luôn */}
            <Link  className="detail-link">
              → Xem chi tiết dịch vụ
            </Link>

            {/* Phần chi tiết chỉ mở rộng khi click */}
            {expandedId === service.id && (
  <div className="vertical-service-detail">
    {/* ✅ Hiển thị giá nếu có */}
    {service.price && (
      <div style={{ marginBottom: 10, fontWeight: "bold", color: "#1e40af" }}>
        Giá dịch vụ: {service.price.toLocaleString("vi-VN")}₫
      </div>
    )}

    <ul className="vertical-service-detail-list">
      {(service.detail?.split(/\r?\n/) || []).map((line, idx) => (
        <li key={idx}>{line.trim()}</li>
      ))}
    </ul>
  </div>
)}

          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceListByDepartment;
