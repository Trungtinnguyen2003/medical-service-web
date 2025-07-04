import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/services"; // ✅ Đúng base URL

const serviceService = {
  // Lấy tất cả dịch vụ
  getAllServices: async () => {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  },

  // Lấy chi tiết dịch vụ
  getServiceById: async (id) => {
    const res = await axios.get(`${API_BASE_URL}/${id}`);
    return res.data;
  },

  // Lấy danh sách chuyên khoa đảm nhận
  getServiceDepartments: async (id) => {
    const res = await axios.get(`${API_BASE_URL}/${id}/departments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  },

  // Gán danh sách chuyên khoa
  setDepartments: async (id, departmentIds) => {
    const res = await axios.post(
      `${API_BASE_URL}/${id}/departments`,
      { departmentIds },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data;
  },

  // Tạo mới dịch vụ
  createService: async (data) => {
    const res = await axios.post(API_BASE_URL, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data.service;
  },

  // Cập nhật dịch vụ
  updateService: async (id, data) => {
    return await axios.put(`${API_BASE_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  // Xoá dịch vụ
  deleteService: async (id) => {
    return await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};

export default serviceService;
