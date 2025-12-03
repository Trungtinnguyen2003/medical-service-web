// src/routes/routes.js
import RequireAuth from "../components/Auth/RequireAuth"; // 👈 import cái này
import HomePage from "../pages/HomePage/HomePage";
import DepartmentDetail from "../pages/DepartmentDetail/DepartmentDetail";
import Aboutpage from "../pages/Aboutpage/Aboutpage";
import DepartmentsPage from "../pages/DepartmentsPage/DepartmentsPage";
import ServicePage from "../pages/ServicePage/ServicePage";
import ServiceDetail from "../pages/ServiceDetail/ServiceDetail";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import Adminpage from "../pages/Adminpage/Adminpage";
import DoctorTeamPage from "../pages/DoctorTeamPage/DoctorTeamPage";
import DoctorDetailPage from "../pages/DoctorDetailPage/DoctorDetailPage";
import AuthPage from "../pages/AuthPage/AuthPage";
import Bookingpage from "../pages/Bookingpage/Bookingpage";
import DoctorAppointmentList from "../pages/DoctorAppointmentList/DoctorAppointmentList";
import CategoryBlog from "../pages/CategoryBlog/CategoryBlog";
import BlogDetail from "../pages/BlogDetail/BlogDetail";
import ConsultationPage from "../pages/ConsultationPage/ConsultationPage";
import ConsultantChatPage from "../pages/Consultant/ConsultantChatPage";
import BookingFlowPage from "../pages/BookingFlow/BookingFlowPage";
import StepProfile from "../pages/BookingFlow/StepProfile";
import StepConfirm from "../pages/BookingFlow/StepConfirm";
import StepSuccess from "../pages/BookingFlow/StepSuccess";
import StepDoctor from "../pages/BookingFlow/StepDoctor";
import StepProfileCreate from "../pages/BookingFlow/StepProfileCreate";
import StepProfileEdit from "../pages/BookingFlow/StepProfileEdit";
import StepPayment from "../pages/BookingFlow/StepPayment";
import StepPaymentResult from "../pages/BookingFlow/StepPaymentResult";
import BookingFlowDepartmentPage from "../pages/BookingFlowDepartment/BookingFlowDepartmentPage";
import StepDepartmentProfileEdit from "../pages/BookingFlowDepartment/StepDepartmentProfileEdit";
import StepDepartmentProfileCreate from "../pages/BookingFlowDepartment/StepDepartmentProfileCreate";
import StepDepartmentConfirm from "../pages/BookingFlowDepartment/StepDepartmentConfirm";
import StepDepartmentPayment from "../pages/BookingFlowDepartment/StepDepartmentPayment";
import StepSuccessDepartment from "../pages/BookingFlowDepartment/StepSuccessDepartment";
import AppointmentHistoryPage from "../pages/AppointmentHistoryPage/AppointmentHistoryPage";
import PatientProfilePage from "../pages/PatientProfilePage/PatientProfilePage";
// import EditProfile from "../pages/AuthPage/AuthPage";

// 👇 danh sách routes
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/departments/:slug",
    page: () => (
      <RequireAuth>
        <DepartmentDetail />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/services/:id",
    page: () => (
      <RequireAuth>
        <ServiceDetail />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/doctors/:id",
    page: () => (
      <RequireAuth>
        <DoctorDetailPage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  // {
  //   path: "/dat-lich/",
  //   page: () => (
  //     <RequireAuth>
  //       <Bookingpage />
  //     </RequireAuth>
  //   ),
  //   isShowHeader: true,
  // },
  {
    path: "/departments",
    page: DepartmentsPage,
    isShowHeader: true,
  },
  {
    path: "/services",
    page: ServicePage,
    isShowHeader: true,
  },
  {
    path: "/login",
    page: LoginPage,
    isShowHeader: true,
  },
  {
    path: "/register",
    page: RegisterPage,
    isShowHeader: true,
  },
  {
    path: "/about",
    page: Aboutpage,
    isShowHeader: true,
  },
  {
    path: "/admin",
    page: Adminpage,
    isShowHeader: true,
  },
  {
    path: "/profile",
    page: AuthPage,
    isShowHeader: true,
  },
  {
    path: "/doctors",
    page: DoctorTeamPage,
    isShowHeader: true,
  },
  {
    path: "/doctor/appointments",
    page: DoctorAppointmentList,
    isShowHeader: true,
  },
  {
    path: "/posts/:slug",
    page: () => (
      <RequireAuth>
        <BlogDetail />
      </RequireAuth>
    ),
    isShowHeader: true,
  },

  {
    path: "/tin-tuc/danh-muc/:slug",
    page: CategoryBlog,
    isShowHeader: true,
  },
  {
    path: "*",
    page: () => <div>404 - Not Found</div>,
    isShowHeader: false,
  },
  {
    path: "/tu-van",
    page: () => (
      <RequireAuth>
        <ConsultationPage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/dat-lich/",
    page: () => (
      <RequireAuth>
        <Bookingpage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },

  // ==========================
  // 🚀 BOOKING FLOW LIKE MEDPRO
  // ==========================
  {
    path: "/booking",
    page: () => (
      <RequireAuth>
        <BookingFlowPage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },

  {
    path: "/chon-ho-so",
    page: () => (
      <RequireAuth>
        <StepProfile />
      </RequireAuth>
    ),
    isShowHeader: true,
  },

  {
    path: "/xac-nhan-thong-tin",
    page: () => (
      <RequireAuth>
        <StepConfirm />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  // {
  //   path: "/booking",
  //   page: () => <BookingFlowPage />,
  // },
  {
    path: "/booking/create-profile",
    page: () => <StepProfileCreate />,
  },

  {
    path: "/dat-lich-thanh-cong",
    page: StepSuccess,
    isShowHeader: true,
  },
  { path: "/consultant/chat", page: ConsultantChatPage },
  {
    path: "/booking/edit-profile/:id",
    page: () => (
      <RequireAuth>
        <StepProfileEdit />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/thanh-toan",
    page: () => (
      <RequireAuth>
        <StepPayment />
      </RequireAuth>
    ),
    isShowHeader: true,
  },

  {
    path: "/ket-qua-thanh-toan",
    page: () => (
      <RequireAuth>
        <StepPaymentResult />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/booking-department",
    page: () => (
      <RequireAuth>
        <BookingFlowDepartmentPage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/booking-department/create-profile",
    page: () => (
      <RequireAuth>
        <StepDepartmentProfileCreate />
      </RequireAuth>
    ),
    isShowHeader: true,
  },

  {
    path: "/booking-department/edit-profile/:id",
    page: () => (
      <RequireAuth>
        <StepDepartmentProfileEdit />
      </RequireAuth>
    ),
    isShowHeader: true,
  },

  {
    path: "/booking-department/confirm",
    page: () => (
      <RequireAuth>
        <StepDepartmentConfirm />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/booking-department/payment",
    page: () => (
      <RequireAuth>
        <StepDepartmentPayment />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/dat-lich-thanh-cong-khoa",
    page: StepSuccessDepartment,
    isShowHeader: true,
  },
  {
    path: "/hoso-benh-nhan",
    page: () => (
      <RequireAuth>
        <PatientProfilePage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
  {
    path: "/phieu-kham-benh",
    page: () => (
      <RequireAuth>
        <AppointmentHistoryPage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
];
