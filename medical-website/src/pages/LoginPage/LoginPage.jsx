import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import bgImg from "../../assets/images/6.jpg";
import decorImg from "../../assets/images/6.jpg";
import { styles } from "./style";
import { login, getProfileByToken  } from "../../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      const token = res.data.token;
      localStorage.setItem("token", token);
  
      const profile = await getProfileByToken();
      const { id, role, status } = profile.data;
  
      // Kiểm tra trạng thái tài khoản bác sĩ
      if (role === "doctor") {
        if (status === "pending") {
          alert("Tài khoản bác sĩ đang chờ phê duyệt.");
          return;
        }
        if (status === "rejected") {
          alert("Tài khoản bác sĩ đã bị từ chối.");
          return;
        }
      }
  
      localStorage.setItem("userId", id);
      localStorage.setItem("userRole", role);
  
      alert("Đăng nhập thành công");
  
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "doctor") {
        navigate("/doctor/appointments");
      } else {
        navigate("/");
      }
  
    } catch (err) {
      console.error("Đăng nhập thất bại", err);
      alert("Đăng nhập thất bại: " + (err.response?.data?.message || err.message));
    }
  };
  
  
  

  return (
    <div style={{ ...styles.wrapper, backgroundImage: `url(${bgImg})` }}>
      <div style={styles.card}>
        <div style={styles.topSection}>
          <img src={decorImg} alt="decor" style={styles.decorImage} />
          <h2 style={styles.title}>CHÀO MỪNG BẠN ĐẾN VỚI WEBSITE</h2>
          <p style={styles.desc}>
  Hệ thống chăm sóc sức khỏe hiện đại – nơi bạn có thể tra cứu, đặt lịch và theo dõi dịch vụ y tế dễ dàng.
</p>
          <a href="/register" style={styles.link}>Đăng Kí Tài Khoản</a>
        </div>
        <div style={styles.body}>
          <h3 style={styles.sectionTitle}>USER LOGIN</h3>
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <FaEnvelope style={styles.icon} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <FaLock style={styles.icon} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.row}>
              <label style={styles.remember}>
                <input type="checkbox" /> Remember
              </label>
              <a href="#" style={styles.forgot}>Forgot password?</a>
            </div>
            <button style={styles.button} type="submit">LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
