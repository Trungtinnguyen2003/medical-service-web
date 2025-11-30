// src/services/appointmentService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/appointments"; // đổi domain nếu deploy
const getToken = () => localStorage.getItem("token");

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
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/appointments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Lỗi khi xoá lịch hẹn");
  return res.json();
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

// ✅ Duyệt lịch hẹn (admin)
const approve = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_BASE_URL}/${id}/approve`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// ✅ Từ chối lịch hẹn (admin)
const reject = async (id, reason) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_BASE_URL}/${id}/reject`,
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
// Thêm hoặc cập nhật lịch hẹn (admin)
const update = async (id, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Admin tạo lịch hẹn thủ công
const adminCreate = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ===============================
// 🔷 API ĐẶT LỊCH THEO CHUYÊN KHOA (MỚI)
// ===============================

// 1. Lấy danh sách chuyên khoa
const getDepartments = async () => {
  const res = await axios.get(`${API_BASE_URL}/departments`);
  return res.data;
};

// 2. Lấy dịch vụ theo chuyên khoa
const getServicesByDepartment = async (departmentId) => {
  const res = await axios.get(
    `${API_BASE_URL}/departments/${departmentId}/services`
  );
  return res.data;
};

// 3. Lấy danh sách khung giờ
// 3. Lấy danh sách khung giờ (dùng chung với flow đặt theo bác sĩ)
const getTimeSlots = async () => {
  const res = await axios.get("http://localhost:5000/api/time-slots");
  return res.data;
};

// 4. Tạo lịch auto-assign cho chuyên khoa
const autoAssignAppointment = async (payload) => {
  const res = await axios.post(`${API_BASE_URL}/auto-assign`, payload, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return res.data;
};

// Lấy bác sĩ khả dụng theo chuyên khoa & ngày
const getAvailableDoctorForDepartment = async (departmentId, date) => {
  const res = await axios.get(`${API_BASE_URL}/available-doctor`, {
    params: {
      department_id: departmentId,
      date,
    },
  });

  return res.data;
};
// 🔷 Lấy bác sĩ LÀM VIỆC theo ngày (flow chuyên khoa – mới)
const getDoctorsWorkingOnDay = async (departmentId, date) => {
  const res = await axios.get(`http://localhost:5000/api/doctors/working`, {
    params: {
      departmentId,
      date,
    },
  });
  return res.data;
};

const appointmentService = {
  create,
  getAll,
  getById,
  updateStatus,
  remove,
  getByDoctor,
  approve,
  reject,
  update,
  adminCreate,
  getDepartments,
  getServicesByDepartment,
  getTimeSlots,
  autoAssignAppointment,
  getAvailableDoctorForDepartment,
  getDoctorsWorkingOnDay,
};

export default appointmentService;
