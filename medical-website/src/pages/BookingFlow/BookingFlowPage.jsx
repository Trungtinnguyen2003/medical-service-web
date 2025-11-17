// src/pages/BookingFlow/BookingFlowPage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import StepSubject from "./StepSubject";
import StepService from "./StepService";
import StepDate from "./StepDate";
import StepTime from "./StepTime";
import StepDoctorDepartment from "./StepDoctorDepartment";
import StepDoctor from "./StepDoctor";

const BookingFlowPage = () => {
  const [params] = useSearchParams();
  const step = params.get("stepName") || "doctor";
if (step === "doctor") return <StepDoctor />;              // StepDoctor.jsx
if (step === "department") return <StepDoctorDepartment />;
  if (step === "service") return <StepService />;
  if (step === "date") return <StepDate />;
  if (step === "time") return <StepTime />;
  return <StepSubject />;
};

export default BookingFlowPage;
