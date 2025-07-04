import React from 'react';
import DepartmentBanner from '../../components/DepartmentBanner/DepartmentBanner';
import DepartmentListFull from '../../components/DepartmentListFull/DepartmentListFull';
import WorkingProcessSection from '../../components/WorkingProcessSection/WorkingProcessSection';
import FAQSection from '../../components/FAQSection/FAQSection';
import DoctorListSection from '../../components/DoctorListSection/DoctorListSection';

const DepartmentsPage = () => {
  return (
    <>
      <DepartmentBanner />
      <DepartmentListFull />
      <WorkingProcessSection />
      <FAQSection />
      <DoctorListSection />
    </>
  );
};

export default DepartmentsPage;
