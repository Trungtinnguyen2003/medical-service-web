import React, { useEffect, useState } from "react";
import departmentService from "../../services/departmentService";
import axios from "axios";
import ConsultationBanner from "../../components/ConsultationBanner/ConsultationBanner";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTags, FaChevronDown, FaComments } from "react-icons/fa";

const ConsultationPage = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [selectedDept, setSelectedDept] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    department_id: "",
    doctor_id: "",
  });
  const navigate = useNavigate();

  // ✅ Hàm fix URL ảnh bác sĩ (cải tiến để xử lý mọi trường hợp)
  // ✅ Hàm fix URL ảnh bác sĩ (chuẩn hóa tuyệt đối)
const fixDoctorAvatar = (avatar) => {
  if (!avatar || avatar.trim() === "") {
    return "https://placehold.co/80x80/png?text=BS&font=raleway"; // Ảnh mặc định nếu thiếu
  }

  let fixed = avatar;

  // 🩺 Xử lý mọi trường hợp dư prefix
  fixed = fixed
    .replace(/^http:\/\/localhost:5000/, "") // Bỏ domain nếu có
    .replace(/\/doctors\//g, "/") // Xóa /doctors/ dư
    .replace(/\/uploads\/uploads/g, "/uploads") // Bỏ lặp uploads
    .replace(/.*(\/uploads\/[A-Za-z0-9._-]+\.[A-Za-z0-9]+)/, "$1"); // Giữ lại từ /uploads/... trở đi

  // Nếu chưa có / ở đầu, thêm vào
  if (!fixed.startsWith("/")) fixed = "/" + fixed;

  // Trả về URL hoàn chỉnh
  return `http://localhost:5000${fixed}`;
};


  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    departmentService.getAll().then(setDepartments);
    fetchConsultations();
  }, []);

  const fetchConsultations = async (dept = "all") => {
    try {
      const res = await axios.get("http://localhost:5000/api/consultations/public", {
        params: dept !== "all" ? { department_id: dept } : {},
      });
      setConsultations(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách câu hỏi:", err);
    }
  };

  const handleFilter = (id) => {
    setSelectedDept(id);
    fetchConsultations(id);
  };

  useEffect(() => {
    if (formData.department_id) {
      departmentService.getDoctorsByDepartment(formData.department_id).then(setDoctors);
    } else setDoctors([]);
  }, [formData.department_id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Vui lòng đăng nhập để gửi câu hỏi!");
        navigate("/login");
        return;
      }
      await axios.post("http://localhost:5000/api/consultations", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Gửi câu hỏi thành công!");
      setFormData({ title: "", content: "", department_id: "", doctor_id: "" });
      setDoctors([]);
      fetchConsultations();
    } catch (err) {
      alert("❌ Gửi thất bại, vui lòng thử lại.");
    }
  };

  return (
    <>
      <ConsultationBanner />

      {/* ===== DANH SÁCH CÂU HỎI ===== */}
      <Wrapper>
        <MainContainer>
          <Title>
            <FaComments className="text-purple-600" /> Hỏi - Đáp Cùng Bác Sĩ
          </Title>

          {/* Bộ lọc chuyên khoa */}
          <FilterRow>
            <FilterButton
              active={selectedDept === "all"}
              onClick={() => handleFilter("all")}
            >
              Tất cả
            </FilterButton>
            {departments.map((dept) => (
              <FilterButton
                key={dept.id}
                active={selectedDept === dept.id}
                onClick={() => handleFilter(dept.id)}
              >
                {dept.name}
              </FilterButton>
            ))}
          </FilterRow>

          {/* Danh sách câu hỏi */}
          {consultations.length === 0 ? (
            <EmptyText>Hiện chưa có câu hỏi nào được đăng công khai.</EmptyText>
          ) : (
            <ConsultationList>
              {consultations.map((item) => (
                <ConsultationCard key={item.id}>
                  <QuestionBox>
                    <h3>{item.title}</h3>
                    <p className="author">
                      <FaTags /> {item.patient?.name || "Ẩn danh"} —{" "}
                      {item.department?.name}
                    </p>
                    <p className="content">{item.content}</p>
                    <div className="action">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === item.id ? null : item.id)
                        }
                      >
                        {expandedId === item.id
                          ? "Ẩn câu trả lời"
                          : "Xem câu trả lời"}{" "}
                        <FaChevronDown
                          className={`icon ${
                            expandedId === item.id ? "rotate" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </QuestionBox>

                  {expandedId === item.id && item.answer && (
                    <AnswerBox>
                      {console.log("🩺 Raw Avatar:", item.doctor?.avatar)}
                      {console.log("🩺 Fixed Avatar URL:", fixDoctorAvatar(item.doctor?.avatar))}
                      <DoctorAvatar
                        src={fixDoctorAvatar(item.doctor?.avatar)}
                        alt={item.doctor?.name || "Bác sĩ"}
                        onError={(e) => {
                          e.target.src = "https://placehold.co/80x80/png?text=BS&font=raleway"; // Fallback nếu URL lỗi
                        }}
                      />
                      <div>
                        <h4>
                          {item.doctor?.title || ""} {item.doctor?.name || "Bác sĩ"}
                        </h4>
                        <p className="position">
                          {item.doctor?.position || "Bác sĩ chuyên khoa"}
                        </p>
                        <div
  className="answer-content"
  dangerouslySetInnerHTML={{ __html: item.answer }}
></div>

                      </div>
                    </AnswerBox>
                  )}
                </ConsultationCard>
              ))}
            </ConsultationList>
          )}
        </MainContainer>
      </Wrapper>

      {/* ===== FORM GỬI CÂU HỎI ===== */}
      <Section>
        <FormCard data-aos="zoom-in">
          <SubHeader>Hệ thống tư vấn bệnh nhân</SubHeader>
          <Header>Gửi câu hỏi đến bác sĩ chuyên khoa</Header>

          <form onSubmit={handleSubmit}>
            <InputRow>
              <InputGroup>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề câu hỏi của bạn"
                  required
                />
                <Icon>📧</Icon>
              </InputGroup>
            </InputRow>

            <InputRow>
              <InputGroup>
                <Select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn chuyên khoa</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
                <Icon>🏥</Icon>
              </InputGroup>

              <InputGroup>
                <Select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  disabled={!formData.department_id}
                >
                  <option value="">Gửi cho tất cả bác sĩ trong chuyên khoa</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </Select>
                <Icon>👨‍⚕️</Icon>
              </InputGroup>
            </InputRow>

            <InputRow>
              <InputGroup>
                <TextArea
                  rows={5}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Nhập nội dung chi tiết câu hỏi..."
                  required
                />
                <Icon>📝</Icon>
              </InputGroup>
            </InputRow>

            <Button type="submit">💬 Gửi câu hỏi tư vấn</Button>
          </form>
        </FormCard>
      </Section>
    </>
  );
};

export default ConsultationPage;

// ================= STYLE =================
const Wrapper = styled.div`
  background-color: #f4f9ff;
  padding: 40px 30px;
`;

const MainContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: 800;
  color: #114e92;
  margin-bottom: 30px;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 18px;
  border-radius: 20px;
  border: 2px solid #114e92;
  background-color: ${(props) => (props.active ? "#114e92" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#114e92")};
  font-weight: 600;
  transition: 0.3s;
  &:hover {
    background-color: #114e92;
    color: white;
  }
`;

const ConsultationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ConsultationCard = styled.div`
  background-color: #f0f9ff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const QuestionBox = styled.div`
  padding: 25px;
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #114e92;
    margin-bottom: 10px;
  }
  .author {
    color: #007bff;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .content {
    font-size: 15px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .action button {
    background: none;
    border: none;
    color: #114e92;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .icon {
    transition: transform 0.3s ease;
  }
  .icon.rotate {
    transform: rotate(180deg);
  }
`;

const AnswerBox = styled.div`
  display: flex;
  background: #f8f8f8;
  border-top: 1px solid #d8e2ec;
  padding: 20px;
  gap: 20px;

  h4 {
    font-size: 16px;
    font-weight: bold;
    color: #114e92;
  }

  .position {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }

  .answer-content {
    font-size: 15px;
    color: #333;
    line-height: 1.7;
  }

  /* 👇 Định dạng các thẻ HTML do CKEditor sinh ra */
  .answer-content p {
    margin-bottom: 0.75rem;
  }
  .answer-content strong {
    color: #1e3a8a;
    font-weight: 600;
  }
  .answer-content ul {
    list-style: disc;
    margin-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  .answer-content li {
    margin-bottom: 0.25rem;
  }
  .answer-content img {
    max-width: 100%;
    border-radius: 8px;
    margin-top: 10px;
  }
`;


const DoctorAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #d0d0d0;
`;

const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(128, 0, 128, 0.15);
  padding: 50px 40px;
  width: 100%;
  max-width: 720px;
  text-align: center;
  margin-bottom: 60px;
`;

const Header = styled.h2`
  font-size: 24px;
  color: #4c1d95;
  font-weight: 800;
  margin-bottom: 25px;
`;

const SubHeader = styled.p`
  font-size: 16px;
  color: #6b21a8;
  font-weight: 600;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
`;

const InputGroup = styled.div`
  position: relative;
  flex: 1;
  min-width: 280px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
  transition: 0.3s;
  &:focus {
    border-color: #9333ea;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.15);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border-radius: 10px;
  border: 1px solid #ddd;
  resize: none;
`;

const Button = styled.button`
  width: 100%;
  background-color: #7e22ce;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #6d28d9;
    transform: scale(1.02);
  }
`;

const Icon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #9333ea;
`;

const EmptyText = styled.p`
  text-align: center;
  color: #666;
  font-size: 16px;
  font-style: italic;
  margin-top: 40px;
`;

