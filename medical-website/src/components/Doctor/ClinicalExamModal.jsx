// src/components/Doctor/ClinicalExamModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ClinicalExamModal = ({ appointment, onClose, onDone }) => {
  const token = localStorage.getItem("token");

  const [diagnosis, setDiagnosis] = useState(""); // ghi chú/chẩn đoán lâm sàng
  const [medicines, setMedicines] = useState([]);
  const [items, setItems] = useState([
    { medicine_id: "", dosage: "", quantity: 1, frequency: "", duration: "", note: "" },
  ]);
  const [saving, setSaving] = useState(false);

  // Lấy danh sách thuốc cho dropdown
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMedicines(res.data || []))
      .catch((err) => console.error("Lỗi tải danh sách thuốc:", err));
  }, [token]);

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { medicine_id: "", dosage: "", quantity: 1, frequency: "", duration: "", note: "" },
    ]);
  };

  const removeRow = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (idx, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx][field] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!diagnosis.trim()) {
      alert("Vui lòng nhập chẩn đoán/ghi chú.");
      return;
    }
    if (items.length === 0 || items.some((it) => !it.medicine_id)) {
      alert("Vui lòng chọn ít nhất 1 thuốc.");
      return;
    }

    try {
      setSaving(true);

      // 1) Tạo toa thuốc
      await axios.post(
        "http://localhost:5000/api/prescriptions",
        {
          appointment_id: appointment.id,
          note: diagnosis,
          items: items.map((it) => ({
            medicine_id: Number(it.medicine_id),
            dosage: it.dosage,
            quantity: Number(it.quantity) || 1,
            frequency: it.frequency,
            duration: it.duration,
            note: it.note,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2) Cập nhật trạng thái lịch sang done
      await axios.put(
        `http://localhost:5000/appointments/doctor/${appointment.id}/status`,
        { status: "done" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Đã khám và kê thuốc thành công!");
      onDone && onDone();
    } catch (err) {
      console.error("❌ Lỗi lưu toa/đổi trạng thái:", err);
      alert("Không thể lưu kết quả khám. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[90vh] overflow-auto p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-purple-700">
              🩺 Khám lâm sàng — {appointment?.user?.name || appointment?.name || "Bệnh nhân"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Dịch vụ: <b>{appointment?.bookedService?.title || "—"}</b> &nbsp;|&nbsp; Ngày:{" "}
              <b>{appointment?.appointment_date}</b> &nbsp;—&nbsp; Giờ:{" "}
              <b>{appointment?.appointment_time}</b>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Đóng ✖
          </button>
        </div>

        {/* Chẩn đoán / ghi chú */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">🧾 Chẩn đoán / Ghi chú</label>
        <textarea
          rows={2}
          className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-purple-300"
          placeholder="Ví dụ: Viêm họng cấp, không sốt; theo dõi 5 ngày..."
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />

        {/* Kê thuốc */}
        <h4 className="text-sm font-semibold text-gray-700 mb-2">💊 Kê thuốc</h4>
        <div className="overflow-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-purple-100">
              <tr>
                <th className="border p-2 text-left min-w-[220px]">Thuốc</th>
                <th className="border p-2 text-left w-32">Liều dùng</th>
                <th className="border p-2 text-center w-24">Số lượng</th>
                <th className="border p-2 text-left w-32">Cách dùng</th>
                <th className="border p-2 text-left w-28">Thời gian</th>
                <th className="border p-2 text-left min-w-[120px]">Ghi chú</th>
                <th className="border p-2 text-center w-16">Xoá</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx} className={idx % 2 ? "bg-gray-50" : ""}>
                  <td className="border p-1">
                    <select
                      value={it.medicine_id}
                      onChange={(e) => handleChange(idx, "medicine_id", e.target.value)}
                      className="w-full border rounded p-1"
                    >
                      <option value="">-- chọn thuốc --</option>
                      {medicines.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-1">
                    <input
                      className="w-full border rounded p-1"
                      placeholder="500mg"
                      value={it.dosage}
                      onChange={(e) => handleChange(idx, "dosage", e.target.value)}
                    />
                  </td>
                  <td className="border p-1 text-center">
                    <input
                      type="number"
                      min={1}
                      className="w-20 border rounded p-1 text-center"
                      value={it.quantity}
                      onChange={(e) => handleChange(idx, "quantity", e.target.value)}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      className="w-full border rounded p-1"
                      placeholder="2 lần/ngày"
                      value={it.frequency}
                      onChange={(e) => handleChange(idx, "frequency", e.target.value)}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      className="w-full border rounded p-1"
                      placeholder="5 ngày"
                      value={it.duration}
                      onChange={(e) => handleChange(idx, "duration", e.target.value)}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      className="w-full border rounded p-1"
                      placeholder="Sau ăn"
                      value={it.note}
                      onChange={(e) => handleChange(idx, "note", e.target.value)}
                    />
                  </td>
                  <td className="border p-1 text-center">
                    <button
                      onClick={() => removeRow(idx)}
                      className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                      title="Xoá dòng thuốc"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addRow}
          className="mt-3 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          ➕ Thêm thuốc
        </button>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg"
          >
            {saving ? "Đang lưu..." : "✅ Hoàn tất khám"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalExamModal;
