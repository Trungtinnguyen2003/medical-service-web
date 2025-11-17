import { API_BASE_URL } from "../config";

const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: token() ? `Bearer ${token()}` : "",
});

const patientProfileService = {
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

  async createProfile(data) {
    const res = await fetch(`${API_BASE_URL}/api/patient-profiles`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateProfile(id, data) {
    const res = await fetch(`${API_BASE_URL}/api/patient-profiles/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteProfile(id) {
    const res = await fetch(`${API_BASE_URL}/api/patient-profiles/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.json();
  },
};

export default patientProfileService;
