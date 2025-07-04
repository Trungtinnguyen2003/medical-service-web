import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DoctorByDepartment = ({ doctors = [] }) => {
  if (!doctors.length) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: Math.min(doctors.length, 3),
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section style={{ padding: "50px 20px", background: "#f4f9fc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{
          fontSize: "24px",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "600",
          color: "#102a43"
        }}>
          Đội ngũ bác sĩ chuyên khoa
        </h2>

        <Slider {...settings}>
          {doctors.map((doc) => (
            <div key={doc.id}>
              <div
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                  margin: "0 12px",
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #0c9fda",
                  marginBottom: 15
                }}>
                  <img
                    src={`http://localhost:5000${doc.avatar}`}
                    alt={doc.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: "#1b4d6d", marginBottom: 6 }}>
                  {doc.name}
                </h4>
                {doc.position && (
                  <p style={{ fontSize: 14, color: "#444", marginBottom: 4 }}>
                    {doc.position}
                  </p>
                )}
                {doc.title && (
                  <p style={{ fontSize: 13, color: "#777" }}>
                    {doc.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default DoctorByDepartment;
