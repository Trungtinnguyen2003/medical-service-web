import React, { useEffect, useState } from "react";
import clinicRoomService from "../../services/clinicRoomService";
import doctorService from "../../services/doctorService";
import departmentService from "../../services/departmentService";

// ===================== STYLE TRONG 1 FILE =====================
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    background: "#f1f1f1",
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    marginRight: "6px",
    cursor: "pointer",
  },
  addBtn: {
    background: "#28a745",
    color: "white",
  },
  editBtn: {
    background: "#ffc107",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "white",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "20px",
    width: "450px",
    borderRadius: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  saveBtn: {
    background: "#007bff",
    color: "white",
    padding: "8px 16px",
  },
  cancelBtn: {
    background: "gray",
    color: "white",
    padding: "8px 16px",
  },
};

// ===================== COMPONENT =====================
const ClinicRoomManager = () => {
  const [rooms, setRooms] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [doctorList, setDoctorList] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    department_id: "",
    floor: "",
    location: "",
  });

  const [selectedDoctor, setSelectedDoctor] = useState("");

  // ===================== LOAD DATA =====================
  useEffect(() => {
    loadRooms();
    loadDepartments();
  }, []);

  const loadRooms = async () => {
    const data = await clinicRoomService.getAll();
      console.log("ROOM DATA:", data);   // ⚠️ Thêm dòng này
    setRooms(data);
  };

  const loadDepartments = async () => {
    const data = await departmentService.getAll();
    setDepartments(data);
  };

  const loadDoctorsByDepartment = async (depId) => {
    const data = await doctorService.getByDepartment(depId);

    setDoctorList(data);
  };

  // ===================== CRUD FORM =====================
  const openCreate = () => {
    setEditingRoom(null);
    setForm({
      name: "",
      code: "",
      department_id: "",
      floor: "",
      location: "",
    });
    setDoctorList([]);
    setSelectedDoctor("");
    setModalOpen(true);
  };

  const openEdit = async (room) => {
  setEditingRoom(room);

  setForm({
    name: room.name,
    code: room.code,
    department_id: room.department_id,
    floor: room.floor,
    location: room.location,
  });

  // 🔥 1. Load bác sĩ thuộc chuyên khoa
  if (room.department_id) {
    const data = await doctorService.getByDepartment(room.department_id);
    setDoctorList(data);
  } else {
    setDoctorList([]);
  }

  // 🔥 2. Set bác sĩ đang được gán vào phòng (nếu có)
  if (room.clinicDoctors && room.clinicDoctors.length > 0) {
    setSelectedDoctor(room.clinicDoctors[0].id);
  } else {
    setSelectedDoctor("");
  }

  setModalOpen(true);
};


  const handleChangeDepartment = async (depId) => {
    setForm({ ...form, department_id: depId });
    if (depId) {
      const data = await doctorService.getByDepartment(depId);

      setDoctorList(data);
    } else {
      setDoctorList([]);
    }
    setSelectedDoctor("");
  };

  const submitForm = async () => {
    let createdRoom = null;

    if (editingRoom) {
      createdRoom = await clinicRoomService.update(editingRoom.id, form);
    } else {
      createdRoom = await clinicRoomService.create(form);
    }

    // Nếu chọn bác sĩ → gán phòng khám
    if (selectedDoctor) {
      await clinicRoomService.assignDoctor(
        selectedDoctor,
        createdRoom?.room?.id || editingRoom?.id
      );
    }

    setModalOpen(false);
    loadRooms();
  };

  // ===================== DELETE =====================
  const deleteRoom = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá phòng này?")) return;
    await clinicRoomService.delete(id);
    loadRooms();
  };

  // ===================== RENDER =====================
  return (
    <div style={styles.container}>
      <h2>Quản lý Phòng Khám</h2>

      <button style={{ ...styles.button, ...styles.addBtn }} onClick={openCreate}>
        + Thêm phòng khám
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Tên phòng</th>
            <th style={styles.th}>Mã</th>
            <th style={styles.th}>Chuyên khoa</th>
            <th style={styles.th}>Tầng</th>
            <th style={styles.th}>Bác sĩ</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td style={styles.td}>{room.id}</td>
              <td style={styles.td}>{room.name}</td>
              <td style={styles.td}>{room.code}</td>
              <td style={styles.td}>{room.clinicDepartment?.name || "-"}</td>
              <td style={styles.td}>{room.floor}</td>
              <td style={styles.td}>
                {room.clinicDoctors?.length
                  ? room.clinicDoctors.map((d) => d.name).join(", ")
                  : "Chưa có"}
              </td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.button, ...styles.editBtn }}
                  onClick={() => openEdit(room)}
                >
                  Sửa
                </button>

                <button
                  style={{ ...styles.button, ...styles.deleteBtn }}
                  onClick={() => deleteRoom(room.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== MODAL TẠO / SỬA ===================== */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{editingRoom ? "Sửa phòng khám" : "Thêm phòng khám"}</h3>

            <input
              style={styles.input}
              placeholder="Tên phòng khám"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="Mã phòng (VD: P012)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />

            {/* Chọn chuyên khoa */}
            <select
              style={styles.input}
              value={form.department_id}
              onChange={(e) => handleChangeDepartment(e.target.value)}
            >
              <option value="">-- Chọn chuyên khoa --</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>

            {/* Chọn bác sĩ */}
            <select
              style={styles.input}
              value={selectedDoctor}
              disabled={doctorList.length === 0}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctorList.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>

            <input
              style={styles.input}
              placeholder="Tầng"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
            />

            <textarea
              style={styles.input}
              placeholder="Ghi chú / vị trí phòng"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <div style={styles.modalActions}>
              <button style={styles.saveBtn} onClick={submitForm}>
                Lưu
              </button>
              <button style={styles.cancelBtn} onClick={() => setModalOpen(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicRoomManager;
