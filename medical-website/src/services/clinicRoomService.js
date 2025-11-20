// src/services/clinicRoomService.js
import { API_BASE_URL } from "../config";
import doctorService from "./doctorService";

const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: token() ? `Bearer ${token()}` : "",
});

const clinicRoomService = {
  // Lấy danh sách phòng khám
  async getAll() {
    const res = await fetch(`${API_BASE_URL}/api/clinic-rooms`, {
      method: "GET",
      headers: headers(),
    });
    return res.json();
  },

  // Lấy phòng khám theo ID
  async getById(id) {
    const res = await fetch(`${API_BASE_URL}/api/clinic-rooms/${id}`, {
      method: "GET",
      headers: headers(),
    });
    return res.json();
  },

  // Tạo phòng khám mới
  async create(data) {
    const res = await fetch(`${API_BASE_URL}/api/clinic-rooms`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Cập nhật phòng khám
  async update(id, data) {
    const res = await fetch(`${API_BASE_URL}/api/clinic-rooms/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Xoá phòng khám
  async delete(id) {
    const res = await fetch(`${API_BASE_URL}/api/clinic-rooms/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.json();
  },

  // Gán bác sĩ vào phòng khám
  async assignDoctor(doctorId, clinicRoomId) {
    // 1. Lấy chuyên khoa hiện có
    const currentDepartments = await doctorService.getDoctorDepartments(
      doctorId
    );
    const departmentIds = currentDepartments.map((d) => d.id);

    // 2. Lấy dịch vụ hiện có
    const currentServices = await doctorService.getDoctorServices(doctorId);
    const serviceIds = currentServices.map((s) => s.id);

    // 3. Cập nhật mà không xoá chuyên khoa/dịch vụ
    const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({
        clinic_room_id: clinicRoomId,
        departmentIds: departmentIds,
        serviceIds: serviceIds,
      }),
    });

    return res.json();
  },
};

export default clinicRoomService;
