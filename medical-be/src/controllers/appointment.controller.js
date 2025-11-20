const appointmentService = require("../services/appointment.service");
const autoAssignService = require("../services/appointmentAutoAssign.service");
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
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Người dùng chưa xác thực" });

    const doctor = await db.Doctor.findOne({ where: { user_id: userId } });
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });

    // ✅ chỉ lấy lịch đã duyệt hoặc đã khám
    const appointments = await db.Appointment.findAll({
      where: {
        doctor_id: doctor.id,
        status: ["confirmed", "done"],
      },
      include: [
        {
          model: db.PatientProfile,
          as: "patientProfile",
          attributes: [
            "id",
            "full_name",
            "gender",
            "date_of_birth",
            "phone",
            "address",
            "job",
            "ethnicity",
            "nationality",
            "id_type",
            "id_number",
          ],
        },
        {
          model: db.Service,
          as: "bookedService",
          attributes: ["id", "title", "price"],
        },
        {
          model: db.ServicePackage,
          as: "servicePackage",
          attributes: ["id", "name"],
        },
        {
          model: db.Department,
          attributes: ["id", "name"],
        },
      ],

      order: [["appointment_date", "ASC"]],
    });

    return res.status(200).json(appointments);
  } catch (err) {
    console.error("🔥 Lỗi khi lấy lịch khám của bác sĩ:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
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

//     if (package_id) {
//       const userId = req.user?.id || null;
//       const appointment = await db.Appointment.create({
//         ...rest,
//         user_id: userId,
//         package_id,
//         service_id: null,
//         doctor_id: null,
//         appointment_date,
//         appointment_time,
//       });

//       return res.status(201).json(appointment);
//     }

//     // Dịch vụ lẻ: phải có doctor
//     if (!doctor_id) {
//       return res
//         .status(400)
//         .json({ message: "Cần chọn bác sĩ cho dịch vụ lẻ" });
//     }

//     const [hour, minute] = appointment_time.split(":").map(Number);
//     const currentMinutes = hour * 60 + minute;
//     const minTime = currentMinutes - 10;
//     const maxTime = currentMinutes + 10;

//     const existingAppointments = await db.Appointment.findAll({
//       where: {
//         doctor_id,
//         appointment_date,
//         status: {
//           [Op.notIn]: ["cancelled", "done"],
//         },
//       },
//     });

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
//       user_id: userId,
//       package_id: null,
//       service_id,
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
    const { service_id, doctor_id, appointment_date, slot_id, ...rest } =
      req.body;

    if (!doctor_id || !appointment_date || !slot_id) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const slot = await db.TimeSlot.findByPk(slot_id);
    if (!slot) {
      return res.status(404).json({ message: "Không tìm thấy khung giờ" });
    }

    const appointment_time = slot.label;

    const existing = await db.Appointment.findOne({
      where: {
        doctor_id,
        appointment_date,
        appointment_time,
        status: { [db.Sequelize.Op.in]: ["pending", "confirmed"] },
      },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Khung giờ này đã có bệnh nhân khác đặt." });
    }

    // ⭐ LẤY PHÒNG KHÁM CỦA BÁC SĨ
    const doctor = await db.Doctor.findByPk(doctor_id);
    const clinic_room_id = doctor?.clinic_room_id || null;

    const userId = req.user?.id || null;

    const appointment = await db.Appointment.create({
      ...rest,
      user_id: userId,
      service_id,
      doctor_id,
      appointment_date,
      appointment_time,
      clinic_room_id, // ⭐ TỰ GÁN PHÒNG KHÁM
      status: "pending",
    });

    res.status(201).json({
      message: "Đặt lịch thành công!",
      appointment,
    });
  } catch (err) {
    console.error("❌ Lỗi tạo lịch:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi tạo lịch hẹn", error: err.message });
  }
};

// const getAllAppointments = async (req, res) => {
//   try {
//     const appointments = await appointmentService.getAll();
//     res.json(appointments);
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
//   }
// };

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await db.Appointment.findAll({
      include: [
        {
          model: db.PatientProfile,
          as: "patientProfile",
          attributes: [
            "id",
            "full_name",
            "date_of_birth",
            "gender",
            "phone",
            "job",
            "ethnicity",
            "nationality",
            "id_type",
            "id_number",
            "address",
          ],
        },
        {
          model: db.Department,
          attributes: ["id", "name"],
        },
        {
          model: db.Doctor,
          as: "appointedDoctor",
          attributes: ["id", "name"],
        },
        {
          model: db.Service,
          as: "bookedService",
          attributes: ["id", "title", "price"],
        },
      ],
      order: [["appointment_date", "DESC"]],
    });

    res.json(appointments);
  } catch (err) {
    console.error("🔥 Lỗi lấy danh sách lịch:", err);
    res.status(500).json({
      message: "Lỗi lấy danh sách lịch",
      error: err.message,
    });
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

// const deleteAppointment = async (req, res) => {
//   try {
//     await appointmentService.remove(req.params.id);
//     res.json({ message: "Xoá lịch hẹn thành công" });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi xoá", error: err.message });
//   }
// };

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    // Chỉ cho phép xoá nếu trạng thái là 'confirmed' (đã khám) hoặc 'cancelled'
    if (
      appointment.status !== "done" &&
      appointment.status !== "cancelled" &&
      appointment.status !== "pending"
    ) {
      return res
        .status(400)
        .json({ message: "Chỉ có thể xoá lịch đã khám xong hoặc bị từ chối" });
    }

    await appointment.destroy();
    res.json({ message: "Xoá lịch hẹn thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá lịch hẹn", error: err.message });
  }
};

