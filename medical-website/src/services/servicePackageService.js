// src/services/servicePackageService.js
import axios from "axios";

const API_BASE = "http://localhost:5000/packages";

const servicePackageService = {
  getAll: async () => {
    const res = await axios.get(API_BASE);
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_BASE}/id/${id}`);
    return res.data;
  },

  getBySlug: async (slug) => {
    const res = await axios.get(`${API_BASE}/${slug}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(API_BASE, data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${API_BASE}/${id}`, data);
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
  },

  assignServices: async (id, services) => {
    const res = await axios.post(`${API_BASE}/${id}/services`, { services });
    return res.data;
  },

  // ✅ Hàm mới: Lấy danh sách bác sĩ thực hiện gói
  getDoctorsOfPackage: async (id) => {
    const res = await axios.get(`${API_BASE}/${id}/doctors`);
    return res.data;
  },
};

export default servicePackageService;
