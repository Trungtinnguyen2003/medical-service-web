// src/controllers/consultation.controller.js
const consultationService = require("../services/consultation.service");

exports.createConsultation = async (req, res) => {
  console.log("🟣 [Consultation] Bắt đầu xử lý request POST /consultations");
  console.log("📩 Body:", req.body);
  console.log("👤 User:", req.user);

  try {
    const data = await consultationService.create(req.body, req.user.id);
    res.json(data);
  } catch (err) {
    console.error("❌ Consultation create error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllConsultations = async (req, res) => {
  try {
    const data = await consultationService.getAll();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách", error: err.message });
  }
};

exports.getConsultationsForDoctor = async (req, res) => {
  try {
    const data = await consultationService.getForDoctor(req.user.id);
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách câu hỏi", error: err.message });
  }
};

exports.answerConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const result = await consultationService.answerConsultation(
      id,
      req.user.id,
      answer
    );
    res.json({ message: "Đã gửi câu trả lời", consultation: result });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi trả lời", error: err.message });
  }
};

exports.getPublicConsultations = async (req, res) => {
  try {
    const { department_id } = req.query;
    const data = await consultationService.getPublic(department_id);
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi getPublicConsultations:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách công khai", error: err.message });
  }
};
