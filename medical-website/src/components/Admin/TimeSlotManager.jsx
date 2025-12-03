import React, { useEffect, useState } from "react";
import timeSlotService from "../../services/timeSlotService";
import { FaClock, FaTrash, FaEdit, FaPlus, FaMagic } from "react-icons/fa";

const TimeSlotManager = () => {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({
    start_time: "",
    end_time: "",
    period: "morning",
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const loadData = async () => {
    const res = await timeSlotService.getAll();
    setSlots(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateStandardSlots = async () => {
    const defaultSlots = [
      { start: "07:30", end: "08:30", period: "morning" },
      { start: "08:30", end: "09:30", period: "morning" },
      { start: "09:30", end: "10:30", period: "morning" },
      { start: "10:30", end: "11:30", period: "morning" },
      { start: "13:00", end: "14:00", period: "afternoon" },
      { start: "14:00", end: "15:00", period: "afternoon" },
      { start: "15:00", end: "16:00", period: "afternoon" },
    ];

    let created = 0;
    for (const s of defaultSlots) {
      const label = `${s.start} - ${s.end}`;
      const exists = slots.some((x) => x.label === label);
      if (!exists) {
        await timeSlotService.create(
          { label, start_time: s.start, end_time: s.end, period: s.period },
          token
        );
        created++;
      }
    }

    alert(
      created > 0
        ? `✅ Đã tạo ${created} khung giờ chuẩn`
        : "Tất cả khung giờ đã tồn tại!"
    );
    loadData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.start_time || !form.end_time) {
      alert("Vui lòng nhập đầy đủ giờ bắt đầu và kết thúc!");
      return;
    }

    const label = `${form.start_time} - ${form.end_time}`;
    const data = { ...form, label };

    if (editingId) {
      await timeSlotService.update(editingId, data, token);
    } else {
      await timeSlotService.create(data, token);
    }

    setForm({ start_time: "", end_time: "", period: "morning" });
    setEditingId(null);
    loadData();
  };

  const handleEdit = (slot) => {
    setForm({
      start_time: slot.start_time,
      end_time: slot.end_time,
      period: slot.period,
    });
    setEditingId(slot.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá khung giờ này?")) {
      await timeSlotService.remove(id, token);
      loadData();
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white to-purple-50 min-h-screen rounded-xl shadow-md">
      <div className="mb-6"  style={{ marginTop: "20px" }}>
        <h2 className="text-3xl font-extrabold text-purple-700 flex items-center gap-3">
          <FaClock className="text-purple-600" />
          Quản lý Khung Giờ
        </h2>
        <p className="text-gray-500 mt-1">
          Tạo, chỉnh sửa và quản lý khung giờ khám trong hệ thống.
        </p>
      </div>

      {/* Nút tạo tự động */}
      <button
        onClick={generateStandardSlots}
        className="mb-6 bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-sm transition"
      >
        <FaMagic />
        Tạo khung giờ chuẩn
      </button>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 mb-8">
        <h3 className="text-xl font-semibold text-purple-700 mb-4">
          {editingId ? "Cập nhật khung giờ" : "Thêm khung giờ mới"}
        </h3>

        <form className="grid grid-cols-5 gap-4 items-end" onSubmit={handleSubmit}>
          {/* Bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              className="border p-2 rounded-lg w-full mt-1 focus:ring-purple-500 focus:border-purple-500"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />
          </div>

          {/* Kết thúc */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Giờ kết thúc
            </label>
            <input
              type="time"
              className="border p-2 rounded-lg w-full mt-1 focus:ring-purple-500 focus:border-purple-500"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            />
          </div>

          {/* Buổi */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Buổi
            </label>
            <select
              className="border p-2 rounded-lg w-full mt-1"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            >
              <option value="morning">Buổi sáng</option>
              <option value="afternoon">Buổi chiều</option>
            </select>
          </div>

          {/* Nút */}
          <button
            type="submit"
            className="bg-purple-600 text-white py-3 rounded-lg col-span-2 hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow"
          >
            <FaPlus />
            {editingId ? "Lưu thay đổi" : "Thêm mới"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
        <table className="w-full table-auto">
          <thead className="bg-purple-100 text-purple-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Khung giờ</th>
              <th className="p-3 text-left">Buổi</th>
              <th className="p-3 text-left">Bắt đầu</th>
              <th className="p-3 text-left">Kết thúc</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {slots.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  Chưa có khung giờ nào
                </td>
              </tr>
            )}

            {slots.map((s) => (
              <tr
                key={s.id}
                className="border-t hover:bg-purple-50 transition"
              >
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.label}</td>
                <td className="p-3">{s.period === "morning" ? "Sáng" : "Chiều"}</td>
                <td className="p-3">{s.start_time}</td>
                <td className="p-3">{s.end_time}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(s)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(s.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeSlotManager;
