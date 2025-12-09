// src/services/cclsResult.service.js
const db = require("../models");
const CclsResult = db.CclsResult;
const CclsRequest = db.CclsRequest;

// Bác sĩ CLS gửi kết quả
const submitResult = async ({
  ccls_request_id,
  description,
  conclusion,
  file_path,
}) => {
  const request = await CclsRequest.findByPk(ccls_request_id);

  if (!request) {
    throw new Error("Không tìm thấy yêu cầu cận lâm sàng");
  }

  // Có rồi thì update, chưa có thì tạo
  let result = await CclsResult.findOne({
    where: { ccls_request_id },
  });

  if (result) {
    await result.update({ description, conclusion, file_path });
  } else {
    result = await CclsResult.create({
      ccls_request_id,
      description,
      conclusion,
      file_path,
      doctor_id: request.assigned_doctor, //
    });
  }

  // Cập nhật trạng thái yêu cầu
  await request.update({ status: "completed" });

  return result;
};

// Lấy kết quả theo yêu cầu
const getResultByRequest = async (ccls_request_id) => {
  return await CclsResult.findOne({
    where: { ccls_request_id },
  });
};

module.exports = {
  submitResult,
  getResultByRequest,
};
