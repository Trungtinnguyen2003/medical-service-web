import React, { useEffect, useState } from "react";
import clinicRoomService from "../../services/clinicRoomService";
import doctorService from "../../services/doctorService";
import departmentService from "../../services/departmentService";

// ===================== STYLE =====================
const ui = {
  page: {
    padding: 32,
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif"
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 5px 25px rgba(0,0,0,0.05)"
  },
  th: {
    background: "#eef2ff",
    padding: 14,
    textAlign: "left",
    fontWeight: 600,
    color: "#1e293b",
    borderBottom: "1px solid #e2e8f0"
  },
  td: {
    padding: 14,
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
    color: "#334155"
  },
  btnPrimary: {
    background: "#2563eb",
    color: "white",
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600
  },
  btnEdit: {
    background: "#0ea5e9",
    color: "white",
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    marginRight: 8
  },
  btnDelete: {
    background: "#ef4444",
    color: "white",
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99
  },
  modal: {
    background: "#fff",
    padding: 28,
    width: "480px",
    borderRadius: 20,
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#f8fafc"
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#f8fafc"
  },
  saveBtn: {
    background: "#16a34a",
    color: "white",
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600
  },
  cancelBtn: {
    background: "gray",
    color: "white",
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer"
  }
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
    location: ""
  });

  const [selectedDoctor, setSelectedDoctor] = useState("");

  // ===================== LOAD DATA =====================
  useEffect(() => {
    loadRooms();
    loadDepartments();
  }, []);

  const loadRooms = async () => {
    const data = await clinicRoomService.getAll();
    setRooms(data);
  };

  const loadDepartments = async () => {
    const data = await departmentService.getAll();
    setDepartments(data);
  };

  const loadDoctors = async (depId) => {
    const allDoctors = await doctorService.getAllDoctors(); // API có thật
    const filtered = allDoctors.filter((doc) =>
      doc.departments?.some((d) => d.id == depId)
    );
    setDoctorList(filtered);
  };

  // ===================== OPEN CREATE =====================
  const openCreate = () => {
    setEditingRoom(null);
    setForm({
      name: "",
      code: "",
      department_id: "",
      floor: "",
      location: ""
    });
    setDoctorList([]);
    setSelectedDoctor("");
    setModalOpen(true);
  };

  // ===================== OPEN EDIT =====================
  const openEdit = async (room) => {
    setEditingRoom(room);

    setForm({
      name: room.name,
      code: room.code,
      department_id: room.department_id,
      floor: room.floor,
      location: room.location
    });

    if (room.department_id) {
      await loadDoctors(room.department_id);
    }

    if (room.clinicDoctors && room.clinicDoctors.length > 0) {
      setSelectedDoctor(room.clinicDoctors[0].id);
    } else {
      setSelectedDoctor("");
    }

    setModalOpen(true);
  };

  // ===================== ON CHANGE DEPARTMENT =====================
  const handleChangeDepartment = async (depId) => {
    setForm({ ...form, department_id: depId });
    if (depId) await loadDoctors(depId);
    setSelectedDoctor("");
  };

  // ===================== SUBMIT =====================
  const submitForm = async () => {
    let room = null;

    room = editingRoom
      ? await clinicRoomService.update(editingRoom.id, form)
      : await clinicRoomService.create(form);

    const roomId = room?.room?.id || editingRoom?.id;

    if (selectedDoctor) {
      await clinicRoomService.assignDoctor(selectedDoctor, roomId);
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

  return (
    <div style={ui.page}>
      <h2 style={{ marginBottom: 20 }}>🏥 Quản lý Phòng Khám</h2>

      <button style={ui.btnPrimary} onClick={openCreate}>
        + Thêm phòng khám
      </button>

      {/* ===================== TABLE ===================== */}
      <table style={ui.table}>
        <thead>
          <tr>
            <th style={ui.th}>ID</th>
            <th style={ui.th}>Tên phòng</th>
            <th style={ui.th}>Mã</th>
            <th style={ui.th}>Chuyên khoa</th>
            <th style={ui.th}>Tầng</th>
            <th style={ui.th}>Bác sĩ</th>
            <th style={ui.th}>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td style={ui.td}>{room.id}</td>
              <td style={ui.td}>{room.name}</td>
              <td style={ui.td}>{room.code}</td>
              <td style={ui.td}>{room.clinicDepartment?.name || "-"}</td>
              <td style={ui.td}>{room.floor}</td>
              <td style={ui.td}>
                {room.clinicDoctors?.length
                  ? room.clinicDoctors.map((d) => d.name).join(", ")
                  : "Chưa có"}
              </td>
              <td style={ui.td}>
                <button style={ui.btnEdit} onClick={() => openEdit(room)}>
                  Sửa
                </button>
                <button style={ui.btnDelete} onClick={() => deleteRoom(room.id)}>
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===================== MODAL ===================== */}
      {modalOpen && (
        <div style={ui.modalOverlay}>
          <div style={ui.modal}>
            <h3 style={{ marginBottom: 16 }}>
              {editingRoom ? "Sửa phòng khám" : "Thêm phòng khám"}
            </h3>

            <input
              style={ui.input}
              placeholder="Tên phòng khám"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              style={ui.input}
              placeholder="Mã phòng (VD: P012)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />

            {/* Chọn chuyên khoa */}
            <select
              style={ui.select}
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
              style={ui.select}
              disabled={doctorList.length === 0}
              value={selectedDoctor}
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
              style={ui.input}
              placeholder="Tầng"
              value={form.floor}
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
            />

            <textarea
              style={ui.input}
              placeholder="Ghi chú / vị trí phòng"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button style={ui.saveBtn} onClick={submitForm}>
                Lưu
              </button>
              <button style={ui.cancelBtn} onClick={() => setModalOpen(false)}>
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
