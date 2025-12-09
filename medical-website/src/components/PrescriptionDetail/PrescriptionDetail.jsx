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
    <div className="
      mt-6 p-8 rounded-3xl
      bg-white/90 backdrop-blur-2xl 
      border border-slate-200 
      shadow-[0_12px_40px_rgba(20,20,40,0.08)]
      hover:shadow-[0_18px_55px_rgba(60,0,120,0.18)]
      transition-all duration-300
    ">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="
            p-4 rounded-2xl 
            bg-gradient-to-br from-purple-100 to-purple-200 
            shadow-inner
          ">
            <FaCapsules className="text-purple-700 text-3xl" />
          </div>

          <div>
            <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Toa thuốc #{prescription.id}
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              Danh sách thuốc được bác sĩ kê trong buổi khám
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="
          flex items-center gap-3 px-5 py-3 rounded-2xl 
          bg-gradient-to-r from-blue-50 to-blue-100 
          border border-blue-200 shadow-inner
        ">
          <FaStethoscope className="text-blue-700 text-xl" />
          <span className="text-[15px] text-slate-700 leading-snug">
            <strong className="font-semibold">Chẩn đoán:</strong>{" "}
            {prescription.note || "Không có ghi chú"}
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
        <table className="min-w-full text-[15px] text-slate-700">
          <thead>
            <tr className="
              bg-gradient-to-r from-slate-100 to-slate-50
              text-slate-700 text-[14px]
            ">
              <th className="p-4 text-left font-semibold">Tên thuốc</th>
              <th className="p-4 text-center font-semibold w-[8%]">SL</th>
              <th className="p-4 text-left font-semibold w-[20%]">Cách dùng</th>
              <th className="p-4 text-left font-semibold w-[18%]">Thời gian</th>
              <th className="p-4 text-left font-semibold w-[25%]">Ghi chú</th>
            </tr>
          </thead>

          <tbody>
            {prescription.items.map((it, idx) => (
              <tr
                key={it.id}
                className={`
                  transition-all border-b border-slate-100
                  ${idx % 2 === 0 ? "bg-slate-50/40" : "bg-white"}
                  hover:bg-purple-50/40
                `}
              >
                <td className="p-4 font-semibold text-slate-900 whitespace-nowrap">
                  {it.Medicine?.name}
                </td>

                <td className="p-4 text-center font-bold text-purple-700">
                  {it.quantity}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {it.frequency || "—"}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {it.duration || "—"}
                </td>

                <td className="p-4">{it.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="
        mt-6 p-4 rounded-2xl 
        bg-gradient-to-r from-purple-50 to-purple-100 
        border border-purple-200 shadow-inner
        text-center
      ">
        <p className="text-xs text-slate-600 italic flex items-center justify-center gap-2">
          <FaStethoscope className="text-purple-600" />
          <span>
            Vui lòng tuân thủ đúng hướng dẫn của bác sĩ để đảm bảo hiệu quả điều trị.
          </span>
        </p>
      </div>
    </div>
  );
};

export default PrescriptionDetail;
