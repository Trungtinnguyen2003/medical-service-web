const router = require("express").Router();
const chatController = require("../controllers/chat.controller");
const { verifyToken } = require("../middlewares/verifyToken.js");

// User (bệnh nhân) bắt đầu chat
router.post("/start", verifyToken, chatController.start);

// Lấy danh sách chat
router.get("/", verifyToken, chatController.list);

// Lấy chi tiết 1 phiên chat cụ thể
router.get("/:id", verifyToken, chatController.getSession);

// Lấy tin nhắn của 1 phiên chat
router.get("/:id/messages", verifyToken, chatController.messages);

// Tư vấn viên nhận chat
router.post(
  "/:id/assign-consultant",
  verifyToken,
  chatController.assignConsultant
);

// Tư vấn viên chuyển cho bác sĩ
router.post("/:id/assign-doctor", verifyToken, chatController.assignDoctor);

// Đóng phiên chat
router.post("/:id/close", verifyToken, chatController.close);

router.get("/active", verifyToken, chatController.getActiveSession);

module.exports = router;
