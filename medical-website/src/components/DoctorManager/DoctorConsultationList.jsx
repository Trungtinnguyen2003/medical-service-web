import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaReply, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const DoctorConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchConsultations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/consultations/doctor",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConsultations(res.data);
    } catch (err) {
      console.error("Lỗi tải câu hỏi:", err);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleReply = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/consultations/${id}/answer`,
        { answer: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Đã gửi câu trả lời!");
      setReply("");
      setSelectedId(null);
      fetchConsultations();
    } catch (err) {
      console.error("Lỗi gửi câu trả lời:", err);
      alert("❌ Gửi thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-purple-100">
        <h2
          className="text-3xl font-extrabold text-purple-700 mb-10 text-center"
          style={{ marginTop: "80px" }}
        >
          📋 Danh sách câu hỏi tư vấn từ bệnh nhân
        </h2>

        {consultations.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10 text-lg">
            Hiện chưa có câu hỏi nào được gửi đến bạn.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-purple-100 shadow-sm">
              <thead className="bg-purple-100 text-purple-800">
                <tr>
                  <th className="border border-purple-200 px-4 py-3 text-left font-semibold">#</th>
                  <th className="border border-purple-200 px-4 py-3 text-left font-semibold">Tiêu đề</th>
                  <th className="border border-purple-200 px-4 py-3 text-left font-semibold">Bệnh nhân</th>
                  <th className="border border-purple-200 px-4 py-3 text-left font-semibold">Khoa</th>
                  <th className="border border-purple-200 px-4 py-3 text-left font-semibold">Nội dung</th>
                  <th className="border border-purple-200 px-4 py-3 text-center font-semibold">Trạng thái</th>
                  <th className="border border-purple-200 px-4 py-3 text-center font-semibold w-40">Hành động</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-purple-100">
                {consultations.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-purple-50 transition-all">
                      <td className="px-4 py-3 border border-purple-100 text-center text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 border border-purple-100 font-medium text-purple-800">
                        {item.title}
                      </td>
                      <td className="px-4 py-3 border border-purple-100 text-gray-700">
                        {item.patient?.name || "Ẩn danh"}
                      </td>
                      <td className="px-4 py-3 border border-purple-100 text-gray-700">
                        {item.department?.name || "—"}
                      </td>
                      <td className="px-4 py-3 border border-purple-100 text-gray-600">
                        <div className="max-w-xs truncate" title={item.content}>
                          {item.content}
                        </div>
                      </td>
                      <td className="px-4 py-3 border border-purple-100 text-center">
                        {item.status === "answered" ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                            <FaCheckCircle /> Đã trả lời
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                            <FaTimesCircle /> Chưa trả lời
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 border border-purple-100 text-center">
                        {item.status === "pending" && selectedId !== item.id && (
                          <button
                            onClick={() => setSelectedId(item.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-transform hover:scale-[1.03]"
                          >
                            <FaReply className="inline mr-1" /> Trả lời
                          </button>
                        )}
                        {item.status === "answered" && (
                          <span className="text-sm italic text-gray-500">Đã phản hồi</span>
                        )}
                      </td>
                    </tr>

                    {/* Form nhập trả lời chi tiết bằng CKEditor */}
                    {selectedId === item.id && (
                      <tr>
                        <td colSpan="7" className="bg-purple-50 p-6">
                          <div className="mb-5">
                            <label className="font-semibold text-purple-700 block mb-2 text-lg">
                              ✍️ Nội dung trả lời chi tiết:
                            </label>
                            <div className="border border-purple-200 rounded-lg shadow-inner bg-white p-2">
                              <CKEditor
  editor={ClassicEditor}
  data={reply}
  onChange={(event, editor) => setReply(editor.getData())}
  config={{
    ckfinder: {
      uploadUrl: "http://localhost:5000/api/upload/image", // ✅ sử dụng endpoint upload có sẵn
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "link",
      "|",
      "bulletedList",
      "numberedList",
      "blockQuote",
      "|",
      "insertTable",
      "imageUpload", // 👈 thêm nút upload ảnh
      "undo",
      "redo",
    ],
    image: {
      toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
    },
  }}
/>

                            </div>
                          </div>

                          <div className="flex justify-end gap-3 mt-4">
                            <button
                              onClick={() => handleReply(item.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                            >
                              Gửi trả lời
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(null);
                                setReply("");
                              }}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg text-sm font-semibold"
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Hiển thị phản hồi đã gửi */}
                    {item.status === "answered" && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="p-4">
                          <div className="bg-white border-l-4 border-green-500 rounded-lg p-5 shadow-sm">
                            <div
  className="answer-content text-gray-700 leading-relaxed"
  dangerouslySetInnerHTML={{ __html: item.answer }}
></div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};



export default DoctorConsultationList;
