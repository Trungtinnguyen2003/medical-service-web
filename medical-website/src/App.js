import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GlobalStyle } from "./styles/globalStyles";
import AOS from "aos";
import "aos/dist/aos.css";
import { routes } from "./routes";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import RequireAuth from "./components/Auth/RequireAuth"; // thêm dòng này
import RequireAdmin from "./components/Auth/RequireAdmin";
import RequireDoctor from "./components/Auth/RequireDoctor";

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const hideFooter = ["/login", "/register", "/admin"].includes(
    location.pathname
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {routes.map((route, index) => {
          const Page = route.page;
          const element =
            route.path === "/profile" ? (
              <RequireAuth>
                <Page />
              </RequireAuth>
            ) : route.path === "/admin" ? (
              <RequireAdmin>
                <Page />
              </RequireAdmin>
            ) : route.path === "/doctor/appointments" ? (
              <RequireDoctor>
                <Page />
              </RequireDoctor>
            ) : (
              <Page />
            );

          return <Route key={index} path={route.path} element={element} />;
        })}
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, once: false });
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
