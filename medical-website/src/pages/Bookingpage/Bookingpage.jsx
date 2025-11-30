import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ===========================================================
   WRAPPER
=========================================================== */
const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 60px 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(
    135deg,
    #eef6ff 0%,
    #f8fbff 40%,
    #ffffff 100%
  );
`;

/* ===========================================================
   MAIN CARD
=========================================================== */
const Card = styled.div`
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 28px;
  padding: 40px 50px;
  box-shadow: 0 20px 50px rgba(15, 40, 85, 0.12);
  border: 1px solid rgba(10, 132, 255, 0.08);

  display: flex;
  flex-direction: column;
  gap: 28px;

  @media (max-width: 768px) {
    padding: 32px 22px;
  }
`;

const Header = styled.div`
  text-align: left;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 4px 14px;
  border-radius: 999px;

  background: rgba(10, 132, 255, 0.08);
  border: 1px solid rgba(10, 132, 255, 0.1);

  color: #0a84ff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a84ff;
`;

const Title = styled.h2`
  font-size: 28px;
  margin-top: 16px;
  color: #111827;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  color: #55627a;
  font-size: 15px;
  max-width: 620px;
  line-height: 1.6;
`;

const SmallNote = styled.p`
  margin-top: 2px;
  font-size: 12px;
  color: #9ca3af;
`;

/* ===========================================================
   CONTENT: 2 OPTION BOXES
=========================================================== */
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 820px) {
    flex-direction: row;
    gap: 26px;
  }
`;

const OptionColumn = styled.div`
  flex: 1;
  display: flex;
`;

const IconCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 115, 230, 0.12);
  font-size: 22px;
`;

const OptionCard = styled.button`
  width: 100%;
  border: none;
  border-radius: 18px;

  padding: 22px 20px 20px;
  text-align: left;
  cursor: pointer;
  background: #ffffff;

  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;

  box-shadow: 0 6px 18px rgba(20, 35, 75, 0.08);

  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, #e8f1ff, #dbe8ff);
    box-shadow: 0 12px 28px rgba(20, 35, 75, 0.18);
    transform: translateY(-4px);
  }
`;

const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const OptionTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
`;

const OptionDesc = styled.p`
  margin-top: 4px;
  margin-bottom: 2px;
  font-size: 14px;
  line-height: 1.55;
  color: #475569;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: rgba(248, 249, 250, 0.9);
  color: #6b7280;
`;

/* ===========================================================
   DIVIDER + HELP BOX
=========================================================== */
const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
`;

const HelpBox = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HelpIcon = styled.div`
  font-size: 18px;
`;

/* ===========================================================
   MAIN COMPONENT
=========================================================== */
const Bookingpage = () => {
  const navigate = useNavigate();

  const goDoctorFlow = () => navigate("/booking");
  const goDepartmentFlow = () =>
    navigate("/booking-department?step=department");

  return (
    <PageWrapper >
      <Card style={{ marginTop: "30px" }}>
        <Header>
          <Badge>
            <Dot /> Đặt lịch khám trực tuyến
          </Badge>

          <Title>Chọn cách đặt lịch phù hợp với bạn</Title>

          <Subtitle>
            Hệ thống hỗ trợ đặt lịch thông minh: theo <strong>bác sĩ</strong> hoặc
            theo <strong>chuyên khoa</strong>.  
          </Subtitle>

          <SmallNote>* Bạn có thể thay đổi lựa chọn ở bước tiếp theo.</SmallNote>
        </Header>

        <Content>
          {/* ===== 1. Bác sĩ ===== */}
          <OptionColumn>
            <OptionCard onClick={goDoctorFlow}>
              <OptionHeader>
                <IconCircle>🩺</IconCircle>
                <OptionTitle>Đặt theo bác sĩ</OptionTitle>
              </OptionHeader>

              <OptionDesc>
                Phù hợp khi bạn muốn khám đúng bác sĩ quen hoặc được giới thiệu.
              </OptionDesc>

              <TagRow>
                <Tag>Bác sĩ quen</Tag>
                <Tag>Lịch riêng từng bác sĩ</Tag>
                <Tag>Theo dõi dài hạn</Tag>
              </TagRow>
            </OptionCard>
          </OptionColumn>

          {/* ===== 2. Chuyên khoa ===== */}
          <OptionColumn>
            <OptionCard onClick={goDepartmentFlow}>
              <OptionHeader>
                <IconCircle>🏥</IconCircle>
                <OptionTitle>Đặt theo chuyên khoa</OptionTitle>
              </OptionHeader>

              <OptionDesc>
                Hệ thống tự động gợi ý bác sĩ phù hợp dựa trên chuyên khoa bạn chọn.
              </OptionDesc>

              <TagRow>
                <Tag>Chưa biết bác sĩ</Tag>
                <Tag>Tư vấn chuyên khoa</Tag>
                <Tag>Tối ưu chi phí</Tag>
              </TagRow>
            </OptionCard>
          </OptionColumn>
        </Content>

        <Divider />

        <HelpBox>
          <HelpIcon>💡</HelpIcon>
          Nếu bạn chưa rõ nên khám bác sĩ nào, hệ thống khuyến nghị chọn{" "}
          <strong>Đặt theo chuyên khoa</strong>.
        </HelpBox>
      </Card>
    </PageWrapper>
  );
};

export default Bookingpage;
