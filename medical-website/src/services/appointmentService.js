// src/services/appointmentService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/appointments"; // đổi domain nếu deploy

// Gửi form tạo lịch hẹn mới
const create = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Lấy danh sách tất cả lịch hẹn (cho admin dùng)
const getAll = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Lấy chi tiết lịch hẹn theo ID
const getById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Cập nhật trạng thái lịch hẹn
const updateStatus = async (id, status) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/status`, { status });
  return response.data;
};

// Xoá lịch hẹn
const remove = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
// Lấy lịch hẹn của bác sĩ đang đăng nhập
const getByDoctor = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/doctor`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const appointmentService = {
  create,
  getAll,
  getById,
  updateStatus,
  remove,
  getByDoctor,
};

export default appointmentService;
