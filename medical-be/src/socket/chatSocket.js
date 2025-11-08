// /sockets/chat.socket.js
const chatService = require("../services/chat.service");

// Lưu danh sách user online
const onlineUsers = {}; // ví dụ: { "user_3": socketId, "consultant_1": socketId }

function chatSocket(io) {
  io.on("connection", (socket) => {
    // Khi client connect xong gửi identify
    socket.on("identify", ({ user_id, role }) => {
      if (!user_id || !role) return;
      onlineUsers[`${role}_${user_id}`] = socket.id;
      socket.data.user_id = user_id;
      socket.data.role = role;
      console.log(`✅ ${role}_${user_id} đã online`);
      socket.emit("identified");
    });

    // ✅ Khi bệnh nhân bắt đầu chat (giai đoạn 1)
    socket.on("start_chat", async ({ patient_id, department_id, message }) => {
      try {
        const session = await chatService.startChat({
          patient_id,
          department_id,
          initial_message: message,
        });

        // Gửi lại cho chính bệnh nhân để confirm
        io.to(socket.id).emit("chat_created", session);

        // 🔥 Gửi thông báo cho tất cả tư vấn viên đang online
        Object.keys(onlineUsers).forEach((key) => {
          if (key.startsWith("consultant_")) {
            io.to(onlineUsers[key]).emit("new_chat", {
              type: "new_pending_chat",
              session,
            });
          }
        });

        console.log(`🆕 Phiên chat mới #${session.id} (dept ${department_id})`);
      } catch (err) {
        io.to(socket.id).emit("error", { message: "Không thể tạo chat", err });
      }
    });

    // join room cụ thể
    socket.on("join_room", ({ chat_id }) => {
      if (!socket.data.role || !socket.data.user_id) {
        console.log("⚠️ join_room bị gọi trước khi identify, bỏ qua");
        return;
      }
      socket.join(`chat_${chat_id}`);
      console.log(
        `👤 ${socket.data.role}_${socket.data.user_id} joined chat_${chat_id}`
      );
    });

    // Gửi tin nhắn
    // Gửi tin nhắn
    socket.on("send_message", async ({ chat_id, content }) => {
      try {
        const sender_id = socket.data.user_id;
        const sender_role = socket.data.role || "user";

        if (!chat_id || !sender_id || !content) return;

        const msg = await chatService.saveMessage({
          chat_id,
          sender_id,
          sender_role,
          content,
        });

        io.to(`chat_${chat_id}`).emit("receive_message", {
          id: msg.id,
          chat_id,
          sender_id,
          sender_role,
          content,
          createdAt: msg.createdAt,
        });
      } catch (err) {
        console.error("❌ Lỗi gửi tin nhắn:", err.message);
      }
    });

    // Tư vấn viên nhận chat
    socket.on("assign_consultant", async ({ chat_id, consultant_id }) => {
      const session = await chatService.assignConsultant(
        chat_id,
        consultant_id
      );
      io.to(`chat_${chat_id}`).emit("session_updated", { session });

      // Thông báo cho bệnh nhân
      const patientSocket = onlineUsers[`user_${session.patient_id}`];
      if (patientSocket)
        io.to(patientSocket).emit("noti", {
          type: "consultant_joined",
          chat_id,
        });
    });

    // Tư vấn viên chuyển cho bác sĩ
    socket.on("assign_doctor", async ({ chat_id, doctor_user_id }) => {
      try {
        const session = await chatService.assignDoctor(chat_id, doctor_user_id);

        // Gửi thông báo cho bác sĩ online
        const doctorSocket = onlineUsers[`doctor_${doctor_user_id}`];
        if (doctorSocket) {
          io.to(doctorSocket).emit("new-assigned-session", {
            chat_id,
            patient_id: session.patient_id,
            message: `Bạn được giao phiên tư vấn #${chat_id}`,
          });
        }

        // Cập nhật phòng chat cho user (ẩn input tư vấn viên)
        io.to(`chat_${chat_id}`).emit("session_transferred", {
          chat_id,
          doctor_user_id,
          status: "transferred",
        });

        console.log(
          `🔄 Ca chat ${chat_id} đã được chuyển cho bác sĩ ${doctor_user_id}`
        );
      } catch (err) {
        console.error("❌ Lỗi assign_doctor:", err.message);
      }
    });

    // Kết thúc chat
    socket.on("close_chat", async ({ chat_id }) => {
      const session = await chatService.closeSession(chat_id);
      io.to(`chat_${chat_id}`).emit("session_closed", { chat_id });

      // Thông báo cho tất cả người liên quan
      io.emit("chat_closed_global", { chat_id, status: session.status });
    });

    // Ngắt kết nối
    socket.on("disconnect", (reason) => {
      const { role, user_id } = socket.data || {};
      if (role && user_id) {
        const key = `${role}_${user_id}`;
        if (onlineUsers[key] === socket.id) delete onlineUsers[key];
        console.log(`❌ ${key} disconnected (${reason})`);
      } else {
        console.log(`⚠️ Socket disconnected before identify (${reason})`);
      }
    });
  });
}

module.exports = chatSocket;
