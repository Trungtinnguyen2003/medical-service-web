import axios from "axios";

const API_URL = "http://localhost:5000/users";

const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateUser = async (id, data) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const userService = {
  getAllUsers,
  deleteUser,
  updateUser,
};

export default userService;
