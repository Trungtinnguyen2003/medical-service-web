const db = require("../models");
const Prescription = db.Prescription;
const PrescriptionItem = db.PrescriptionItem;
const Medicine = db.Medicine;

exports.createPrescription = async (req, res) => {
  const { appointment_id, note, items } = req.body;
  try {
    console.log("🧾 Dữ liệu nhận:", req.body);
    const prescription = await Prescription.create({
      appointment_id,
      doctor_id: req.user.id,
      note,
    });

    // Lưu từng thuốc trong toa
    for (const item of items) {
      await PrescriptionItem.create({
        prescription_id: prescription.id,
        medicine_id: item.medicine_id,
        dosage: item.dosage,
        quantity: item.quantity,
        frequency: item.frequency,
        duration: item.duration,
        note: item.note,
      });

      // Trừ kho
      const med = await Medicine.findByPk(item.medicine_id);
      if (med) {
        med.stock = Math.max(0, med.stock - item.quantity);
        await med.save();
      }
    }

    res.json({
      message: "Kê toa thành công",
      prescription_id: prescription.id,
    });
  } catch (err) {
    console.error("❌ Lỗi tạo toa:", err);
    res.status(500).json({ message: "Lỗi khi kê toa", error: err.message });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const data = await Prescription.findByPk(req.params.id, {
      include: [{ model: PrescriptionItem, as: "items", include: [Medicine] }],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy toa thuốc", error: err.message });
  }
};

// Lấy toa thuốc theo appointment_id
exports.getByAppointment = async (req, res) => {
  try {
    const prescription = await db.Prescription.findOne({
      where: { appointment_id: req.params.appointment_id },
      include: [
        {
          model: db.PrescriptionItem,
          as: "items",
          include: [db.Medicine],
        },
      ],
    });
    if (!prescription)
      return res.status(404).json({ message: "Không có toa thuốc" });
    res.json(prescription);
  } catch (err) {
    console.error("❌ Lỗi lấy toa:", err);
    res.status(500).json({ message: "Lỗi lấy toa thuốc", error: err.message });
  }
};
