import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaBrain, FaLungs, FaUserMd, FaStethoscope } from "react-icons/fa";
import {
  GridWrapper,
  Grid,
  GridItem,
  IconWrapper,
  Title,
  Description,
  ExploreLink
} from './style';
import departmentService from '../../services/departmentService'; // ✅ import service

const fadeZoom = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

const getDepartmentIcon = (slug) => {
  switch (slug) {
    case "tim-mach":
      return <FaHeartbeat size={36} color="#8b5cf6" />;
    case "than-kinh":
      return <FaBrain size={36} color="#8b5cf6" />;
    case "ho-hap":
      return <FaLungs size={36} color="#8b5cf6" />;
    case "noi-khoa":
      return <FaStethoscope size={36} color="#8b5cf6" />;
    default:
      return <FaUserMd size={36} color="#8b5cf6" />;
  }
};

const DepartmentListFull = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await departmentService.getAll(); // ✅ gọi API
        setDepartments(res);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách chuyên khoa:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <GridWrapper>
      <Grid>
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeZoom}
          >
            <GridItem>
            <IconWrapper>
  {getDepartmentIcon(dept.slug)}
</IconWrapper>

              <Title>{dept.name}</Title>
              <Description>{dept.slogan}</Description>
              <ExploreLink to={`/departments/${dept.slug}`}>Khám phá</ExploreLink>
            </GridItem>
          </motion.div>
        ))}
      </Grid>
    </GridWrapper>
  );
};

export default DepartmentListFull;
