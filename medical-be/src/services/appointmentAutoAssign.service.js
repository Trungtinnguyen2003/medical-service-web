// src/services/appointmentAutoAssign.service.js
const db = require("../models");
const { Op } = require("sequelize");

class AutoAssignService {
  async assign({ department_id, service_id, appointment_date, slot_id }) {
    // ============================
    // 1. LẤY CHUYÊN KHOA
    // ============================
    const department = await db.Department.findByPk(department_id);
    if (!department) throw new Error("Không tìm thấy chuyên khoa");

    // ============================
    // 2. LẤY SLOT ĐỂ LẤY GIỜ + BUỔI
    // ============================
    const slot = await db.TimeSlot.findByPk(slot_id);
    if (!slot) throw new Error("Không tìm thấy khung giờ");

    const appointment_time = slot.label;
    const slot_period = slot.period; // morning / afternoon

    // ============================
    // 3. LẤY DANH SÁCH BÁC SĨ TRONG KHOA
    // ============================
    const doctors = await department.getDoctors();
    if (doctors.length === 0) {
      throw new Error("Không có bác sĩ trong chuyên khoa này");
    }

    // ============================
    // 4. LỌC BÁC SĨ CÓ LÀM DỊCH VỤ NÀY
    // ============================
    const validDoctors = [];

    for (const d of doctors) {
      const services = await d.getServices();
      if (!services.some((s) => s.id === service_id)) continue;

      // ⭐ Lấy lịch trực của bác sĩ
      const schedules = await d.getSchedules(); // mapping đúng của bạn

      // ⭐ Lấy thứ dưới dạng số: Monday = 1 ... Sunday = 7
      let weekday = new Date(appointment_date).getDay(); // 0–6
      weekday = weekday === 0 ? 7 : weekday; // Chủ nhật = 7

      // ⭐ Lọc lịch trực đúng ngày
      const todaySchedules = schedules.filter(
        (s) => s.day_of_week === weekday && s.is_active === true
      );
      if (todaySchedules.length === 0) continue;

      // ⭐ Lọc theo buổi sáng / chiều
      const periodMatch = todaySchedules.some((s) => s.session === slot_period);
      if (!periodMatch) continue;

      validDoctors.push(d);
    }

    if (validDoctors.length === 0) {
      throw new Error(
        "Không có bác sĩ trực trong buổi này hoặc không làm dịch vụ này"
      );
    }

    // ============================
    // 5. ROUND ROBIN
    // ============================
    let index = department.lastDoctorIndex || 0;
    const total = validDoctors.length;

    for (let step = 0; step < total; step++) {
      const selectedDoctor = validDoctors[(index + step) % total];

      // Lấy thông tin đầy đủ
      const doctor = await db.Doctor.findByPk(selectedDoctor.id, {
        include: [{ model: db.ClinicRoom, as: "clinicRoom" }],
      });

      // ============================
      // 6. KIỂM TRA BÁC SĨ CÓ BẬN KHÔNG
      // ============================
      const conflict = await db.Appointment.findOne({
        where: {
          doctor_id: doctor.id,
          appointment_date,
          appointment_time,
          status: { [Op.in]: ["pending", "confirmed"] },
        },
      });

      // ============================
      // ⭐ 7. BÁC SĨ RẢNH → TRẢ VỀ
      // ============================
      if (!conflict) {
        // Cập nhật round robin index
        department.lastDoctorIndex = (index + step + 1) % total;
        await department.save();

        return { doctor }; // TRẢ VỀ BÁC SĨ KHÔNG TẠO LỊCH
      }
    }

    throw new Error("Không có bác sĩ rảnh trong khung giờ này");
  }
}

module.exports = new AutoAssignService();
