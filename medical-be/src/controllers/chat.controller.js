const chatService = require("../services/chat.service");
const db = require("../models");

// Bảo vệ: bạn đã có verifyToken & role check, dùng lại middleware hiện có
// req.user = { id, role, ... }

exports.start = async (req, res) => {
  try {
    const patient_id = req.user?.id; // user đang đăng nhập
    const { department_id, initial_message } = req.body;

    const session = await chatService.startChat({
      patient_id,
      department_id,
      initial_message,
    });
    res.json({ message: "Đã tạo phiên chat", session });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo phiên chat", error: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await chatService.getSession(req.params.id);
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy phiên chat", error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const filter = {};

    // 🩺 Xác định user đang đăng nhập
    if (req.user.role === "user") {
      filter.patient_id = req.user.id;
    } else if (req.user.role === "consultant") {
      // 🔹 Tư vấn viên thấy tất cả ca: chưa nhận, đang xử lý, đã chuyển
      filter.$or = [
        { consultant_id: req.user.id }, // Ca đang xử lý
        { consultant_id: null }, // Ca chưa nhận
      ];
    } else if (req.user.role === "doctor") {
      filter.doctor_id = req.user.id;
    }

    const sessions = await chatService.listSessions(filter);
    res.json(sessions);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách phiên chat:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách phiên chat" });
  }
};

exports.messages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const messages = await db.ChatMessage.findAll({
      where: { chat_id: chatId },
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy tin nhắn", error: err.message });
  }
};

exports.assignDoctor = async (req, res) => {
  try {
    const { doctor_user_id } = req.body;
    const chatId = req.params.id;

    // Gọi service
    const session = await chatService.assignDoctor(chatId, doctor_user_id);

    // Nếu có Socket.IO, gửi thông báo real-time cho bác sĩ
    if (req.io) {
      req.io.to(`doctor_${doctor_user_id}`).emit("new-assigned-session", {
        chat_id: chatId,
        patient_id: session.patient_id,
        message: "Bạn được giao một ca tư vấn mới",
      });
    }

    res.json({ message: "Đã chuyển ca cho bác sĩ", session });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi chuyển ca", error: err.message });
  }
};

exports.assignConsultant = async (req, res) => {
  try {
    const { consultant_id } = req.body;
    const session = await chatService.assignConsultant(
      req.params.id,
      consultant_id
    );
    res.json({ message: "Đã nhận phiên chat", session });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi gán tư vấn viên", error: err.message });
  }
};

exports.close = async (req, res) => {
  try {
    const chatId = req.params.id;

    // Cập nhật trạng thái thành closed nhưng KHÔNG xóa
    const session = await db.ChatSession.findByPk(chatId);
    if (!session) {
      return res.status(404).json({ message: "Không tìm thấy phiên chat" });
    }

    session.status = "closed";
    session.closed_at = new Date();
    await session.save();

    // Phát event realtime cho tư vấn viên biết
    req.io.to(`chat_${chatId}`).emit("session_closed", { chat_id: chatId });

    return res.json({ message: "Đã kết thúc cuộc trò chuyện", session });
  } catch (error) {
    console.error("❌ Lỗi khi kết thúc chat:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy phiên chat đang hoạt động của user hiện tại
exports.getActiveSession = async (req, res) => {
  try {
    const patient_id = req.user.id;
    const { Op } = require("sequelize");

    const session = await db.ChatSession.findOne({
      where: {
        patient_id,
        status: { [Op.ne]: "closed" }, // 🔹 lấy mọi phiên chưa kết thúc
      },
      order: [["updatedAt", "DESC"]],
    });

    if (!session) return res.json(null);
    res.json(session);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi lấy phiên chat đang hoạt động",
      error: err.message,
    });
  }
};
