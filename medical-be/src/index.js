const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const sequelize = require("./config/db.config");
const db = require("./models"); // ✨ Import models
const authRoutes = require("./routes/auth.routes");
const departmentRoutes = require("./routes/department.routes");
const serviceRoutes = require("./routes/service.routes");
const doctorRoutes = require("./routes/doctor.routes");
const servicePackageRoutes = require("./routes/servicePackage.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");
const postCategoryRoutes = require("./routes/postCategory.routes");
const postRoutes = require("./routes/post.routes");

const app = express();
app.use(cors());
app.use(express.json());

// Kiểm tra route test
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Kết nối MySQL
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connected");

    // Đồng bộ CSDL an toàn (không xoá dữ liệu)
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ All models synchronized with database.");
  })
  .catch((err) => {
    console.error("❌ Connection or Sync error:", err);
  });

// Khai báo các route
app.use("/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/post-categories", postCategoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/doctors", doctorRoutes);
app.use("/packages", servicePackageRoutes);
app.use(
  "/appointments",
  (req, res, next) => {
    console.log("🔥 appointments route accessed");
    next();
  },
  appointmentRoutes
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/users", require("./routes/user.routes"));
app.use("/posts", postRoutes);
app.use("/post-categories", postCategoryRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
