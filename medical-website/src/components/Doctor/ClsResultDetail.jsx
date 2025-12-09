// src/components/Doctor/ClsResultDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ClsResultDetail = ({ appointmentId }) => {
  const token = localStorage.getItem("token");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCls = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/ccls/requests/by-appointment/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(res.data || []);
    } catch (err) {
      console.error("Lỗi tải CLS:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCls();
  }, []);

  if (loading) return <p>Đang tải thông tin cận lâm sàng...</p>;

  if (requests.length === 0)
    return (
      <div className="p-4 text-gray-500">
        Không có yêu cầu cận lâm sàng nào cho lịch khám này.
      </div>
    );

  return (
    <div className="p-4 bg-white rounded-xl shadow border border-gray-200">
      <h3 className="text-lg font-bold text-purple-700 mb-3">
        🔬 Thông tin Cận Lâm Sàng
      </h3>

      {requests.map((req) => (
        <div
          key={req.id}
          className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
        >
          {/* THÔNG TIN YÊU CẦU */}
          <p className="font-semibold text-gray-800 text-md">
            📌 Dịch vụ CLS:{" "}
            <span className="text-purple-700">{req.service?.title}</span>
          </p>

          {/* <p className="text-sm text-gray-700">
            Chỉ định bởi:{" "}
            <b className="text-gray-900">{req.requestedByDoctor?.name}</b>
          </p> */}

          <p className="text-sm text-gray-700">
            Ghi chú: <i>{req.note || "—"}</i>
          </p>

          {/* TRẠNG THÁI */}
          <p className="mt-1">
            Trạng thái:{" "}
            {req.status === "pending" ? (
              <span className="px-2 py-1 bg-yellow-400 text-white rounded-md text-xs">
                Đang chờ xử lý
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-600 text-white rounded-md text-xs">
                Đã hoàn tất
              </span>
            )}
          </p>

          {/* KẾT QUẢ CLS */}
          {req.result ? (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-semibold text-green-700">
                ✔ Kết quả CLS
              </p>

              <p className="text-sm mt-1">
                <b>Mô tả:</b> {req.result.description}
              </p>

              <p className="text-sm mt-1">
                <b>Kết luận:</b> {req.result.conclusion}
              </p>

              <p className="text-xs mt-2 text-gray-500">
                Bác sĩ thực hiện: {req.result.doctor?.name || "--"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-orange-600 mt-2">
              ⏳ Chưa có kết quả trả về.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClsResultDetail;
