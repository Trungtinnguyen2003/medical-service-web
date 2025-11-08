const db = require("../models");
const { ChatSession, ChatMessage, User, Department } = db;

// ✅ Tạo chat mới
const startChat = async ({ patient_id, department_id, initial_message }) => {
  const session = await ChatSession.create({
    patient_id,
    department_id,
    status: "pending",
  });

  if (initial_message && initial_message.trim() !== "") {
    await ChatMessage.create({
      chat_id: session.id,
      sender_id: patient_id,
      sender_role: "user",
      content: initial_message,
    });
  }

  return session;
};

// ✅ Lấy chi tiết một phiên chat
const getSession = async (chat_id) => {
  return await ChatSession.findByPk(chat_id, {
    include: [
      { model: User, as: "patient", attributes: ["id", "name", "role"] },
      { model: User, as: "consultant", attributes: ["id", "name", "role"] },
      { model: User, as: "doctor", attributes: ["id", "name", "role"] }, // alias đúng
      { model: Department, as: "department", attributes: ["id", "name"] },
    ],
  });
};

// ✅ Lấy danh sách các phiên chat
const listSessions = async (filter = {}) => {
  const where = {};
  if (filter.status) where.status = filter.status;
  if (filter.consultant_id) where.consultant_id = filter.consultant_id;
  if (filter.doctor_id) where.doctor_id = filter.doctor_id;
  if (filter.patient_id) where.patient_id = filter.patient_id;

  return await ChatSession.findAll({
    where,
    order: [["updatedAt", "DESC"]],
    include: [
      { model: User, as: "patient", attributes: ["id", "name", "role"] },
      { model: User, as: "consultant", attributes: ["id", "name", "role"] },
      { model: User, as: "doctor", attributes: ["id", "name", "role"] },
      { model: Department, as: "department", attributes: ["id", "name"] },
    ],
  });
};

// ✅ Lưu tin nhắn mới
const saveMessage = async ({ chat_id, sender_id, sender_role, content }) => {
  return await ChatMessage.create({ chat_id, sender_id, sender_role, content });
};

// ✅ Lấy toàn bộ tin nhắn
const getMessages = async (chat_id) => {
  return await ChatMessage.findAll({
    where: { chat_id },
    include: [
      { model: User, as: "sender", attributes: ["id", "name", "role"] },
    ],
    order: [["createdAt", "ASC"]],
  });
};

// ✅ Tư vấn viên nhận ca
const assignConsultant = async (chat_id, consultant_id) => {
  await ChatSession.update(
    { consultant_id, status: "active" },
    { where: { id: chat_id } }
  );
  return getSession(chat_id);
};

// ✅ Tư vấn viên chuyển ca cho bác sĩ
const assignDoctor = async (chat_id, doctor_user_id) => {
  try {
    const doctor = await User.findByPk(doctor_user_id);
    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Không tìm thấy bác sĩ hợp lệ");
    }

    const session = await ChatSession.findByPk(chat_id);
    if (!session) throw new Error("Không tìm thấy phiên chat");

    // ✅ Cập nhật bác sĩ và trạng thái
    session.doctor_id = doctor_user_id;
    session.status = "transferred";
    await session.save();

    // ✅ Ghi lại tin nhắn hệ thống
    await ChatMessage.create({
      chat_id,
      sender_id: null,
      sender_role: "system",
      content: `🩺 Ca tư vấn đã được chuyển cho bác sĩ ${doctor.name}`,
    });

    console.log(`✅ Đã chuyển ca #${chat_id} cho bác sĩ ${doctor.name}`);
    return getSession(chat_id);
  } catch (err) {
    console.error("❌ Lỗi assignDoctor:", err);
    throw err;
  }
};

// ✅ Đóng phiên chat
const closeSession = async (chat_id) => {
  await ChatSession.update(
    { status: "closed", closed_at: new Date() },
    { where: { id: chat_id } }
  );
  return getSession(chat_id);
};

// ✅ Export tất cả hàm ra ngoài
module.exports = {
  startChat,
  getSession,
  listSessions,
  saveMessage,
  getMessages,
  assignConsultant,
  assignDoctor,
  closeSession,
};
