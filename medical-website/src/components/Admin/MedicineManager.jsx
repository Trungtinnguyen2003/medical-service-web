import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPills,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlusCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/medicines";

const initialMedicine = {
  name: "",
  generic_name: "",
  unit: "viên",
  price: "",
  stock: "",
  manufacturer: "",
  expiration_date: "",
  category: "",
  description: "",
};

const MedicineManager = () => {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState(initialMedicine);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ Lấy danh sách thuốc
  const fetchMedicines = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách thuốc:", err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ✅ Thêm hoặc cập nhật thuốc
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchMedicines();
      setFormData(initialMedicine);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      console.error("Lỗi lưu thuốc:", err);
    }
  };

  // ✅ Xóa thuốc
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thuốc này không?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMedicines();
    } catch (err) {
      console.error("Lỗi xóa thuốc:", err);
    }
  };

  // ✅ Chỉnh sửa thuốc
  const handleEdit = (med) => {
    setFormData(med);
    setEditingId(med.id);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(initialMedicine);
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-purple-700 flex items-center gap-2" style={{ marginTop: "20px" }}>
        <FaPills className="text-purple-600" />
        Quản lý Thuốc
      </h2>

      {/* Form thêm/sửa thuốc */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {isEditing ? "✏️ Cập nhật thông tin thuốc" : "➕ Thêm thuốc mới"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Tên thuốc
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Hoạt chất (Generic Name)
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.generic_name}
              onChange={(e) =>
                setFormData({ ...formData, generic_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Đơn vị
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Số lượng tồn kho
            </label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Hãng sản xuất
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.manufacturer}
              onChange={(e) =>
                setFormData({ ...formData, manufacturer: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Hạn sử dụng
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.expiration_date}
              onChange={(e) =>
                setFormData({ ...formData, expiration_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Nhóm thuốc
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-600 mb-1 font-medium">
              Mô tả / Hướng dẫn sử dụng
            </label>
            <textarea
              rows={2}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-400"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-3">
            <button
              type="submit"
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaSave />
              {isEditing ? "Lưu thay đổi" : "Thêm thuốc"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 flex items-center gap-2"
              >
                <FaTimes /> Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Danh sách thuốc */}
      {/* Danh sách thuốc */}
<div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-auto">
  <table className="min-w-full text-sm text-gray-800 border-collapse">
    <thead className="bg-purple-600 text-white sticky top-0 z-10 shadow-sm">
      <tr>
        <th className="border border-gray-300 p-3 text-center w-12">#</th>
        <th className="border border-gray-300 p-3 text-left min-w-[180px]">Tên thuốc</th>
        <th className="border border-gray-300 p-3 text-left min-w-[150px]">Hoạt chất</th>
        <th className="border border-gray-300 p-3 text-center">Đơn vị</th>
        <th className="border border-gray-300 p-3 text-right w-24">Giá (VNĐ)</th>
        <th className="border border-gray-300 p-3 text-center w-20">Tồn kho</th>
        <th className="border border-gray-300 p-3 text-left min-w-[160px]">Hãng sản xuất</th>
        <th className="border border-gray-300 p-3 text-center w-32">Hạn dùng</th>
        <th className="border border-gray-300 p-3 text-left min-w-[120px]">Nhóm thuốc</th>
        <th className="border border-gray-300 p-3 text-left min-w-[250px]">Mô tả / Hướng dẫn</th>
        <th className="border border-gray-300 p-3 text-center w-28">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      {medicines.length === 0 ? (
        <tr>
          <td colSpan="11" className="text-center py-4 text-gray-500">
            Chưa có thuốc nào
          </td>
        </tr>
      ) : (
        medicines.map((med, idx) => (
          <tr
            key={med.id}
            className={`transition hover:bg-purple-50 ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <td className="border border-gray-200 text-center p-2 font-medium text-gray-700">
              {idx + 1}
            </td>
            <td className="border border-gray-200 p-2 font-semibold text-gray-800">
              {med.name}
            </td>
            <td className="border border-gray-200 p-2 text-gray-700">
              {med.generic_name || "-"}
            </td>
            <td className="border border-gray-200 text-center p-2">
              {med.unit}
            </td>
            <td className="border border-gray-200 text-right p-2 font-medium text-purple-700">
              {Number(med.price).toLocaleString()}
            </td>
            <td className="border border-gray-200 text-center p-2 font-semibold">
              {med.stock}
            </td>
            <td className="border border-gray-200 p-2">{med.manufacturer}</td>
            <td className="border border-gray-200 text-center p-2">
              {med.expiration_date?.slice(0, 10) || "-"}
            </td>
            <td className="border border-gray-200 p-2">{med.category}</td>
            <td className="border border-gray-200 p-2 text-gray-600 leading-snug">
              {med.description || "-"}
            </td>
            <td className="border border-gray-200 text-center p-2">
              <button
                onClick={() => handleEdit(med)}
                className="text-blue-600 hover:text-blue-800 mr-3"
                title="Sửa"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(med.id)}
                className="text-red-600 hover:text-red-800"
                title="Xóa"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default MedicineManager;
