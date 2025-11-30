const bcrypt = require("bcryptjs");
const db = require("../models");
const Doctor = db.Doctor;
const Department = db.Department;
const { generateUniqueSlug } = require("../utils/slugify");

const doctorService = require("../services/doctor.service");

const getAllDoctors = async (req, res) => {
  try {
    const result = await doctorService.getAll();

    // ✅ Chỉ lọc những bác sĩ có user.status = "approved"
    const approvedDoctors = result.filter(
      (doc) => doc.user && doc.user.status === "approved"
    );

    res.json(approvedDoctors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách bác sĩ", error: err.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;

    const doctor = await db.Doctor.findByPk(id, {
      include: [
        {
          model: db.ClinicRoom,
          as: "clinicRoom", // ← phòng khám
        },
        {
          model: db.Department,
          as: "departments", // ← chuyên khoa
          through: { attributes: [] },
        },
        {
          model: db.Service,
          as: "services", // ← dịch vụ
          through: { attributes: [] },
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    }

    return res.json(doctor);
  } catch (err) {
    console.error("Lỗi:", err);
    return res.status(500).json({ message: "Lỗi", error: err.message });
  }
};

const createDoctor = async (req, res) => {
  try {
    const { departmentIds = [], serviceIds = [], ...doctorData } = req.body;

    if (!doctorData.name)
      return res.status(400).json({ message: "Thiếu tên bác sĩ" });

    // Tự sinh slug
    doctorData.slug = await generateUniqueSlug(doctorData.name, Doctor);

    const newDoctor = await doctorService.create(doctorData);

    if (Array.isArray(departmentIds)) {
      await newDoctor.setDepartments(departmentIds);
    }

    if (Array.isArray(serviceIds)) {
      await newDoctor.setServices(serviceIds);
    }

    res
      .status(201)
      .json({ message: "Tạo bác sĩ thành công", doctor: newDoctor });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo bác sĩ", error: err.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { departmentIds = [], serviceIds = [], ...doctorData } = req.body;

    const doctor = await doctorService.update(req.params.id, doctorData);
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });

    if (Array.isArray(departmentIds)) {
      await doctor.setDepartments(departmentIds);
    }

    if (Array.isArray(serviceIds)) {
      await doctor.setServices(serviceIds);
    }

    res.json({ message: "Cập nhật bác sĩ thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const success = await doctorService.remove(req.params.id);
    if (!success)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json({ message: "Xoá bác sĩ thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

const setDepartments = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });

    const { departmentIds } = req.body;
    if (!Array.isArray(departmentIds)) {
      return res
        .status(400)
        .json({ message: "Dữ liệu chuyên khoa phải là mảng" });
    }

    await doctor.setDepartments(departmentIds);
    res.json({ message: "Đã cập nhật chuyên khoa cho bác sĩ." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật chuyên khoa", error: err.message });
  }
};

const getDepartmentsOfDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: Department, as: "departments" }],
    });
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json(doctor.departments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy chuyên khoa", error: err.message });
  }
};

// Lấy thông tin bác sĩ theo user_id
const getDoctorByUserId = async (req, res) => {
  try {
    const doctor = await db.Doctor.findOne({
      where: { user_id: req.params.userId },
      include: [
        {
          model: db.Department,
          as: "departments",
          through: { attributes: [] },
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Lỗi getDoctorByUserId:", err);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// Lấy danh sách bác sĩ theo khoa (chỉ hiện đã phê duyệt)
// controller: doctor.controller.js
const getDoctorsByDepartment = async (req, res) => {
  try {
    const department = await db.Department.findByPk(req.params.id);
    if (!department)
      return res.status(404).json({ message: "Không tìm thấy chuyên khoa" });

    const doctors = await department.getDoctors({
      include: [
        {
          model: db.User,
          required: true, // 🔴 Bắt buộc phải join được user
          where: { status: "approved" }, // 🔴 Chỉ lấy bác sĩ có user được duyệt
          attributes: ["id", "email", "name", "status"],
        },
      ],
    });

    res.json(doctors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách bác sĩ", error: err.message });
  }
};

// Gán danh sách dịch vụ cho bác sĩ
const setServices = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { serviceIds, departmentId } = req.body;

    if (!Array.isArray(serviceIds) || !departmentId) {
      return res
        .status(400)
        .json({ message: "Thiếu danh sách dịch vụ hoặc khoa" });
    }

    // Xoá các gán cũ của khoa này
    await db.DoctorService.destroy({
      where: { doctorId, departmentId },
    });

    // Tạo gán mới
    const data = serviceIds.map((sid) => ({
      doctorId,
      serviceId: sid,
      departmentId,
    }));

    await db.DoctorService.bulkCreate(data);

    res.json({ message: "✅ Đã gán dịch vụ cho bác sĩ theo khoa" });
  } catch (err) {
    console.error("Lỗi setServices:", err);
    res.status(500).json({ message: err.message });
  }
};

const getServicesOfDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const records = await db.DoctorService.findAll({
      where: { doctorId },
      include: [
        {
          model: db.Service,
          as: "service",
          attributes: ["id", "title"],
        },
        {
          model: db.Department,
          as: "assignedDepartment", // alias chính xác trong model
          attributes: ["id", "name"],
        },
      ],
    });

    const result = records.map((r) => ({
      id: r.service.id,
      title: r.service.title,
      department: r.assignedDepartment,
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi getServicesOfDoctor:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Lấy danh sách bác sĩ thực hiện một dịch vụ
const getDoctorsByService = async (req, res) => {
  try {
    const service = await db.Service.findByPk(req.params.id, {
      include: [
        {
          model: db.Doctor,
          as: "doctors",
          include: [
            {
              model: db.User,
              required: true,
              where: { status: "approved" },
              attributes: ["id", "name", "email", "status"],
            },
          ],
          through: { attributes: [] },
        },
      ],
    });

    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    res.json(service.doctors);
  } catch (err) {
    console.error("Lỗi getDoctorsByService:", err);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

// ✅ Tạo bác sĩ kèm tài khoản
const createDoctorWithAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      title,
      degree,
      position,
      experience_years,
      description,
      work_history,
      education_history,
      extra_info,
      slug,
    } = req.body;

    // 1️⃣ Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }

    // 2️⃣ Kiểm tra email có tồn tại
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // 3️⃣ Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Tạo user
    const newUser = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      status: "approved",
    });

    // 5️⃣ Tạo hồ sơ bác sĩ
    const doctor = await db.Doctor.create({
      name,
      slug,
      phone,
      title,
      degree,
      position,
      experience_years,
      description,
      work_history,
      education_history,
      extra_info,
      user_id: newUser.id,
    });

    return res.status(201).json({
      message: "✅ Tạo bác sĩ và tài khoản thành công",
      doctor,
      account: { email },
    });
  } catch (error) {
    console.error("🔥 Lỗi khi tạo bác sĩ kèm tài khoản:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy danh sách khung giờ trống của bác sĩ theo ngày
// ✅ Lấy danh sách khung giờ bác sĩ làm việc theo ngày được chọn
// ✅ Hiển thị khung giờ bác sĩ còn trống (không cần slot_id)
const getAvailableSlots = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const date = req.query.date;
    if (!date) return res.status(400).json({ message: "Thiếu ngày" });

    const jsDate = new Date(date);
    const dayOfWeek = jsDate.getDay() === 0 ? 7 : jsDate.getDay();

    const schedules = await db.DoctorSchedule.findAll({
      where: { doctor_id: doctorId, day_of_week: dayOfWeek },
      include: [
        {
          model: db.TimeSlot,
          as: "timeSlots",
          through: db.DoctorScheduleSlot,
        },
      ],
    });

    if (!schedules || schedules.length === 0) return res.json([]);

    const bookedAppointments = await db.Appointment.findAll({
      where: {
        doctor_id: doctorId,
        appointment_date: date,
        status: { [db.Sequelize.Op.in]: ["pending", "confirmed"] },
      },
      attributes: ["slot_id"], // ⭐ quan trọng
    });

    const bookedSlotIds = bookedAppointments.map((b) => b.slot_id);

    const slots = schedules.flatMap((s) =>
      s.timeSlots.map((slot) => ({
        id: slot.id,
        label: slot.label,
        period: slot.period,
        isBooked: bookedSlotIds.includes(slot.id), // ⭐ check đúng theo slot_id
      }))
    );

    return res.json(slots);
  } catch (err) {
    console.error("❌ Lỗi getAvailableSlots:", err);
    res.status(500).json({ message: "Lỗi khi lấy khung giờ" });
  }
};

const getAvailableDays = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Lấy schedule của bác sĩ
    const schedules = await db.DoctorSchedule.findAll({
      where: { doctor_id: doctorId },
      attributes: ["day_of_week"],
    });

    if (!schedules || schedules.length === 0) {
      return res.json([]);
    }

    // Danh sách thứ bác sĩ làm việc
    const workingDays = schedules.map((s) => s.day_of_week);

    // Tạo danh sách ngày trong 30 ngày tới
    const today = new Date();
    const availableDays = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      // convert JS Sunday = 0 → 7
      const dow = d.getDay() === 0 ? 7 : d.getDay();

      if (workingDays.includes(dow)) {
        availableDays.push(d.toLocaleDateString("en-CA"));
      }
    }

    return res.json(availableDays);
  } catch (error) {
    console.error("❌ Lỗi getAvailableDays:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// ⭐ Lấy bác sĩ làm việc theo ngày (KHÔNG kiểm tra slot)
const getDoctorsWorkingOnDay = async (req, res) => {
  try {
    const { departmentId, date } = req.query;

    if (!departmentId || !date) {
      return res.status(400).json({ message: "Thiếu departmentId hoặc date" });
    }

    const jsDate = new Date(date);
    const dayOfWeek = jsDate.getDay() === 0 ? 7 : jsDate.getDay();

    const department = await db.Department.findByPk(departmentId, {
      include: [{ model: db.Doctor, as: "doctors" }],
    });

    if (!department) {
      return res.status(404).json({ message: "Không tìm thấy chuyên khoa" });
    }

    const doctors = [];

    for (const doctor of department.doctors) {
      const schedule = await db.DoctorSchedule.findOne({
        where: { doctor_id: doctor.id, day_of_week: dayOfWeek },
      });

      if (schedule) {
        doctors.push(doctor);
      }
    }

    return res.json(doctors);
  } catch (err) {
    console.error("Lỗi getDoctorsWorkingOnDay:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  setDepartments,
  getDepartmentsOfDoctor,
  getDoctorByUserId,
  getDoctorsByDepartment,
  setServices,
  getServicesOfDoctor,
  getDoctorsByService,
  createDoctorWithAccount,
  getAvailableSlots,
  getAvailableDays,
  getDoctorsWorkingOnDay,
};
