// src/services/consultation.service.js
const db = require("../models");
const Consultation = db.Consultation;
const Doctor = db.Doctor;

//
// 🟣 Tạo câu hỏi tư vấn
//
const create = async (data, userId) => {
  const { title, content, department_id, doctor_id } = data;

  // ⚙️ Nếu không chọn bác sĩ -> gửi cho tất cả bác sĩ trong chuyên khoa (qua bảng trung gian)
  if (!doctor_id) {
    const department = await db.Department.findByPk(department_id, {
      include: [{ model: db.Doctor, as: "doctors" }],
    });

    if (!department || !department.doctors || department.doctors.length === 0) {
      throw new Error("Không có bác sĩ trong chuyên khoa này.");
    }

    const created = await Promise.all(
      department.doctors.map((doc) =>
        Consultation.create({
          title,
          content,
          department_id,
          doctor_id: doc.id,
          user_id: userId,
        })
      )
    );

    return {
      message: "Đã gửi câu hỏi cho tất cả bác sĩ trong chuyên khoa",
      count: created.length,
    };
  }

  // ⚙️ Nếu người dùng chọn bác sĩ cụ thể
  const newQuestion = await Consultation.create({
    title,
    content,
    department_id,
    doctor_id,
    user_id: userId,
  });

  return newQuestion;
};

//
// 🟣 Lấy toàn bộ câu hỏi (Admin)
//
const getAll = async () => {
  return await Consultation.findAll({
    include: [
      { model: db.User, as: "patient", attributes: ["id", "name", "email"] },
      { model: db.Doctor, as: "doctor", attributes: ["id", "name"] },
      { model: db.Department, as: "department", attributes: ["id", "name"] },
      { model: db.Doctor, as: "answeredBy", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

//
// 🟣 Lấy danh sách câu hỏi dành cho bác sĩ đang đăng nhập
//
const getForDoctor = async (userId) => {
  const doctor = await db.Doctor.findOne({ where: { user_id: userId } });
  if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

  const consultations = await Consultation.findAll({
    where: { doctor_id: doctor.id },
    include: [
      { model: db.User, as: "patient", attributes: ["id", "name", "email"] },
      { model: db.Department, as: "department", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  return consultations;
};

//
// 🟣 Bác sĩ trả lời câu hỏi
//
const answerConsultation = async (id, userId, answer) => {
  const doctor = await db.Doctor.findOne({ where: { user_id: userId } });
  if (!doctor) throw new Error("Không tìm thấy bác sĩ.");

  const question = await Consultation.findByPk(id);
  if (!question) throw new Error("Không tìm thấy câu hỏi.");

  question.answer = answer;
  question.status = "answered";
  question.answered_by = doctor.id;
  await question.save();

  return question;
};

//
// 🟣 Lấy danh sách câu hỏi công khai (đã trả lời)
//
//
// 🟣 Lấy danh sách câu hỏi công khai (đã được trả lời)
//
const getPublic = async (department_id) => {
  const where = { status: "answered" };
  if (department_id) where.department_id = department_id;

  const consultations = await Consultation.findAll({
    where,
    include: [
      { model: db.User, as: "patient", attributes: ["id", "name"] },
      {
        model: db.Doctor,
        as: "doctor",
        attributes: ["id", "name", "title", "position", "avatar"],
      },
      { model: db.Department, as: "department", attributes: ["id", "name"] },
    ],
    order: [["updatedAt", "DESC"]],
  });

  // ✅ Tự động thêm prefix URL ảnh cho bác sĩ
  return consultations.map((item) => {
    if (item.doctor && item.doctor.avatar) {
      item.doctor.avatar = `http://localhost:5000/uploads/doctors/${item.doctor.avatar}`;
    }
    return item;
  });
};

module.exports = {
  create,
  getAll,
  getForDoctor,
  answerConsultation,
  getPublic,
};
