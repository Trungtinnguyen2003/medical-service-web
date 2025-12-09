// src/services/cclsRequest.service.js
const db = require("../models");
const CclsRequest = db.CclsRequest;
const Doctor = db.Doctor;
const Service = db.Service;
const Appointment = db.Appointment;

// ==========================
// Hàm auto-assign bác sĩ CLS
// ==========================
// ==========================
// Hàm auto-assign bác sĩ CLS (ĐÃ FIX)
// ==========================
const autoAssignClsDoctor = async (service_id) => {
  const CLS_DEPARTMENT_KEYWORD = "cận"; // kiểm tra gần đúng

  const doctors = await Doctor.findAll({
    include: [
      {
        model: Service,
        as: "services",
        where: { id: service_id },
      },
      {
        model: db.Department,
        as: "departments",
        required: true,
        where: db.sequelize.where(
          db.sequelize.fn("LOWER", db.sequelize.col("departments.name")),
          "LIKE",
          `%${CLS_DEPARTMENT_KEYWORD}%`
        ),
      },
    ],
  });

  if (!doctors || doctors.length === 0) {
    throw new Error("Không tìm thấy bác sĩ cận lâm sàng phù hợp");
  }

  // Sau này có thể thêm round robin
  return doctors[0].id;
};

// ==========================
// Tạo yêu cầu CLS
// ==========================
const createRequest = async ({
  appointment_id,
  service_id,
  requested_by,
  note,
}) => {
  // Check tồn tại appointment
  const appointment = await Appointment.findByPk(appointment_id);
  if (!appointment) {
    throw new Error("Không tìm thấy lịch khám");
  }

  // Check tồn tại service
  const service = await Service.findByPk(service_id);
  if (!service) {
    throw new Error("Không tìm thấy dịch vụ cận lâm sàng");
  }

  // Auto assign bác sĩ CLS
  const assigned_doctor = await autoAssignClsDoctor(service_id);

  const request = await CclsRequest.create({
    appointment_id,
    service_id,
    requested_by,
    assigned_doctor,
    note,
    status: "pending",
  });

  return request;
};

// ==========================
// Lấy danh sách yêu cầu theo bác sĩ CLS
// ==========================
// ==========================
// Lấy danh sách yêu cầu theo bác sĩ CLS
// ==========================
// ==========================
// Lấy danh sách yêu cầu theo bác sĩ CLS
// ==========================
const getRequestsByAssignedDoctor = async (doctor_id) => {
  return await CclsRequest.findAll({
    where: { assigned_doctor: doctor_id },
    include: [
      {
        model: Appointment,
        as: "appointment",
        include: [
          { model: db.PatientProfile, as: "patientProfile" },
          { model: db.ClinicRoom, as: "clinic_room" }, // phòng khám
        ],
      },
      { model: Service, as: "service" },
      { model: Doctor, as: "requestDoctor" },
      { model: db.CclsResult, as: "result" },
    ],
    order: [["createdAt", "DESC"]],
  });
};

// ==========================
// Lấy danh sách yêu cầu theo appointment (bác sĩ ban đầu xem)
// ==========================
const getRequestsByAppointment = async (appointment_id) => {
  return await CclsRequest.findAll({
    where: { appointment_id },
    include: [
      { model: Service, as: "service" },
      { model: Doctor, as: "assignedDoctor" },
      {
        model: db.CclsResult,
        as: "result",
        include: [
          {
            model: Doctor,
            as: "doctor",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["createdAt", "ASC"]],
  });
};

module.exports = {
  createRequest,
  getRequestsByAssignedDoctor,
  getRequestsByAppointment,
};
