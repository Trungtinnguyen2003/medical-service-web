// services/authService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const login = (email, password) => {
  return axios.post(`${API_BASE_URL}/auth/login`, { email, password });
};

export const register = (email, password, name) => {
  return axios.post(`${API_BASE_URL}/auth/register`, { email, password, name });
};

export const getProfile = (userId) => {
  return axios.get(`${API_BASE_URL}/auth/profile/${userId}`);
};

export const updateProfile = (userId, data) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API_BASE_URL}/auth/profile/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProfileByToken = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
