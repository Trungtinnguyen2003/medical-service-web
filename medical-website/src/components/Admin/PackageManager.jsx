import React, { useEffect, useState } from "react"; 
import axios from "axios";
import servicePackageService from "../../services/servicePackageService";
import serviceService from "../../services/serviceService";

const initialPackage = {
  name: "",
  slug: "",
  description: "",
  detail: "",
  benefits: "",
  precautions: "",
  image_url: "",
  services: [],
  price_json: {},
};

const GENDER_GROUPS = [
  { key: "f_u60", label: "Nữ độc thân <60" },
  { key: "f_60", label: "Nữ độc thân >60" },
  { key: "fm_u60", label: "Nữ có gia đình <60" },
  { key: "fm_60", label: "Nữ có gia đình >60" },
  { key: "m_u60", label: "Nam <60" },
  { key: "m_60", label: "Nam >60" },
];

const ServicePackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState(initialPackage);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchPackages();
    fetchServices();
  }, []);

  const fetchPackages = async () => {
    const res = await servicePackageService.getAll();
    setPackages(res);
  };

  const fetchServices = async () => {
    const res = await serviceService.getAllServices();
    setServices(res);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const toggleService = (id) => {
    const exists = formData.services.find((s) => s.serviceId === id);
    if (exists) {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s.serviceId !== id),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, { serviceId: id, appliesTo: [] }],
      }));
    }
  };

  const toggleAppliesTo = (serviceId, groupKey) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.serviceId === serviceId
          ? {
              ...s,
              appliesTo: s.appliesTo.includes(groupKey)
                ? s.appliesTo.filter((g) => g !== groupKey)
                : [...s.appliesTo, groupKey],
            }
          : s
      ),
    }));
  };

  const getServiceChecked = (id) => {
    return formData.services.some((s) => s.serviceId === id);
  };

  const getAppliesTo = (id) => {
    const s = formData.services.find((s) => s.serviceId === id);
    return Array.isArray(s?.appliesTo) ? s.appliesTo : [];
  };

  const handleSubmit = async () => {
    let imageUrl = formData.image_url;
    if (imageFile) {
      const imgForm = new FormData();
      imgForm.append("avatar", imageFile);
      const res = await axios.post("http://localhost:5000/api/upload/image", imgForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      imageUrl = res.data.url;
    }

    const price_json = {};
    GENDER_GROUPS.forEach(({ key }) => {
      let total = 0;
      formData.services.forEach((s) => {
        const fullService = services.find((fs) => fs.id === s.serviceId);
        const servicePrice = Number(fullService?.price) || 0;
        if (s.appliesTo?.includes(key)) {
          total += servicePrice;
        }
      });
      price_json[key] = total;
    });

    const payload = { ...formData, image_url: imageUrl, price_json };

    try {
      if (editingId) {
        await servicePackageService.update(editingId, payload);
        await servicePackageService.assignServices(editingId, formData.services);
        alert("Cập nhật thành công");
      } else {
        const res = await servicePackageService.create(payload);
        await servicePackageService.assignServices(res.package.id, formData.services);
        alert("Thêm gói mới thành công");
      }
      setShowForm(false);
      setFormData(initialPackage);
      setEditingId(null);
      fetchPackages();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleEdit = (pkg) => {
    const attachedServices = pkg.services?.map((s) => ({
      serviceId: s.id,
      appliesTo: (() => {
        try {
          const raw = s.package_service?.appliesTo;
          return Array.isArray(raw) ? raw : JSON.parse(raw);
        } catch {
          return [];
        }
        console.log("🔍 pkg.services:", pkg.services);
      })(),
    })) || [];

    setFormData({ ...pkg, services: attachedServices });
    setEditingId(pkg.id);
    setShowForm(true);
    setImagePreview(`http://localhost:5000${pkg.image_url}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá gói này?")) {
      await servicePackageService.remove(id);
      fetchPackages();
    }
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div style={{ padding: 40 }}>
      <h2>Quản lý Gói Dịch vụ</h2>
      <button onClick={() => setShowForm(true)}>➕ Thêm gói dịch vụ</button>

      {showForm && (
        <div style={{ marginTop: 20, padding: 20, border: "1px solid #ccc" }}>
          <h3>{editingId ? "🛠 Sửa gói dịch vụ" : "➕ Thêm gói mới"}</h3>

          {["name", "slug", "description", "detail", "benefits", "precautions"].map((field) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label style={{ width: 140, display: "inline-block" }}>{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                style={{ width: "60%" }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 10 }}>
            <label style={{ width: 140, display: "inline-block" }}>Ảnh đại diện</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div style={{ marginTop: 10 }}>
                <img src={imagePreview} alt="preview" width={120} />
              </div>
            )}
          </div>

          <h4>Giá cho từng nhóm (tự động tính):</h4>
          <ul>
            {GENDER_GROUPS.map(({ key, label }) => (
              <li key={key}>
                {label}: <strong>{formData.price_json[key]?.toLocaleString() || 0}đ</strong>
              </li>
            ))}
          </ul>

          <h4>Dịch vụ đi kèm:</h4>

          <input
            type="text"
            placeholder="🔍 Tìm kiếm dịch vụ..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: "60%", padding: 6, marginBottom: 10 }}
          />

          {filteredServices.map((s) => (
            <div key={s.id} style={{ marginBottom: 10 }}>
              <label>
                <input
                  type="checkbox"
                  checked={getServiceChecked(s.id)}
                  onChange={() => toggleService(s.id)}
                />
                {s.title}
              </label>

              {getServiceChecked(s.id) && (
                <div style={{ marginLeft: 30 }}>
                  {GENDER_GROUPS.map(({ key, label }) => (
                    <label key={key} style={{ marginRight: 10 }}>
                      <input
                        type="checkbox"
                        checked={getAppliesTo(s.id).includes(key)}
                        onChange={() => toggleAppliesTo(s.id, key)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button onClick={handleSubmit}>💾 Lưu</button>
          <button onClick={() => setShowForm(false)} style={{ marginLeft: 10 }}>
            Huỷ
          </button>
        </div>
      )}

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 30 }}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Slug</th>
            <th>Ảnh</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.slug}</td>
              <td>
                {p.image_url && (
                  <img src={`http://localhost:5000${p.image_url}`} alt="ảnh" width="80" />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(p)}>Sửa</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 10 }}>
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicePackageManager;