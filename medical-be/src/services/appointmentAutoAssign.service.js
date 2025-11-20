const db = require("../models");
const { Op } = require("sequelize");

class AutoAssignService {
  async assign({
    department_id,
    service_id,
    appointment_date,
    slot_id,
    user_id,
  }) {
    // 1. Kiểm tra chuyên khoa
    const department = await db.Department.findByPk(department_id);
    if (!department) throw new Error("Không tìm thấy chuyên khoa");

    // 2. Slot
    const slot = await db.TimeSlot.findByPk(slot_id);
    if (!slot) throw new Error("Không tìm thấy khung giờ");
    const appointment_time = slot.label;

    // 3. Lấy toàn bộ bác sĩ trong khoa
    const doctors = await department.getDoctors();
    if (doctors.length === 0)
      throw new Error("Không có bác sĩ trong chuyên khoa này");

    // 4. Lọc bác sĩ làm được dịch vụ
    const validDoctors = [];
    for (const doctor of doctors) {
      const services = await doctor.getServices();
      const canDo = services.some((srv) => srv.id === service_id);
      if (canDo) validDoctors.push(doctor);
    }

    if (validDoctors.length === 0)
      throw new Error("Không có bác sĩ nào thực hiện dịch vụ này");

    // 5. ROUND ROBIN
    let index = department.lastDoctorIndex || 0;
    const total = validDoctors.length;

    for (let step = 0; step < total; step++) {
      const doctor = validDoctors[(index + step) % total];

      const exists = await db.Appointment.findOne({
        where: {
          doctor_id: doctor.id,
          appointment_date,
          appointment_time,
          status: { [Op.in]: ["pending", "confirmed"] },
        },
      });

      if (!exists) {
        // 6. Lấy phòng khám
        const clinic_room_id = doctor.clinic_room_id || null;

        // 7. Tạo lịch
        const appointment = await db.Appointment.create({
          user_id,
          department_id,
          service_id,
          doctor_id: doctor.id,
          clinic_room_id,
          appointment_date,
          appointment_time,
          slot_id,
          status: "pending",
        });

        // 8. Cập nhật vòng xoay
        department.lastDoctorIndex = (index + step + 1) % total;
        await department.save();

        return { doctor, appointment };
      }
    }

    throw new Error("Không có bác sĩ rảnh tại khung giờ này");
  }
}

module.exports = new AutoAssignService();
