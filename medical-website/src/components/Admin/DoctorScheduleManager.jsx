import React, { useEffect, useState } from "react";
import doctorScheduleService from "../../services/doctorScheduleService";
import doctorService from "../../services/doctorService";
import timeSlotService from "../../services/timeSlotService";
import {
  FaCalendarAlt,
  FaTrash,
  FaClock,
  FaUserMd,
  FaSearch,
} from "react-icons/fa";

const DoctorScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDeleteIds, setSelectedDeleteIds] = useState([]);

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
      resSch.value?.data?.map((s) => ({ ...s, timeSlots: s.timeSlots || [] })) ||
        []
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
        await doctorScheduleService.assignSlots(
          schedule.data.id,
          selectedSlots,
          token
        );
      }
    }

    alert("✅ Tạo lịch thành công!");
    setForm({ doctor_id: "", days_of_week: [], sessions: [], selectedSlots: [] });
    loadAll();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa lịch này?")) return;
    await doctorScheduleService.remove(id, token);
    loadAll();
  };

  const handleDeleteMultiple = async () => {
    if (selectedDeleteIds.length === 0)
      return alert("Bạn chưa chọn lịch nào để xóa!");

    if (!window.confirm(`Xóa ${selectedDeleteIds.length} lịch?`)) return;

    for (const id of selectedDeleteIds) {
      await doctorScheduleService.remove(id, token);
    }

    setSelectedDeleteIds([]);
    loadAll();
  };

  const filteredSlots = timeSlots.filter((slot) =>
    form.sessions.includes(slot.period)
  );

  const toggleDeleteSelection = (id) => {
    setSelectedDeleteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="p-8 rounded-2xl space-y-12"
      style={{
        background: "linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <h2 className="text-4xl font-extrabold text-purple-700 flex items-center gap-3 mb-6">
        <FaCalendarAlt className="text-purple-600" /> Quản lý lịch làm việc bác sĩ
      </h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-7 space-y-6"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid #eee",
        }}
      >
        <h3 className="text-xl font-semibold text-purple-700 flex items-center gap-2 mb-3">
          <FaClock /> Tạo lịch làm việc
        </h3>

        {/* BÁC SĨ */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Bác sĩ</label>
          <select
            value={form.doctor_id}
            onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
            className="border rounded-xl p-3 w-full"
          >
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* NGÀY LÀM VIỆC — DẠNG GRID 3 CỘT ĐẸP */}
        <div>
          <label className="font-medium text-gray-700 block mb-2">
            Thứ làm việc
          </label>
          <div className="grid grid-cols-3 gap-3">
            {days.map((d) => {
              const active = form.days_of_week.includes(d.value);
              return (
                <div
                  key={d.value}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    active
                      ? "bg-purple-100 border-purple-500 shadow"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setForm({
                      ...form,
                      days_of_week: toggleArray(form.days_of_week, d.value),
                    })
                  }
                >
                  <input type="checkbox" className="mr-2" checked={active} readOnly />
                  {d.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* BUỔI */}
        <div>
          <label className="font-medium text-gray-700 block mb-2">
            Buổi làm việc
          </label>
          <div className="flex gap-6">
            {[
              { key: "morning", label: "Sáng ☀️" },
              { key: "afternoon", label: "Chiều 🌇" },
            ].map((s) => {
              const active = form.sessions.includes(s.key);
              return (
                <div
                  key={s.key}
                  className={`px-4 py-2 rounded-xl border cursor-pointer transition ${
                    active
                      ? "bg-purple-100 border-purple-500 shadow"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setForm({
                      ...form,
                      sessions: toggleArray(form.sessions, s.key),
                    })
                  }
                >
                  <input type="checkbox" className="mr-2" checked={active} readOnly />
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* KHUNG GIỜ */}
        <div>
          <label className="font-medium text-gray-700 block mb-2">Khung giờ</label>

          {filteredSlots.length === 0 ? (
            <p className="text-gray-500 italic">Chọn buổi để hiển thị.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredSlots.map((slot) => {
                const active = form.selectedSlots.includes(slot.id);
                return (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      active
                        ? "bg-purple-100 border-purple-500 shadow"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setForm({
                        ...form,
                        selectedSlots: active
                          ? form.selectedSlots.filter((id) => id !== slot.id)
                          : [...form.selectedSlots, slot.id],
                      })
                    }
                  >
                    <input type="checkbox" className="mr-2" checked={active} readOnly />
                    {slot.label} ({slot.period === "morning" ? "Sáng" : "Chiều"})
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
          >
            ➕ Tạo lịch làm việc
          </button>
        </div>
      </form>

      {/* BẢNG PHÂN CÔNG */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-purple-700">
          📅 Bảng phân công lịch làm việc
        </h3>

        {/* THANH TÌM KIẾM */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center bg-white p-3 rounded-xl border shadow-sm w-80">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              className="w-full outline-none"
              placeholder="Tìm bác sĩ..."
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </div>

          {selectedDeleteIds.length > 0 && (
            <button
              onClick={handleDeleteMultiple}
              className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700"
            >
              Xóa {selectedDeleteIds.length} lịch đã chọn
            </button>
          )}
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{
            border: "1px solid #eee",
            background: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <table className="w-full border-collapse">
            <thead className="bg-purple-100 text-purple-700">
              <tr>
                <th className="p-3 text-center">Chọn</th>
                <th className="p-3 text-left">Bác sĩ</th>
                <th className="p-3">Thứ</th>
                <th className="p-3">Buổi</th>
                <th className="p-3">Khung giờ</th>
                <th className="p-3 text-center">Xóa</th>
              </tr>
            </thead>

            <tbody>
              {(() => {
                const filtered = schedules.filter((s) =>
                  s.doctor?.name?.toLowerCase().includes(search)
                );

                const grouped = filtered.reduce((acc, sch) => {
                  const doctorName = sch.doctor?.name || "Không xác định";
                  if (!acc[doctorName]) acc[doctorName] = [];
                  acc[doctorName].push(sch);
                  return acc;
                }, {});

                return Object.keys(grouped).map((doctorName) => (
                  <>
                    <tr className="bg-purple-50">
                      <td colSpan="6" className="p-3 font-bold text-purple-700 text-lg">
                        <FaUserMd className="inline mr-2" />
                        {doctorName}
                      </td>
                    </tr>

                    {grouped[doctorName].map((s) => (
                      <tr key={s.id} className="border-t hover:bg-purple-50 transition">
                        {/* Checkbox chọn */}
                        <td className="text-center p-3">
                          <input
                            type="checkbox"
                            checked={selectedDeleteIds.includes(s.id)}
                            onChange={() => toggleDeleteSelection(s.id)}
                          />
                        </td>

                        {/* Bác sĩ */}
                        <td>{doctorName}</td>

                        {/* Thứ */}
                        <td className="text-center p-3">
                          {days.find((d) => d.value === String(s.day_of_week))?.label}
                        </td>

                        {/* Buổi */}
                        <td className="text-center p-3">
                          {s.session === "morning" ? "Sáng" : "Chiều"}
                        </td>

                        {/* Khung giờ */}
                        <td className="text-center p-3">
                          {s.timeSlots?.length
                            ? s.timeSlots.map((t) => t.label).join(", ")
                            : "Chưa gán"}
                        </td>

                        {/* Xóa */}
                        <td className="text-center p-3">
                          <button
                            className="text-red-600 hover:text-red-800 text-xl"
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
    </div>
  );
};

export default DoctorScheduleManager;
