import React, { useState } from "react";
import {
  Section,
  Background,
  FormCard,
  SubHeader,
  Header,
  InputRow,
  InputGroup,
  Input,
  Select,
  Button,
  Icon
} from "./style";
import ServiceBookingForm from "./ServiceBookingForm";
import PackageBookingForm from "./PackageBookingForm";
import styled from "styled-components";
import bgImage from "../../assets/images/11.jpg";

const TabGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  gap: 8px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#3b82f6" : "#e2e8f0")};
  color: ${({ active }) => (active ? "#fff" : "#0f172a")};
`;

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState("service");

  return (
    <Section>
      <Background style={{ backgroundImage: `url(${bgImage})` }}>
        <FormCard>
          {/* Tabs trong form */}
          <TabGroup>
            <TabButton active={activeTab === "service"} onClick={() => setActiveTab("service")}>
              Đặt Dịch Vụ
            </TabButton>
            <TabButton active={activeTab === "package"} onClick={() => setActiveTab("package")}>
              Đặt Gói Dịch Vụ
            </TabButton>
          </TabGroup>

          {/* Nội dung tương ứng */}
          {activeTab === "service" ? <ServiceBookingForm /> : <PackageBookingForm />}
        </FormCard>
      </Background>
    </Section>
  );
};

export default BookingTabs;
