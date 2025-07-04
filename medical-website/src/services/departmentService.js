import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/departments";

const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
};

const departmentService = {
  getAll: async () => {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  },

  getBySlug: async (slug) => {
    const res = await axios.get(`${API_BASE_URL}/${slug}`);
    return res.data;
  },

  createDepartment: async (data) => {
    const res = await axios.post(API_BASE_URL, data, { headers });
    return res.data.department;
  },

  updateDepartment: async (id, data) => {
    return await axios.put(`${API_BASE_URL}/${id}`, data, { headers });
  },

  deleteDepartment: async (id) => {
    return await axios.delete(`${API_BASE_URL}/${id}`, { headers });
  },

  setServices: async (id, serviceIds) => {
    return await axios.post(
      `${API_BASE_URL}/${id}/services`,
      { serviceIds },
      { headers }
    );
  },

  getAllDepartments: async () => {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  },

  // ✅ Thêm đúng ở đây
  getDoctorsByDepartment: async (id) => {
    const res = await axios.get(`${API_BASE_URL}/${id}/doctors`);
    return res.data;
  },
  getServicesByDepartment: async (id) => {
    const res = await axios.get(`${API_BASE_URL}/${id}/services`);
    return res.data;
  },
};

export default departmentService;
