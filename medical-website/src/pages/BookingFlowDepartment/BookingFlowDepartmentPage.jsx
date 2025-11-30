import React from "react";
import { useSearchParams } from "react-router-dom";

import StepDepartmentSelect from "./StepDepartmentSelect";
import StepDepartmentService from "./StepDepartmentService";
import StepDepartmentDate from "./StepDepartmentDate";
import StepDepartmentTime from "./StepDepartmentTime";
import StepDepartmentProfile from "./StepDepartmentProfile";
import StepDepartmentConfirm from "./StepDepartmentConfirm";


const BookingFlowDepartmentPage = () => {
  const [params] = useSearchParams();
  const step = params.get("step") || "department";

  if (step === "department") return <StepDepartmentSelect />;
  if (step === "service") return <StepDepartmentService />;
  if (step === "date") return <StepDepartmentDate />;
  if (step === "time") return <StepDepartmentTime />;
  if (step === "profile") return <StepDepartmentProfile  />;
  if (step === "confirm") return <StepDepartmentConfirm />;


  return <StepDepartmentSelect />;
};

export default BookingFlowDepartmentPage;
