import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaComments, FaTimes } from "react-icons/fa";
import "./ChatWidget.css";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    department_id: "",
    message: "",
  });
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userChatKey = `chatId_user_${userId}`; // 🔹 mỗi user có key riêng

  // ✅ Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Lấy danh sách chuyên khoa
  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch((err) => console.error("Lỗi lấy danh sách chuyên khoa:", err));
  }, []);

  // ✅ Khi mở widget, khôi phục chat cũ nếu có
  useEffect(() => {
    if (!isOpen || !token) return;

    socket.connect();
    socket.on("connect", () => {
      socket.emit("identify", { user_id: userId, role: "user" });
    });

    const existingChatId = localStorage.getItem(userChatKey);

    if (existingChatId) {
      // 🔹 Nếu user đã có chat trước đó → khôi phục
      restoreChat(existingChatId);
    } else {
      // 🔹 Nếu chưa có → kiểm tra session active trên server
      fetch("http://localhost:5000/api/chat/active", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.id) {
            localStorage.setItem(userChatKey, data.id);
            restoreChat(data.id);
          }
        })
        .catch((err) => console.error("Lỗi lấy session active:", err));
    }

    // ✅ Lắng nghe tin nhắn mới
    socket.on("receive_message", (msg) => {
      if (msg.chat_id === parseInt(chatId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // ✅ Khi ca chat bị đóng
    socket.on("session_closed", ({ chat_id }) => {
      if (chat_id === parseInt(chatId)) {
        setMessages((prev) => [
          ...prev,
          { sender_role: "system", content: "Phiên chat đã kết thúc." },
        ]);
        localStorage.removeItem(userChatKey);
        setChatId(null);
        setIsStarted(false);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("session_closed");
    };
  }, [isOpen, chatId]);

  // ✅ Phục hồi chat cũ
  const restoreChat = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChatId(id);
      setMessages(data);
      setIsStarted(true);
      socket.emit("join_room", { chat_id: id });
    } catch (err) {
      console.error("Lỗi khi phục hồi chat:", err);
    }
  };

  // ✅ Bắt đầu chat mới
  const handleStartChat = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    fetch("http://localhost:5000/api/chat/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        department_id: formData.department_id,
        initial_message: formData.message,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setChatId(data.session.id);
        localStorage.setItem(userChatKey, data.session.id); // 🔹 lưu theo user
        setIsStarted(true);
        socket.emit("join_room", { chat_id: data.session.id });
        setMessages([
          {
            sender_role: "system",
            content: "Bạn đã bắt đầu cuộc trò chuyện. Vui lòng chờ tư vấn viên phản hồi.",
          },
          { sender_role: "user", content: formData.message },
        ]);
      })
      .catch((err) => console.error("Lỗi tạo chat:", err));
  };

  // ✅ Gửi tin nhắn
  const handleSendMessage = () => {
    if (!input.trim() || !chatId) return;
    socket.emit("send_message", { chat_id: chatId, content: input });
    setMessages((prev) => [...prev, { sender_role: "user", content: input }]);
    setInput("");
  };

  // ✅ Kết thúc chat
  const handleEndChat = async () => {
    if (!chatId) return;
    try {
      await fetch(`http://localhost:5000/api/chat/${chatId}/close`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => [
        ...prev,
        { sender_role: "system", content: "Bạn đã kết thúc cuộc trò chuyện." },
      ]);
      localStorage.removeItem(userChatKey); // 🔹 chỉ xóa của user hiện tại
      setChatId(null);
      setIsStarted(false);
    } catch (err) {
      console.error("Lỗi kết thúc chat:", err);
    }
  };

  return (
    <>
      <div className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes size={22} /> : <FaComments size={26} />}
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Hỗ trợ tư vấn</h3>
            {isStarted && (
              <button
                onClick={handleEndChat}
                className="end-btn"
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Kết thúc
              </button>
            )}
            <FaTimes className="close-btn" onClick={() => setIsOpen(false)} />
          </div>

          {!isStarted ? (
            <form className="chat-form" onSubmit={handleStartChat}>
              <div className="form-group">
                <label>Họ tên *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Chuyên khoa</label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={(e) =>
                    setFormData({ ...formData, department_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Câu hỏi *</label>
                <textarea
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="start-btn">
                Bắt đầu trò chuyện
              </button>
            </form>
          ) : (
            <div className="chat-body">
              <div className="chat-messages">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`msg ${
                      m.sender_role === "user"
                        ? "user"
                        : m.sender_role === "consultant"
                        ? "other"
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
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
