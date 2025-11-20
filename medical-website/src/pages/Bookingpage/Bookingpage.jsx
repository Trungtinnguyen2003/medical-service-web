// src/pages/Bookingpage/Bookingpage.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 40px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top left, #e8f3ff 0, #f8fbff 45%, #ffffff 100%);
`;

const Card = styled.div`
  width: 100%;
  max-width: 960px;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 28px 32px;
  box-shadow: 0 18px 45px rgba(15, 35, 95, 0.08);
  border: 1px solid rgba(10, 132, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    padding: 40px 40px 36px;
  }
`;

const Header = styled.div`
  text-align: left;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(10, 132, 255, 0.06);
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
  font-size: 24px;
  margin: 10px 0 4px;
  color: #111827;
  font-weight: 700;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
  max-width: 620px;
  line-height: 1.5;
`;

const SmallNote = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: stretch;
  }
`;

const OptionColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 99, 235, 0.08); /* mặc định */
  font-size: 20px;
  transition: background 0.25s ease;
`;

const OptionCard = styled.button`
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 18px 18px 16px;
  text-align: left;
  cursor: pointer;
  background: #ffffff; /* ➜ mặc định TRẮNG */
  color: #111827;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
  transform: translateY(0);
  transition: all 0.25s ease;

  /* ICON background cũng trắng */
  ${IconCircle} {
    background: rgba(37, 99, 235, 0.08);
  }

  /* Khi hover mới xanh */
  &:hover {
    background: linear-gradient(135deg, #e4f0ff, #d8e9ff); /* xanh nhạt */
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.20);
    transform: translateY(-4px);
  }

  &:hover ${IconCircle} {
    background: rgba(255, 255, 255, 0.4);
  }

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.2), transparent 60%);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover:before {
    opacity: 1;
  }
`;


const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;




const OptionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const OptionDesc = styled.p`
  margin-top: 4px;
  margin-bottom: 2px;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ primary }) => (primary ? "#000000ff" : "#4b5563")};
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const Tag = styled.span`
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid ${({ primary }) => (primary ? "rgba(239, 246, 255, 0.4)" : "#e5e7eb")};
  background: ${({ primary }) =>
    primary ? "rgba(15, 118, 255, 0.3)" : "rgba(249, 250, 251, 0.9)"};
  color: ${({ primary }) => (primary ? "#eff6ff" : "#6b7280")};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
`;

const HelpBox = styled.div`
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 4px;
`;

const HelpIcon = styled.div`
  font-size: 16px;
  margin-top: 1px;
`;

const HelpText = styled.div`
  strong {
    color: #111827;
    font-weight: 600;
  }
`;

const Bookingpage = () => {
  const navigate = useNavigate();

  const goDoctorFlow = () => {
    // Giữ nguyên logic cũ
    navigate("/booking");
  };

  const goDepartmentFlow = () => {
    // Giữ nguyên logic cũ
    navigate("/booking-department?step=department");
  };

  return (
    <PageWrapper >
      <Card style={{ marginTop: "60px" }}>
        <Header>
          <Badge >
            <Dot /> Đặt lịch khám trực tuyến
          </Badge>
          <Title>Chọn cách đặt lịch phù hợp với bạn</Title>
          <Subtitle>
            Bạn có thể đặt lịch theo{" "}
            <strong>bác sĩ cụ thể</strong> hoặc chọn{" "}
            <strong>chuyên khoa</strong> nếu chưa biết nên gặp bác sĩ nào. Hệ
            thống sẽ gợi ý lịch khám phù hợp.
          </Subtitle>
          <SmallNote>* Bạn có thể thay đổi lựa chọn ở các bước tiếp theo.</SmallNote>
        </Header>

        <Content>
          <OptionColumn>
            <OptionCard primary onClick={goDoctorFlow}>
              <OptionHeader>
                <IconCircle primary>🩺</IconCircle>
                <OptionTitle>Đặt theo bác sĩ</OptionTitle>
              </OptionHeader>
              <OptionDesc primary>
                Phù hợp khi bạn đã có bác sĩ theo dõi hoặc được giới thiệu
                trước. Xem lịch trống theo từng bác sĩ và chọn khung giờ cụ thể.
              </OptionDesc>
              <TagRow>
                <Tag primary>Bác sĩ quen</Tag>
                <Tag primary>Theo dõi lâu dài</Tag>
                <Tag primary>Lịch riêng từng bác sĩ</Tag>
              </TagRow>
            </OptionCard>
          </OptionColumn>

          <OptionColumn>
            <OptionCard onClick={goDepartmentFlow}>
              <OptionHeader>
                <IconCircle>🏥</IconCircle>
                <OptionTitle>Đặt theo chuyên khoa</OptionTitle>
              </OptionHeader>
              <OptionDesc>
                Hỗ trợ khi bạn chỉ mới có triệu chứng chung như đau đầu, đau
                ngực, mệt mỏi... Hệ thống sẽ gợi ý chuyên khoa và bác sĩ phù hợp.
              </OptionDesc>
              <TagRow>
                <Tag>Chưa biết chọn bác sĩ</Tag>
                <Tag>Tư vấn chuyên khoa</Tag>
                <Tag>Tối ưu chi phí</Tag>
              </TagRow>
            </OptionCard>
          </OptionColumn>
        </Content>

        <Divider />

        <HelpBox>
          <HelpIcon>💡</HelpIcon>
          <HelpText>
            <strong>Gợi ý:</strong> Nếu đây là lần đầu bạn đặt khám hoặc chưa có bác sĩ
            quen, hãy thử <strong>&quot;Đặt theo chuyên khoa&quot;</strong> để được tư vấn
            lộ trình phù hợp.
          </HelpText>
        </HelpBox>
      </Card>
    </PageWrapper>
  );
};

export default Bookingpage;
