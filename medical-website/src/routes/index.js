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
import ProfilePage from "../pages/AuthPage/ProfilePage";
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
  {
    path: "/dat-lich/",
    page: () => (
      <RequireAuth>
        <Bookingpage />
      </RequireAuth>
    ),
    isShowHeader: true,
  },
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
    page: ProfilePage,
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
];
