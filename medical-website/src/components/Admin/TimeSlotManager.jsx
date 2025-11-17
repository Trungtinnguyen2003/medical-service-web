import React, { useEffect, useState } from "react";
import timeSlotService from "../../services/timeSlotService";
import { FaClock, FaTrash, FaEdit, FaPlus, FaMagic } from "react-icons/fa";

const TimeSlotManager = () => {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ start_time: "", end_time: "", period: "morning" });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // 🔹 Load danh sách khung giờ
  const loadData = async () => {
    const res = await timeSlotService.getAll();
    setSlots(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 Tự động tạo khung giờ sáng + chiều
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

    let createdCount = 0;
    for (const s of defaultSlots) {
      const label = `${s.start} - ${s.end}`;
      // Kiểm tra nếu chưa có thì thêm
      const exists = slots.some((x) => x.label === label);
      if (!exists) {
        await timeSlotService.create(
          { label, start_time: s.start, end_time: s.end, period: s.period },
          token
        );
        createdCount++;
      }
    }

    alert(createdCount > 0 ? `✅ Đã tạo ${createdCount} khung giờ chuẩn` : "Tất cả khung giờ đã tồn tại rồi!");
    loadData();
  };

  // 🔹 Thêm hoặc cập nhật thủ công
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.start_time || !form.end_time) {
      alert("Vui lòng nhập đầy đủ giờ bắt đầu và giờ kết thúc!");
      return;
    }

    const autoLabel = `${form.start_time} - ${form.end_time}`;
    const payload = { ...form, label: autoLabel };

    if (editingId) {
      await timeSlotService.update(editingId, payload, token);
    } else {
      await timeSlotService.create(payload, token);
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
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700" style={{ marginTop: "20px" }}>
        <FaClock /> Quản lý Khung Giờ
      </h2>

      {/* Nút tạo tự động */}
      <button
        onClick={generateStandardSlots}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
      >
        <FaMagic />
        Tạo khung giờ chuẩn
      </button>

      {/* Form nhập khung giờ */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-5 gap-3 items-center mb-6 border p-4 rounded-lg bg-purple-50"
      >
        <input
          type="time"
          className="border p-2 rounded"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        />
        <input
          type="time"
          className="border p-2 rounded"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.period}
          onChange={(e) => setForm({ ...form, period: e.target.value })}
        >
          <option value="morning">Buổi sáng</option>
          <option value="afternoon">Buổi chiều</option>
        </select>
        <button
          type="submit"
          className="col-span-2 bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 flex items-center justify-center gap-2"
        >
          <FaPlus />
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* Bảng hiển thị khung giờ */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-purple-100 text-purple-700">
          <tr>
            <th className="p-2 w-10">ID</th>
            <th>Khung giờ</th>
            <th>Buổi</th>
            <th>Giờ bắt đầu</th>
            <th>Giờ kết thúc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.id} className="border-t hover:bg-purple-50">
              <td className="p-2 text-center">{s.id}</td>
              <td className="text-center">{s.label}</td>
              <td className="text-center">
                {s.period === "morning" ? "Sáng" : "Chiều"}
              </td>
              <td className="text-center">{s.start_time}</td>
              <td className="text-center">{s.end_time}</td>
              <td className="flex justify-center gap-3 py-2">
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
              </td>
            </tr>
          ))}
          {slots.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Chưa có khung giờ nào được tạo
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimeSlotManager;
