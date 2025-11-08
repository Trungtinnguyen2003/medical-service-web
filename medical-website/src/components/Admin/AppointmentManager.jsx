import React, { useEffect, useState } from "react";
import appointmentService from "../../services/appointmentService";
import departmentService from "../../services/departmentService";
import doctorService from "../../services/doctorService";
import serviceService from "../../services/serviceService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  gender: "Nam",
  date_of_birth: "",
  address: "",
  department_id: "",
  service_id: "",
  doctor_id: "",
  appointment_date: "",
  appointment_time: "",
  symptoms: "",
};

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadAppointments();
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
  try {
    const [deptRes, doctorRes, serviceRes] = await Promise.all([
      departmentService.getAll(),        // đúng
      doctorService.getAllDoctors(),     // ✅ dùng đúng tên hàm
      serviceService.getAllServices(),   // ✅ dùng đúng tên hàm
    ]);
    setDepartments(deptRes);
    setDoctors(doctorRes);
    setServices(serviceRes);
  } catch (err) {
    console.error("Lỗi tải dropdown:", err);
  }
};


  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      console.error("Lỗi tải lịch:", err);
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
    // ✅ Khi đổi chuyên khoa thì reset 2 dropdown con
    ...(name === "department_id" ? { service_id: "", doctor_id: "" } : {}),
  }));
};


useEffect(() => {
  const loadRelated = async () => {
    if (!formData.department_id) {
      setServices([]);
      setDoctors([]);
      return;
    }
    try {
      const [srv, docs] = await Promise.all([
        departmentService.getServicesByDepartment(formData.department_id),
        departmentService.getDoctorsByDepartment(formData.department_id),
      ]);
      setServices(srv);
      setDoctors(docs);
    } catch (err) {
      console.error("Lỗi tải dịch vụ/bác sĩ theo khoa:", err);
    }
  };
  loadRelated();
}, [formData.department_id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await appointmentService.update(editId, formData);
        alert("Cập nhật lịch hẹn thành công!");
      } else {
        await appointmentService.adminCreate(formData);
        alert("Thêm lịch hẹn mới thành công!");
      }
      setFormData(initialForm);
      setIsEditing(false);
      setEditId(null);
      loadAppointments();
    } catch (err) {
      alert("❌ Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (appt) => {
  setFormData({
    name: appt.name || "",
    email: appt.email || "",
    phone: appt.phone || "",
    gender: appt.gender || "Nam",
    date_of_birth: appt.date_of_birth || "",
    address: appt.address || "",
    // ✅ Lấy ID từ quan hệ con
    department_id: appt.department?.id || appt.department_id || "",
    service_id: appt.bookedService?.id || appt.service_id || "",
    doctor_id: appt.appointedDoctor?.id || appt.doctor_id || "",
    appointment_date: appt.appointment_date || "",
    appointment_time: appt.appointment_time || "",
    symptoms: appt.symptoms || "",
  });
  setIsEditing(true);
  setEditId(appt.id);
};


  const handleApprove = async (id) => {
    try {
      await appointmentService.approve(id);
      loadAppointments();
      alert("✅ Đã duyệt lịch!");
    } catch (err) {
      alert("❌ Lỗi duyệt: " + err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Lý do từ chối:");
    if (!reason) return;
    try {
      await appointmentService.reject(id, reason);
      loadAppointments();
      alert("❌ Đã từ chối lịch!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-purple-800"  style={{ marginTop: "20px" }}>📅 Quản lý Lịch Hẹn</h2>

      {/* --- FORM THÊM / SỬA --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-3 gap-3 text-sm"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tên bệnh nhân"
          className="border p-2 rounded"
          required
        />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className="border p-2 rounded" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
          <option>Nam</option>
          <option>Nữ</option>
          <option>Khác</option>
        </select>
        <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} className="border p-2 rounded" />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" className="border p-2 rounded col-span-2" />
        <select
  name="department_id"
  value={formData.department_id}
  onChange={handleChange}
  className="border p-2 rounded focus:ring-2 focus:ring-purple-300"
>
  <option value="">-- Chọn chuyên khoa --</option>
  {departments.map((d) => (
    <option key={d.id} value={d.id}>
      {d.name}
    </option>
  ))}
</select>

<select
  name="service_id"
  value={formData.service_id}
  onChange={handleChange}
  className="border p-2 rounded focus:ring-2 focus:ring-purple-300"
>
  <option value="">-- Chọn dịch vụ --</option>
  {services.map((s) => (
    <option key={s.id} value={s.id}>
      {s.title}
    </option>
  ))}
</select>

<select
  name="doctor_id"
  value={formData.doctor_id}
  onChange={handleChange}
  className="border p-2 rounded focus:ring-2 focus:ring-purple-300"
>
  <option value="">-- Chọn bác sĩ --</option>
  {doctors.map((d) => (
    <option key={d.id} value={d.id}>
      {d.name}
    </option>
  ))}
</select>

        <input name="appointment_date" type="date" value={formData.appointment_date} onChange={handleChange} className="border p-2 rounded" required />
        <input name="appointment_time" type="time" value={formData.appointment_time} onChange={handleChange} className="border p-2 rounded" required />
        <textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          placeholder="Triệu chứng / ghi chú"
          className="border p-2 rounded col-span-3"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded col-span-3"
        >
          {isEditing ? "💾 Lưu thay đổi" : "➕ Thêm lịch hẹn"}
        </button>
      </form>

      {/* --- DANH SÁCH --- */}
      <div className="overflow-x-auto shadow-md bg-white rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border text-left">Bệnh nhân</th>
              <th className="p-2 border">Chuyên khoa</th>
              <th className="p-2 border">Dịch vụ</th>
              <th className="p-2 border">Bác sĩ</th>
              <th className="p-2 border">Ngày</th>
              <th className="p-2 border">Giờ</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="border text-center">{i + 1}</td>
                <td className="border p-2">{a.name}</td>
                <td className="border p-2 text-center">{a.department?.name || "—"}</td>
                <td className="border p-2 text-center">{a.bookedService?.title || "—"}</td>
                <td className="border p-2 text-center">{a.appointedDoctor?.name || "—"}</td>
                <td className="border p-2 text-center">{a.appointment_date}</td>
                <td className="border p-2 text-center">{a.appointment_time}</td>
                <td className="border p-2 text-center">
                  {a.status === "pending" && <span className="text-yellow-600">Chờ duyệt</span>}
                  {a.status === "confirmed" && <span className="text-green-600">Đã duyệt</span>}
                  {a.status === "cancelled" && <span className="text-red-600">Từ chối</span>}
                  {a.status === "done" && <span className="text-gray-600">Hoàn tất</span>}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(a)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded mx-1"
                  >
                    Sửa
                  </button>
                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(a.id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded mx-1"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(a.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded mx-1"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentManager;
