// src/controllers/ccls.controller.js
const cclsRequestService = require("../services/cclsRequest.service");
const cclsResultService = require("../services/cclsResult.service");
const db = require("../models");
// ===========================
// Bác sĩ khám ban đầu tạo yêu cầu CLS
// ===========================
const createCclsRequest = async (req, res) => {
  try {
    const { appointment_id, service_id, requested_by, note } = req.body;

    if (!appointment_id || !service_id || !requested_by) {
      return res.status(400).json({
        message: "Thiếu appointment_id, service_id hoặc requested_by",
      });
    }

    const request = await cclsRequestService.createRequest({
      appointment_id,
      service_id,
      requested_by,
      note,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("createCclsRequest error:", error);
    res.status(500).json({ message: error.message || "Lỗi tạo yêu cầu CLS" });
  }
};

// ===========================
// Bác sĩ CLS xem danh sách yêu cầu được gán
// ===========================
const getMyAssignedRequests = async (req, res) => {
  try {
    // Giả sử FE truyền doctor_id qua query hoặc bạn có thể map từ user → doctor
    const doctor_id = req.query.doctor_id;

    if (!doctor_id) {
      return res.status(400).json({ message: "Thiếu doctor_id" });
    }

    const requests = await cclsRequestService.getRequestsByAssignedDoctor(
      doctor_id
    );

    res.json(requests);
  } catch (error) {
    console.error("getMyAssignedRequests error:", error);
    res.status(500).json({ message: error.message || "Lỗi lấy danh sách CLS" });
  }
};

// ===========================
// Bác sĩ khám ban đầu xem các yêu cầu CLS theo appointment
// ===========================
const getRequestsByAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const user = req.user; // lấy từ token

    // Lấy Appointment để kiểm tra quyền truy cập
    const appointment = await db.Appointment.findByPk(appointment_id, {
      include: [{ model: db.PatientProfile, as: "patientProfile" }],
    });

    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy appointment" });
    }

    // Nếu là bệnh nhân → chỉ xem appointment của chính họ
    if (user.role === "user") {
      if (appointment.patientProfile.user_id !== user.id) {
        return res
          .status(403)
          .json({ message: "Không có quyền xem kết quả CLS này" });
      }
    }

    // Lấy danh sách CLS
    const requests = await cclsRequestService.getRequestsByAppointment(
      appointment_id
    );

    res.json(requests);
  } catch (error) {
    console.error("getRequestsByAppointment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===========================
// Bác sĩ CLS gửi kết quả
// ===========================
const submitCclsResult = async (req, res) => {
  try {
    const { ccls_request_id, description, conclusion, file_path } = req.body;

    if (!ccls_request_id || !description || !conclusion) {
      return res.status(400).json({
        message: "Thiếu ccls_request_id, description hoặc conclusion",
      });
    }

    const result = await cclsResultService.submitResult({
      ccls_request_id,
      description,
      conclusion,
      file_path,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("submitCclsResult error:", error);
    res.status(500).json({ message: error.message || "Lỗi lưu kết quả CLS" });
  }
};

module.exports = {
  createCclsRequest,
  getMyAssignedRequests,
  getRequestsByAppointment,
  submitCclsResult,
};
