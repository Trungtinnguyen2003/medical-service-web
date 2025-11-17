const medicineService = require("../services/medicine.service");

exports.getAll = async (req, res) => {
  try {
    const data = await medicineService.getAll();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách thuốc", error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await medicineService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy thuốc", error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    console.log("🧾 Dữ liệu nhận:", req.body); // ✅ thêm dòng này
    const data = await medicineService.create(req.body);
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi thêm thuốc:", err);
    res.status(500).json({ message: "Lỗi thêm thuốc", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await medicineService.update(req.params.id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật thuốc", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await medicineService.remove(req.params.id);
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá thuốc", error: err.message });
  }
};
