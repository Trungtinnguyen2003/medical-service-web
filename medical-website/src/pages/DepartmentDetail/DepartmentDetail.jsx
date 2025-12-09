import logo from "../../assets/images/logo.png";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DepartmentDetailBanner from "../../components/DepartmentDetailBanner/DepartmentDetailBanner";
import DepartmentOverview from "../../components/DepartmentOverview/DepartmentOverview";
import departmentService from "../../services/departmentService";
import ServiceListByDepartment from "../../components/ServiceListByDepartment/ServiceListByDepartment";
import FAQSection from "../../components/FAQSection/FAQSection";
import DoctorByDepartment from "../../components/Doctor/DoctorByDepartment";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const DepartmentDetail = () => {
  const { slug } = useParams();
  const [department, setDepartment] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await departmentService.getBySlug(slug);
        setDepartment(data);

        if (data?.id) {
          const doctorRes = await departmentService.getDoctorsByDepartment(
            data.id
          );
          setDoctors(doctorRes);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, [slug]);

  if (!department) {
    return (
      <div style={{ padding: "60px" }}>Đang tải thông tin chuyên khoa...</div>
    );
  }

  return (
    <>
      <DepartmentDetailBanner name={department.name} />

      {/* WRAPPER 2 CỘT */}
     <div
  style={{
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
    padding: "40px 60px",
    flexWrap: "wrap",

    // 🔥 Quan trọng: ép mở rộng theo nội dung
    height: "auto",
    minHeight: "auto",
    overflow: "visible",
  }}
>

        {/* LEFT COLUMN */}
        <motion.div
          style={{ flex: 1, minWidth: "320px" }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <DepartmentOverview
            slogan={department.slogan}
            description={department.description}
            image_url={department.image_url}
          />

          {/* Ảnh chuyên khoa */}
          <motion.img
            src={`http://localhost:5000${department.image_url}`}
            alt={department.name}
            style={{
              width: "80%",
              marginTop: "20px",
              marginLeft: "30px",
              borderRadius: "8px",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Dịch vụ theo khoa */}
          {department.services?.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <ServiceListByDepartment services={department.services} />
            </motion.div>
          )}

          {/* Bác sĩ theo khoa */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            style={{ marginTop: 50 }}
          >
            <DoctorByDepartment doctors={doctors} />
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN — LOGO (KHÔNG STICKY, TỰ CUỘN THEO) */}
                {/* RIGHT COLUMN — LOGO CUỘN THEO TRANG */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideInRight}
          style={{
            width: "280px",
            minWidth: "240px",
            borderRadius: "16px",
            padding: "18px",
            background: "#ffffff",
            boxShadow: "0 8px 20px rgba(15,23,42,0.12)",

            // 🔥 ÉP TRỞ VỀ PHẦN TỬ BÌNH THƯỜNG
            position: "relative",
            top: "unset",
            left: "unset",
            right: "unset",
            bottom: "unset",
            transform: "none",

            // 🔥 KHÔNG TÁCH LỚP RIÊNG - BẮT BUỘC
            willChange: "auto",

            // 🔥 ĐẢM BẢO FLEX CONTAINER TÍNH ĐÚNG CHIỀU CAO
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "10px",
              fontWeight: 600,
              fontSize: "15px",
              color: "#1f2937",
            }}
          >
            Thương hiệu chuyên khoa
          </div>

          <img
            src={logo}
            alt="Department Logo"
            style={{
              width: "65%",
              margin: "0 auto",
              display: "block",
              objectFit: "contain",
              borderRadius: "12px",

              // 🔥 LOGO cũng phải đảm bảo relative
              position: "relative",
            }}
          />
        </motion.div>

      </div>

      {/* FAQ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <FAQSection />
      </motion.div>
    </>
  );
};

export default DepartmentDetail;
