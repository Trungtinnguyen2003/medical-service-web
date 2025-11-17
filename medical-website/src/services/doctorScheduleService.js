import axios from "axios";
const API_URL = "http://localhost:5000/api/doctor-schedules";

const doctorScheduleService = {
  getAll: (token) =>
    axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  create: (data, token) =>
    axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  update: (id, data, token) =>
    axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  remove: (id, token) =>
    axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  assignSlots: (id, timeSlotIds, token) =>
    axios.put(
      `${API_URL}/${id}/slots`,
      { timeSlotIds },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
};

export default doctorScheduleService;
