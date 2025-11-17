// src/services/patientProfile.service.js
import { API_BASE_URL } from "../config";

const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: token() ? `Bearer ${token()}` : "",
});

const patientProfileService = {
  // Lấy danh sách hồ sơ của user
  async getMyProfiles() {
    const res = await fetch(
      `${API_BASE_URL}/api/patient-profiles/my-profiles`,
      {
        method: "GET",
        headers: headers(),
      }
    );
    return res.json();
  },

  // Tạo hồ sơ mới
  async createProfile(data) {
    const res = await fetch(`${API_BASE_URL}/api/patient-profiles`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Cập nhật hồ sơ
  async updateProfile(id, data) {
    const res = await fetch(`${API_BASE_URL}/api/patient-profiles/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Xóa hồ sơ
  async deleteProfile(id) {
    const res = await fetch(`${API_BASE_URL}/api/patient-profiles/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.json();
  },
};

export default patientProfileService;
