import axios from "axios";

const API_URL = "http://localhost:5000/doctors";

// ✅ Luôn lấy token mới nhất khi gọi API
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const getAllDoctors = async () => {
  const res = await axios.get(API_URL, { headers: getHeaders() });
  return res.data;
};

const getDoctorById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, { headers: getHeaders() });
  return res.data;
};

const createDoctor = async (data) => {
  const res = await axios.post(API_URL, data, { headers: getHeaders() });
  return res.data;
};

const updateDoctor = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: getHeaders(),
  });
  return res.data;
};

const deleteDoctor = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getHeaders() });
  return res.data;
};

const getDoctorDepartments = async (id) => {
  const res = await axios.get(`${API_URL}/${id}/departments`, {
    headers: getHeaders(),
  });
  return res.data;
};

const setDepartments = async (id, departmentIds) => {
  const res = await axios.post(
    `${API_URL}/${id}/departments`,
    { departmentIds },
    { headers: getHeaders() }
  );
  return res.data;
};

const getDoctorServices = async (id) => {
  const res = await axios.get(`${API_URL}/${id}/services`, {
    headers: getHeaders(),
  });
  return res.data;
};

const setServices = async (id, serviceIds) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/${id}/services`,
    { serviceIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
const getDoctorsByService = async (serviceId) => {
  const res = await axios.get(
    `http://localhost:5000/api/services/${serviceId}/doctors`
  );
  return res.data;
};

export default {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorDepartments,
  setDepartments,
  getDoctorServices,
  setServices,
  getDoctorsByService,
};
