import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCapsules, FaStethoscope } from "react-icons/fa";

const PrescriptionDetail = ({ appointmentId }) => {
  const [prescription, setPrescription] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!appointmentId) return;
    axios
      .get(
        `http://localhost:5000/api/prescriptions/appointment/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setPrescription(res.data))
      .catch((err) => console.error("Lỗi lấy toa:", err));
  }, [appointmentId]);

  if (!prescription)
    return (
      <div className="text-gray-500 text-sm italic mt-3 ml-2">
        (Chưa có toa thuốc được kê)
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-5 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h4 className="text-xl font-bold text-purple-700 flex items-center gap-2">
          <FaCapsules className="text-purple-500 text-lg" />
          Toa thuốc #{prescription.id}
        </h4>
        <p className="text-gray-700 mt-2 sm:mt-0 flex items-center gap-2 text-[15px]">
          <FaStethoscope className="text-blue-500" />
          <span>
            <strong>Chẩn đoán:</strong>{" "}
            {prescription.note || "Không có ghi chú"}
          </span>
        </p>
      </div>

      {/* Bảng thuốc */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full border-collapse text-[15px] text-gray-700">
          <thead className="bg-purple-100 text-gray-800">
            <tr>
              <th className="border-b p-4 text-left w-[30%]">Tên thuốc</th>
              <th className="border-b p-4 text-center w-[8%]">Liều</th>
              <th className="border-b p-4 text-center w-[8%]">SL</th>
              <th className="border-b p-4 text-left w-[15%]">Cách dùng</th>
              <th className="border-b p-4 text-left w-[20%]">Thời gian</th>
              <th className="border-b p-4 text-left w-[19%]">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {prescription.items.map((it) => (
              <tr
                key={it.id}
                className="even:bg-gray-50 hover:bg-purple-50 transition-colors"
              >
                <td className="p-4 border-b text-left font-medium whitespace-nowrap">
                  {it.Medicine?.name}
                </td>
                <td className="p-4 border-b text-center">{it.dosage}</td>
                <td className="p-4 border-b text-center">{it.quantity}</td>
                <td className="p-4 border-b text-left whitespace-nowrap">
                  {it.frequency}
                </td>
                <td className="p-4 border-b text-left whitespace-nowrap">
                  {it.duration}
                </td>
                <td className="p-4 border-b text-left">{it.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-4 italic">
        👩‍⚕️ Vui lòng dùng thuốc theo đúng hướng dẫn của bác sĩ.
      </p>
    </div>
  );
};

export default PrescriptionDetail;
