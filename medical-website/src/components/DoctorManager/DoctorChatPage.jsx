import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { autoConnect: false });

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 60px)",
    background: "#f6f8fc",
    fontFamily: "Segoe UI, sans-serif",
  },
  sidebar: {
    width: "28%",
    background: "#fff",
    borderRight: "1px solid #ddd",
    padding: "20px",
    overflowY: "auto",
  },
  chatPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#fafafa",
    position: "relative",
  },
  sessionCard: {
    background: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeSession: {
    background: "#e3d5ff",
    borderColor: "#7c3aed",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    marginTop: "55px", // 👈 thêm dòng này
  },
  msgBase: {
    padding: "10px 14px",
    borderRadius: "12px",
    marginBottom: "8px",
    maxWidth: "70%",
    wordBreak: "break-word",
    fontSize: "15px",
  },
  msgDoctor: {
    alignSelf: "flex-end",
    background: "#dbeafe",
    color: "#1e3a8a",
    borderTopRightRadius: "0",
  },
  msgUser: {
    alignSelf: "flex-start",
    background: "#f3f4f6",
    color: "#111827",
    borderTopLeftRadius: "0",
  },
  msgSystem: {
    alignSelf: "center",
    fontSize: "13px",
    color: "#6b7280",
    fontStyle: "italic",
  },
  chatInput: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
  },
  button: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    marginLeft: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  emptyBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontStyle: "italic",
  },
};

const DoctorChatPage = () => {
  const [sessions, setSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const doctorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Lấy danh sách phiên chat của bác sĩ
  // ✅ Lấy danh sách phiên chat của bác sĩ
const fetchChats = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/chat?doctor_id=${doctorId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (Array.isArray(data)) {
      // ✅ Giữ toàn bộ ca, kể cả đã kết thúc
      const sorted = data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setSessions(sorted);
      sorted.forEach((s) => socket.emit("join_room", { chat_id: s.id }));
    }
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách ca tư vấn:", err);
  }
};


  // ✅ Socket
  useEffect(() => {
    if (!doctorId) return;
    socket.connect();
    socket.on("connect", () => {
      console.log("✅ [SOCKET] connected:", socket.id);
      socket.emit("identify", { user_id: doctorId, role: "doctor" });
      fetchChats();
    });

    socket.on("new-assigned-session", (data) => {
      alert(`🩺 Bạn được giao ca tư vấn mới #${data.sessionId}`);
      fetchChats();
    });

    socket.on("receive_message", (msg) => {
      if (msg.chat_id === currentChat) setMessages((prev) => [...prev, msg]);
    });

    socket.on("session_closed", ({ chat_id }) => {
      if (chat_id === currentChat) {
        setMessages((prev) => [
          ...prev,
          { sender_role: "system", content: "🔴 Ca tư vấn đã kết thúc." },
        ]);
      }
      setSessions((prev) =>
        prev.map((s) => (s.id === chat_id ? { ...s, status: "closed" } : s))
      );
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("new-assigned-session");
      socket.off("session_closed");
    };
  }, [doctorId, currentChat]);

  // ✅ Mở chat
  const handleOpenChat = async (id) => {
    setCurrentChat(id);
    socket.emit("join_room", { chat_id: id });
    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/${id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("❌ Lỗi tải tin nhắn:", e);
    }
  };

  // ✅ Gửi tin nhắn
  const handleSend = () => {
    if (!input.trim() || !currentChat) return;
    socket.emit("send_message", { chat_id: currentChat, content: input });
    setMessages((p) => [...p, { sender_role: "doctor", content: input }]);
    setInput("");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3 >🩺 Ca tư vấn của tôi</h3>
        {sessions.length === 0 && <p>Không có ca nào.</p>}

        {sessions.map((s) => (
          <div
            key={s.id}
            style={{
              ...styles.sessionCard,
              ...(currentChat === s.id ? styles.activeSession : {}),
            }}
          >
            <p>
              <strong>Bệnh nhân:</strong> {s.patient?.name || "Ẩn danh"}
            </p>
            <p>
  <strong>Trạng thái:</strong>{" "}
  <span style={{ color: s.status === "closed" ? "#9ca3af" : "#000" }}>
    {s.status}
  </span>
</p>
            <button style={styles.button} onClick={() => handleOpenChat(s.id)}>
              Mở chat
            </button>
          </div>
        ))}
      </div>

      {/* Chat Panel */}
      <div style={styles.chatPanel}>
        {currentChat ? (
          <>
            <div style={styles.chatBox}>
              {messages.map((m, i) => {
                const msgStyle =
                  m.sender_role === "doctor"
                    ? { ...styles.msgBase, ...styles.msgDoctor }
                    : m.sender_role === "user"
                    ? { ...styles.msgBase, ...styles.msgUser }
                    : { ...styles.msgBase, ...styles.msgSystem };
                return (
                  <div key={i} style={msgStyle}>
                    {m.content}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.chatInput}>
              <input
                style={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
              />
              <button style={styles.button} onClick={handleSend}>
                Gửi
              </button>
            </div>
          </>
        ) : (
          <div style={styles.emptyBox}>
            <p>Chọn một ca để bắt đầu tư vấn</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatPage;
