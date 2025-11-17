import React, { useEffect, useState } from "react";
import doctorScheduleService from "../../services/doctorScheduleService";
import doctorService from "../../services/doctorService";
import timeSlotService from "../../services/timeSlotService";
import { FaCalendarAlt, FaTrash, FaClock } from "react-icons/fa";

const DoctorScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [form, setForm] = useState({
    doctor_id: "",
    days_of_week: [],
    sessions: [],
    selectedSlots: [],
  });

  const token = localStorage.getItem("token");

  const days = [
    { value: "1", label: "Thứ 2" },
    { value: "2", label: "Thứ 3" },
    { value: "3", label: "Thứ 4" },
    { value: "4", label: "Thứ 5" },
    { value: "5", label: "Thứ 6" },
    { value: "6", label: "Thứ 7" },
    { value: "7", label: "Chủ nhật" },
  ];

  const toggleArray = (arr, value) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const loadAll = async () => {
    const [resSch, resDoc, resSlot] = await Promise.allSettled([
      doctorScheduleService.getAll(token),
      doctorService.getAllDoctors(),
      timeSlotService.getAll(),
    ]);

    setSchedules(
      resSch.value?.data?.map((s) => ({ ...s, timeSlots: s.timeSlots || [] })) || []
    );
    setDoctors(resDoc.value || []);
    setTimeSlots(resSlot.value?.data || []);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { doctor_id, days_of_week, sessions, selectedSlots } = form;
    if (!doctor_id || !days_of_week.length || !sessions.length || !selectedSlots.length)
      return alert("Vui lòng chọn đầy đủ thông tin!");

    for (const day of days_of_week) {
      for (const session of sessions) {
        const schedule = await doctorScheduleService.create(
          { doctor_id, day_of_week: day, session },
          token
        );
        await doctorScheduleService.assignSlots(schedule.data.id, selectedSlots, token);
      }
    }
    alert("✅ Tạo lịch thành công!");
    setForm({ doctor_id: "", days_of_week: [], sessions: [], selectedSlots: [] });
    loadAll();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa lịch này?")) {
      await doctorScheduleService.remove(id, token);
      loadAll();
    }
  };

  const filteredSlots = timeSlots.filter((slot) =>
    form.sessions.includes(slot.period)
  );

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg space-y-10">
      <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-3" style={{ marginTop: "20px" }}>
        <FaCalendarAlt /> Quản lý lịch làm việc bác sĩ
      </h2>

      {/* FORM TẠO LỊCH */}
      <form
        onSubmit={handleSubmit}
        className="border rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-white shadow-md"
      >
        <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
          <FaClock /> Tạo lịch làm việc
        </h3>

        {/* 1️⃣ CHỌN BÁC SĨ */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-1">Bác sĩ</label>
          <select
            value={form.doctor_id}
            onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
            className="border rounded-lg p-2 w-full"
          >
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2️⃣ CHỌN THỨ */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-2">
            Thứ làm việc
          </label>
          <div className="grid grid-cols-4 gap-2">
            {days.map((d) => (
              <label
                key={d.value}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${
                  form.days_of_week.includes(d.value)
                    ? "bg-purple-100 border-purple-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.days_of_week.includes(d.value)}
                  onChange={() =>
                    setForm({
                      ...form,
                      days_of_week: toggleArray(form.days_of_week, d.value),
                    })
                  }
                />
                {d.label}
              </label>
            ))}
          </div>
        </div>

        {/* 3️⃣ CHỌN BUỔI */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-2">
            Buổi làm việc
          </label>
          <div className="flex gap-4">
            {[
              { key: "morning", label: "Buổi sáng ☀️" },
              { key: "afternoon", label: "Buổi chiều 🌇" },
            ].map((s) => (
              <label
                key={s.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                  form.sessions.includes(s.key)
                    ? "bg-purple-100 border-purple-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.sessions.includes(s.key)}
                  onChange={() =>
                    setForm({
                      ...form,
                      sessions: toggleArray(form.sessions, s.key),
                    })
                  }
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>

        {/* 4️⃣ CHỌN KHUNG GIỜ */}
        <div className="mb-6">
          <label className="font-medium text-gray-700 block mb-2">
            Khung giờ làm việc
          </label>
          {filteredSlots.length === 0 ? (
            <p className="text-gray-500 italic">Chọn buổi để hiển thị khung giờ.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredSlots.map((slot) => (
                <label
                  key={slot.id}
                  className={`flex items-center gap-2 border rounded-lg p-2 cursor-pointer ${
                    form.selectedSlots.includes(slot.id)
                      ? "bg-purple-100 border-purple-400"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.selectedSlots.includes(slot.id)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        selectedSlots: e.target.checked
                          ? [...form.selectedSlots, slot.id]
                          : form.selectedSlots.filter((id) => id !== slot.id),
                      })
                    }
                  />
                  {slot.label} ({slot.period === "morning" ? "Sáng" : "Chiều"})
                </label>
              ))}
            </div>
          )}
        </div>

        {/* NÚT TẠO */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold shadow"
          >
            ➕ Tạo lịch làm việc
          </button>
        </div>
      </form>

      {/* DANH SÁCH LỊCH */}
      <div>
        <h3 className="text-lg font-semibold text-purple-700 mb-3">
          📅 Danh sách lịch làm việc
        </h3>
        <table className="w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-purple-100 text-purple-700">
            <tr>
              <th className="p-2">Bác sĩ</th>
              <th>Thứ</th>
              <th>Buổi</th>
              <th>Khung giờ</th>
              <th>Hành động</th>
            </tr>
          </thead>
        <tbody>
  {(() => {
    // 🔥 NHÓM LỊCH THEO BÁC SĨ
    const grouped = schedules.reduce((acc, sch) => {
      const doctorName = sch.doctor?.name || "Không xác định";

      if (!acc[doctorName]) acc[doctorName] = [];
      acc[doctorName].push(sch);

      return acc;
    }, {});

    // 🔥 RENDER THEO TỪNG BÁC SĨ
    return Object.keys(grouped).map((doctorName) => (
      <>
        {/* HÀNG TIÊU ĐỀ BÁC SĨ */}
        <tr className="bg-purple-50 border-t">
          <td colSpan="5" className="font-bold text-purple-700 p-3 text-lg">
            👨‍⚕️ {doctorName}
          </td>
        </tr>

        {/* CÁC LỊCH CỦA BÁC SĨ */}
        {grouped[doctorName].map((s) => (
          <tr key={s.id} className="border-t hover:bg-purple-50">
            <td></td>
            <td>{days.find((d) => d.value === String(s.day_of_week))?.label}</td>
            <td>{s.session === "morning" ? "Sáng" : "Chiều"}</td>
            <td>
              {s.timeSlots?.length
                ? s.timeSlots.map((t) => t.label).join(", ")
                : "Chưa gán"}
            </td>
            <td className="text-center">
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDelete(s.id)}
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </>
    ));
  })()}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default DoctorScheduleManager;
