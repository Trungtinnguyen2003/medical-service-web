const appointmentService = require("../services/appointment.service");
const db = require("../models");
const Appointment = db.Appointment;
const { Op } = require("sequelize");

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await db.Appointment.findAll({
      where: { userId: req.user.id }, // hoặc user_id tuỳ cách đặt
      include: [
        { model: db.Doctor, attributes: ["id", "name"] },
        { model: db.Service, attributes: ["id", "title"] },
        { model: db.ServicePackage, attributes: ["id", "name"] },
      ],
      order: [["appointment_date", "DESC"]],
    });

    res.json(appointments); // ✅ Chỉ giữ lại 1 lần gọi
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy lịch sử", error: err.message });
  }
};

const getAppointmentsByDoctor = async (req, res) => {
  try {
    console.log("💡 [GET] /appointments/doctor - Controller accessed");

    // Kiểm tra user gửi kèm token có tồn tại không
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Người dùng chưa xác thực" });
    }

    // Tìm bác sĩ tương ứng với user
    const doctor = await db.Doctor.findOne({ where: { user_id: userId } });

    if (!doctor) {
      console.warn("❌ Không tìm thấy bác sĩ cho user_id:", userId);
      return res.status(404).json({
        message: "Không tìm thấy bác sĩ tương ứng với tài khoản này",
      });
    }

    console.log("🔍 Tìm thấy doctor.id =", doctor.id);

    // Lấy tất cả lịch hẹn theo doctor_id
    const appointments = await db.Appointment.findAll({
      where: { doctor_id: doctor.id },
      include: [
        {
          model: db.User,
          attributes: [
            "id",
            "name",
            "email",
            "phone",
            "gender",
            "date_of_birth",
            "address",
          ],
        },
        {
          model: db.Service,
          attributes: ["id", "title"],
        },
        {
          model: db.ServicePackage,
          attributes: ["id", "name"],
        },
      ],
      order: [["appointment_date", "DESC"]],
    });

    console.log("📅 Số lịch hẹn tìm được:", appointments.length);
    res.status(200).json(appointments);
  } catch (err) {
    console.error("🔥 Lỗi khi lấy lịch khám của bác sĩ:", err);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi máy chủ", error: err.message });
  }
};

// const createAppointment = async (req, res) => {
//   try {
//     const {
//       service_id,
//       package_id,
//       doctor_id,
//       appointment_date,
//       appointment_time,
//       ...rest
//     } = req.body;

//     if (service_id && package_id) {
//       return res.status(400).json({
//         message: "Chỉ được chọn 1 trong 2: gói dịch vụ hoặc dịch vụ lẻ",
//       });
//     }

//     // ✅ Tính khoảng thời gian ±10 phút
//     const [hour, minute] = appointment_time.split(":").map(Number);
//     const currentMinutes = hour * 60 + minute;
//     const minTime = currentMinutes - 10;
//     const maxTime = currentMinutes + 10;

//     // ✅ Lấy danh sách lịch trong ngày đó của bác sĩ
//     const existingAppointments = await db.Appointment.findAll({
//       where: {
//         doctor_id,
//         appointment_date,
//         status: {
//           [Op.notIn]: ["cancelled", "done"], // ✅ chỉ kiểm tra các lịch chưa khám
//         },
//       },
//     });

//     // ✅ Kiểm tra xem có lịch nào cách dưới 10 phút không
//     const isOverlapping = existingAppointments.some((appt) => {
//       const [h, m] = appt.appointment_time.split(":").map(Number);
//       const apptMin = h * 60 + m;
//       return apptMin >= minTime && apptMin <= maxTime;
//     });

//     if (isOverlapping) {
//       return res.status(400).json({
//         message:
//           "Bác sĩ đã có lịch khám trong khoảng thời gian này. Vui lòng chọn khung giờ khác.",
//       });
//     }

//     const userId = req.user?.id || null;

//     const appointment = await db.Appointment.create({
//       ...rest,
//       service_id,
//       package_id,
//       user_id: userId,
//       doctor_id,
//       appointment_date,
//       appointment_time,
//     });

//     res.status(201).json(appointment);
//   } catch (err) {
//     console.error("❌ Lỗi tạo lịch:", err);
//     res.status(500).json({ message: "Lỗi tạo lịch", error: err.message });
//   }
// };

const createAppointment = async (req, res) => {
  try {
    const {
      service_id,
      package_id,
      doctor_id,
      appointment_date,
      appointment_time,
      ...rest
    } = req.body;

    if (service_id && package_id) {
      return res.status(400).json({
        message: "Chỉ được chọn 1 trong 2: gói dịch vụ hoặc dịch vụ lẻ",
      });
    }

    if (package_id) {
      const userId = req.user?.id || null;
      const appointment = await db.Appointment.create({
        ...rest,
        user_id: userId,
        package_id,
        service_id: null,
        doctor_id: null,
        appointment_date,
        appointment_time,
      });

      return res.status(201).json(appointment);
    }

    // Dịch vụ lẻ: phải có doctor
    if (!doctor_id) {
      return res
        .status(400)
        .json({ message: "Cần chọn bác sĩ cho dịch vụ lẻ" });
    }

    const [hour, minute] = appointment_time.split(":").map(Number);
    const currentMinutes = hour * 60 + minute;
    const minTime = currentMinutes - 10;
    const maxTime = currentMinutes + 10;

    const existingAppointments = await db.Appointment.findAll({
      where: {
        doctor_id,
        appointment_date,
        status: {
          [Op.notIn]: ["cancelled", "done"],
        },
      },
    });

    const isOverlapping = existingAppointments.some((appt) => {
      const [h, m] = appt.appointment_time.split(":").map(Number);
      const apptMin = h * 60 + m;
      return apptMin >= minTime && apptMin <= maxTime;
    });

    if (isOverlapping) {
      return res.status(400).json({
        message:
          "Bác sĩ đã có lịch khám trong khoảng thời gian này. Vui lòng chọn khung giờ khác.",
      });
    }

    const userId = req.user?.id || null;
    const appointment = await db.Appointment.create({
      ...rest,
      user_id: userId,
      package_id: null,
      service_id,
      doctor_id,
      appointment_date,
      appointment_time,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("❌ Lỗi tạo lịch:", err);
    res.status(500).json({ message: "Lỗi tạo lịch", error: err.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAll();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn", error: err.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const appointment = await db.Appointment.findByPk(id);
    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Cập nhật trạng thái thành công", appointment });
  } catch (error) {
    console.error("Lỗi cập nhật status:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await appointmentService.remove(req.params.id);
    res.json({ message: "Xoá lịch hẹn thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá", error: err.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getMyAppointments,
  getAppointmentsByDoctor,
};
