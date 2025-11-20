// src/pages/BookingFlow/BookingFlowPage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import StepSubject from "./StepSubject";
import StepService from "./StepService";
import StepDate from "./StepDate";
import StepTime from "./StepTime";
import StepDoctorDepartment from "./StepDoctorDepartment";
import StepDoctor from "./StepDoctor";
import StepDepartmentSelect from "../BookingFlowDepartment/StepDepartmentSelect";
import StepDepartmentService from "../BookingFlowDepartment/StepDepartmentService";

const BookingFlowPage = () => {
  const [params] = useSearchParams();
  const step = params.get("stepName") || "doctor";
if (step === "doctor") return <StepDoctor />;              // StepDoctor.jsx
if (step === "department") return <StepDoctorDepartment />;
  if (step === "service") return <StepService />;
  if (step === "date") return <StepDate />;
  if (step === "time") return <StepTime />;

    // ========= LUỒNG ĐẶT THEO CHUYÊN KHOA =========
  if (step === "department") return <StepDepartmentSelect />;
  if (step === "department-service") return <StepDepartmentService />;
  // if (step === "department-date") return <StepDepartmentDate />;
  // if (step === "department-time") return <StepDepartmentTime />;
  return <StepSubject />;
};

export default BookingFlowPage;
