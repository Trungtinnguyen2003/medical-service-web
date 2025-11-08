import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./ConsultantChatPage.css";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ConsultantChatPage = () => {
  const [sessions, setSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const consultantId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  // ✅ Auto scroll
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Lấy danh sách chat và join các room tương ứng
  const fetchAndJoinChats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không tải được danh sách chat");
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data.filter(
          (s) =>
            s.status === "pending" ||
            s.status === "active" ||
            s.status === "transferred" ||
            s.status === "closed"
        );
        setSessions(filtered);
        filtered.forEach((s) => socket.emit("join_room", { chat_id: s.id }));
      }
    } catch (err) {
      console.error("❌ Lỗi tải danh sách chat:", err);
    }
  };

  // ✅ Kết nối socket
  useEffect(() => {
  if (!consultantId) return;

  // 🔹 Đảm bảo socket chỉ connect 1 lần
  if (!socket.connected) socket.connect();

  socket.on("connect", () => {
    console.log("✅ [SOCKET] connected:", socket.id);

    // ✅ Gửi thông tin xác thực
    socket.emit("identify", { user_id: consultantId, role: "consultant" });

    // ✅ Chờ backend phản hồi "identified" rồi mới join room
    socket.once("identified", () => {
      console.log("✅ [SOCKET] Consultant identified — now joining rooms");
      fetchAndJoinChats(); // 🔥 chỉ join khi BE xác thực xong
    });
  });

  // ✅ Lắng nghe sự kiện chuyển ca
  const handleTransferred = ({ chat_id, doctor_user_id }) => {
    if (currentChat === chat_id) {
      setMessages((prev) => [
        ...prev,
        {
          sender_role: "system",
          content: `🩺 Ca tư vấn đã được chuyển cho bác sĩ #${doctor_user_id}`,
        },
      ]);
    }
    setSessions((prev) =>
      prev.map((s) =>
        s.id === chat_id ? { ...s, status: "transferred" } : s
      )
    );
  };

  socket.off("session_transferred"); // ⚠️ tránh duplicate listener
  socket.on("session_transferred", handleTransferred);

  return () => {
    socket.off("connect");
    socket.off("identified");
    socket.off("session_transferred", handleTransferred);
  };
}, [consultantId, currentChat]);


  // ✅ Lắng nghe tin nhắn realtime (chạy 1 lần duy nhất)
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("📩 Nhận tin nhắn realtime:", msg);
      if (msg.chat_id === currentChat) {
        // Nếu đang mở đúng phòng → thêm vào danh sách tin nhắn
        setMessages((prev) => [...prev, msg]);
      } else {
        // Nếu không phải phòng đang mở → đánh dấu có tin mới
        setSessions((prev) =>
          prev.map((s) =>
            s.id === msg.chat_id ? { ...s, hasNewMessage: true } : s
          )
        );
      }
    };

    socket.off("receive_message");
    socket.on("receive_message", handleReceive);

    return () => socket.off("receive_message", handleReceive);
  }, []); // 👈 chỉ chạy 1 lần khi component mount

  // ✅ Mở một cuộc chat
  const handleOpenChat = async (chatId) => {
    setCurrentChat(chatId);
    // Join lại phòng này sau khi state đã cập nhật
    setTimeout(() => socket.emit("join_room", { chat_id: chatId }), 200);
    setMessages([]);

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/${chatId}/messages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("❌ Lỗi tải lịch sử:", e);
    }
  };

  // ✅ Nhận một cuộc chat mới
  const handleAcceptChat = (chatId) => {
    socket.emit("assign_consultant", {
      chat_id: chatId,
      consultant_id: consultantId,
    });
    handleOpenChat(chatId);
  };

  // ✅ Gửi tin nhắn
  const handleSendMessage = () => {
    if (!input.trim() || !currentChat) return;
    socket.emit("send_message", {
      chat_id: currentChat,
      content: input,
    });
    setMessages((prev) => [
      ...prev,
      { chat_id: currentChat, sender_role: "consultant", content: input },
    ]);
    setInput("");
  };

  // ✅ Lấy danh sách bác sĩ
  const fetchDoctors = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setDoctors(data);
    } catch (e) {
      console.error("Lỗi lấy danh sách bác sĩ:", e);
    }
  };

  // ✅ Chuyển ca cho bác sĩ
  const handleAssignDoctor = async () => {
    if (!selectedDoctor || !currentChat) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/${currentChat}/assign-doctor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ doctor_user_id: selectedDoctor }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert("❌ Lỗi chuyển ca: " + data.message);
        return;
      }

      socket.emit("assign_doctor", {
        chat_id: currentChat,
        doctor_user_id: selectedDoctor,
      });

      setShowDoctorModal(false);
      setMessages((prev) => [
        ...prev,
        {
          sender_role: "system",
          content: "🩺 Bạn đã chuyển ca này cho bác sĩ.",
        },
      ]);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentChat ? { ...s, status: "transferred" } : s
        )
      );
    } catch (err) {
      console.error("❌ Lỗi chuyển ca:", err);
      alert("Lỗi hệ thống khi chuyển ca cho bác sĩ.");
    }
  };

  // ✅ Render
  return (
    <div className="consultant-container" style={{ marginTop: "60px" }}>
      <div className="sidebar">
        <h3>💬 Danh sách</h3>
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`session-card ${
              currentChat === s.id ? "active-session" : ""
            }`}
          >
            <p>
              <strong>Bệnh nhân:</strong> {s.patient?.name || "Ẩn danh"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {s.status === "pending"
                ? "⏳ Chưa nhận"
                : s.status === "active"
                ? "🟢 Đang tư vấn"
                : s.status === "transferred"
                ? "🩺 Đã chuyển bác sĩ"
                : "🔴 Đã đóng"}
            </p>
            {s.status === "pending" ? (
              <button onClick={() => handleAcceptChat(s.id)}>Nhận chat</button>
            ) : (
              <button onClick={() => handleOpenChat(s.id)}>Mở</button>
            )}
          </div>
        ))}
      </div>

      <div className="chat-panel">
        {currentChat ? (
          <>
            <div className="chat-box">
              {messages.map((m, idx) => (
                <div
                  key={`${m.id || idx}`}
                  className={`msg ${
                    m.sender_role === "consultant"
                      ? "consultant"
                      : m.sender_role === "user"
                      ? "user"
                      : "system"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Gửi</button>
              <button
                style={{
                  background: "#7c3aed",
                  color: "#fff",
                  marginLeft: "10px",
                }}
                onClick={() => {
                  fetchDoctors();
                  setShowDoctorModal(true);
                }}
              >
                🩺 Chuyển bác sĩ
              </button>
            </div>

            {showDoctorModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Chọn bác sĩ tiếp nhận</h3>
                  <select
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    value={selectedDoctor}
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.user_id || d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <div className="modal-actions">
                    <button onClick={handleAssignDoctor}>Xác nhận</button>
                    <button onClick={() => setShowDoctorModal(false)}>
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-box">
            <p>Chọn hoặc mở một phiên để xem tin nhắn</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantChatPage;
