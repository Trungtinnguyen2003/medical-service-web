import React from "react";
import { useSearchParams } from "react-router-dom";

import StepDepartmentSelect from "./StepDepartmentSelect";
import StepDepartmentService from "./StepDepartmentService";
// import StepDepartmentDate from "./StepDepartmentDate";
// import StepDepartmentTime from "./StepDepartmentTime";

const BookingFlowDepartmentPage = () => {
  const [params] = useSearchParams();
  const step = params.get("step") || "department";

  // Bước 1: Chọn chuyên khoa
  if (step === "department") return <StepDepartmentSelect />;

  // Bước 2: Chọn dịch vụ của chuyên khoa
  if (step === "service") return <StepDepartmentService />;

  // Bước 3 & 4: Sau này bạn muốn làm lịch theo chuyên khoa
  // if (step === "date") return <StepDepartmentDate />;
  // if (step === "time") return <StepDepartmentTime />;

  return <StepDepartmentSelect />;
};

export default BookingFlowDepartmentPage;
