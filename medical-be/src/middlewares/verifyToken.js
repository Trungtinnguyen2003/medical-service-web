const jwt = require("jsonwebtoken");
const db = require("../models");

// ✅ Xác thực token và gắn thông tin user vào req.user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("❌ Không có token");
    return res.status(401).json({ message: "Chưa đăng nhập hoặc thiếu token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Token hợp lệ:", decoded);
    next();
  } catch (err) {
    console.log("❌ Token lỗi:", err.message);
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ✅ Chỉ cho phép bác sĩ
const checkDoctor = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res
      .status(403)
      .json({ message: "Chỉ bác sĩ mới được phép truy cập" });
  }
  next();
};

// ✅ Cho phép admin hoặc chính bác sĩ đang login chỉnh sửa chính mình
const checkDoctorSelfOrAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const doctorId = parseInt(req.params.id);

  if (userRole === "admin") return next();

  if (userRole === "doctor") {
    try {
      const doctor = await db.Doctor.findOne({ where: { user_id: userId } });
      if (!doctor) {
        return res.status(403).json({ message: "Không tìm thấy bác sĩ" });
      }

      if (doctor.id === doctorId) {
        return next();
      } else {
        return res
          .status(403)
          .json({ message: "Bạn chỉ được sửa hồ sơ của chính mình" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi máy chủ", error: err.message });
    }
  }

  return res.status(403).json({ message: "Không có quyền truy cập" });
};

module.exports = {
  verifyToken,
  checkDoctor,
  checkDoctorSelfOrAdmin, // ✅ thêm vào xuất khẩu
};
