import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DepartmentDetailBanner from '../../components/DepartmentDetailBanner/DepartmentDetailBanner';
import DepartmentOverview from '../../components/DepartmentOverview/DepartmentOverview';
import departmentService from "../../services/departmentService";
import ServiceListByDepartment from '../../components/ServiceListByDepartment/ServiceListByDepartment';
import AppointmentFormSidebar from "../../components/AppointmentFormSidebar/AppointmentFormSidebar";
import FAQSection from "../../components/FAQSection/FAQSection";
import DoctorByDepartment from "../../components/Doctor/DoctorByDepartment"; // ✅

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } }
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

        // ✅ Gọi danh sách bác sĩ theo khoa
        if (data?.id) {
          const doctorRes = await departmentService.getDoctorsByDepartment(data.id);
          setDoctors(doctorRes);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, [slug]);

  if (!department) {
    return <div style={{ padding: "60px" }}>Đang tải thông tin chuyên khoa...</div>;
  }

  return (
    <>
      <DepartmentDetailBanner name={department.name} />

      <div
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-start',
          padding: '40px 60px',
          flexWrap: 'wrap'
        }}
      >
        {/* Bên trái */}
        <motion.div
          style={{ flex: 1, minWidth: '300px' }}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <DepartmentOverview
            slogan={department.slogan}
            description={department.description}
            image_url={department.image_url}
          />

          <motion.img
            src={`http://localhost:5000${department.image_url}`}
            alt={department.name}
            style={{
              width: '80%',
              marginTop: '20px',
              marginLeft: '30px',
              borderRadius: '8px'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />

          {/* ✅ Danh sách dịch vụ */}
          {department.services?.length > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <ServiceListByDepartment services={department.services} />
            </motion.div>
          )}

          {/* ✅ Danh sách bác sĩ theo khoa */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            style={{ marginTop: 50 }}
          >
            <DoctorByDepartment doctors={doctors} />
          </motion.div>
        </motion.div>

        {/* Bên phải: Form đặt hẹn */}
        <motion.div
          style={{
            width: '360px',
            minWidth: '280px',
            position: 'sticky',
            top: '80px',
            alignSelf: 'flex-start',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
          initial="hidden"
          animate="visible"
          variants={slideInRight}
        >
          <AppointmentFormSidebar />
        </motion.div>
      </div>

      {/* Câu hỏi thường gặp */}
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