// ✅ DUYỆT LỊCH — idempotent & log rõ
const approveAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(
      "🔔 approveAppointment called with id =",
      id,
      "by user =",
      req.user
    );

    const appointment = await db.Appointment.findByPk(id, {
      include: [
        { model: db.Doctor, as: "appointedDoctor" }, // alias từ Appointment.associate
        { model: db.User, as: "patient" }, // alias từ Appointment.associate
        { model: db.Service, as: "bookedService" }, // alias từ Appointment.associate
        { model: db.ServicePackage, as: "servicePackage" }, // alias từ Appointment.associate
        { model: db.Department }, // không dùng alias
      ],
    });

    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    // 👉 Cho phép bấm duyệt nhiều lần mà không lỗi (idempotent)
    if (appointment.status === "confirmed") {
      return res.json({ message: "Lịch đã duyệt trước đó", appointment });
    }

    // ⛔ Không cho duyệt nếu đã done/cancelled
    if (appointment.status === "done" || appointment.status === "cancelled") {
      return res
        .status(409)
        .json({ message: "Lịch đã hoàn tất hoặc bị từ chối, không thể duyệt" });
    }

    // ✅ Chỉ case 'pending' mới đổi sang 'confirmed'
    appointment.status = "confirmed";
    await appointment.save();

    // ✅ “Gửi” cho bác sĩ (log) nếu có doctor_id
    if (appointment.doctor_id) {
      const doctor = await db.Doctor.findByPk(appointment.doctor_id, {
        include: [{ model: db.User, as: "user" }], // ⚠ alias phải khớp với Doctor.belongsTo(User, { as: "user" })
      });

      if (doctor?.user?.email) {
        console.log(
          `📩 ĐÃ GỬI LỊCH CHO BÁC SĨ: ${doctor.name} (${doctor.user.email}) | BN: ${appointment.name} | ${appointment.appointment_date} ${appointment.appointment_time}`
        );
        // TODO: Nodemailer gửi email thật nếu cần
      } else {
        console.log(
          "ℹ️ Lịch đã duyệt, nhưng chưa có email bác sĩ hoặc chưa gán bác sĩ."
        );
      }
    } else {
      console.log("ℹ️ Lịch đã duyệt, nhưng chưa gán bác sĩ.");
    }

    return res.json({
      message: "✅ Duyệt thành công & gửi cho bác sĩ (nếu có)",
      appointment,
    });
  } catch (error) {
    console.error("🔥 Lỗi khi duyệt lịch:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server khi duyệt lịch", error: error.message });
  }
};

// ❌ TỪ CHỐI LỊCH — giữ nguyên logic, thêm idempotent nhẹ
const rejectAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    console.log(
      "🔔 rejectAppointment called with id =",
      id,
      "reason =",
      reason
    );

    const appointment = await db.Appointment.findByPk(id);
    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });

    if (appointment.status === "cancelled") {
      return res.json({ message: "Lịch đã bị từ chối trước đó", appointment });
    }
    if (appointment.status === "done") {
      return res
        .status(409)
        .json({ message: "Lịch đã khám, không thể từ chối" });
    }

    appointment.status = "cancelled";
    appointment.doctor_note = reason || null;
    await appointment.save();

    return res.json({ message: "❌ Đã từ chối lịch", appointment });
  } catch (error) {
    console.error("🔥 Lỗi khi từ chối lịch:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server khi từ chối", error: error.message });
  }
};

// ✅ Bác sĩ cập nhật trạng thái (đã khám hoặc hủy)
const doctorUpdateStatus = async (req, res) => {
  try {
    const doctorUserId = req.user.id;
    const { id } = req.params; // appointment id
    const { status } = req.body; // "done" hoặc "cancelled"

    // Tìm bác sĩ tương ứng với tài khoản
    const doctor = await db.Doctor.findOne({
      where: { user_id: doctorUserId },
    });
    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    }

    // Tìm lịch hẹn
    const appointment = await db.Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    // Kiểm tra quyền
    if (appointment.doctor_id !== doctor.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền cập nhật lịch này" });
    }

    // Kiểm tra trạng thái hợp lệ
    if (!["done", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    appointment.status = status;
    await appointment.save();

    return res.json({
      message:
        status === "done"
          ? "✅ Đã xác nhận khám xong"
          : "❌ Lịch hẹn đã bị hủy",
      appointment,
    });
  } catch (err) {
    console.error("🔥 Lỗi khi bác sĩ cập nhật trạng thái:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const appointment = await db.Appointment.findByPk(id);
    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch" });

    // ✅ Loại bỏ service_id & package_id nếu FE gửi lên (không cho sửa)
    delete data.service_id;
    delete data.package_id;

    // ✅ Chuẩn hóa các giá trị rỗng thành null
    for (const key in data) {
      if (data[key] === "") data[key] = null;
    }

    // ✅ Cập nhật
    await appointment.update(data);

    res.json({ message: "Cập nhật thành công", appointment });
  } catch (err) {
    console.error("🔥 Lỗi cập nhật lịch:", err);
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

const autoAssign = async (req, res) => {
  try {
    const user_id = req.user?.id;

    const result = await autoAssignService.assign({
      ...req.body,
      user_id,
    });

    return res.json({
      message: "Đặt lịch thành công (tự phân công bác sĩ)",
      doctor_assigned: result.doctor,
      appointment: result.appointment,
    });
  } catch (err) {
    console.error("❌ Lỗi auto-assign:", err);
    return res.status(400).json({ message: err.message });
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
  deleteAppointment,
  approveAppointment,
  rejectAppointment,
  doctorUpdateStatus,
  updateAppointment,
  autoAssign,
};
