import React from "react";
import BookingBanner from "../../components/BookingBanner/BookingBanner";
import BookingTabs from "../../components/Booking/BookingTabs";
import styled from "styled-components";
import FAQSection from "../../components/FAQSection/FAQSection";
import { TestimonialCard } from "../../components/TestimonialSection/style";
import TestimonialSection from "../../components/TestimonialSection/TestimonialSection";

const PageWrapper = styled.div`
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const NoteBox = styled.div`
  background: #fff3cd;
  border-left: 6px solid #ffc107;
  border-radius: 12px;
  padding: 24px 20px;
  max-width: 360px;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px; /* ✅ khoảng cách so với top khi cuộn */
  align-self: flex-start;
  height: fit-content;
`;


const NoteTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  color: #c87c00;
`;

const NoteList = styled.ul`
  padding-left: 20px;
  list-style: disc;
  font-size: 15px;
  color: #333;
  line-height: 1.7;
`;

const Bookingpage = () => {
  return (
    <div>
      <BookingBanner />
      <PageWrapper>
        {/* ✅ Box lưu ý */}
        <NoteBox>
          <NoteTitle>Lưu ý khi đặt lịch khám</NoteTitle>
          <NoteList>
            <li>Vui lòng cung cấp thông tin chính xác để thuận tiện liên hệ xác nhận.</li>
            <li>Chọn đúng chuyên khoa để được hỗ trợ tốt nhất.</li>
            <li>Nếu không rõ bác sĩ cụ thể, bạn có thể để hệ thống chọn tự động.</li>
            <li>Thời gian khám thực tế có thể thay đổi tuỳ theo tình trạng bệnh nhân.</li>
            <li>Vui lòng đến sớm ít nhất 15 phút trước giờ hẹn.</li>
            <li>Sau khi đặt lịch, bạn sẽ nhận được cuộc gọi xác nhận từ nhân viên.</li>
            <li>Hệ thống không hỗ trợ đặt lịch trong ngày, vui lòng chọn ngày sau hôm nay.</li>
            <li>Đối với gói dịch vụ, cần mang theo giấy tờ tùy thân và bảo hiểm (nếu có).</li>
            <li>Nếu cần thay đổi lịch, hãy gọi tổng đài ít nhất 4 giờ trước giờ khám.</li>
            <li>Tất cả thông tin sẽ được bảo mật tuyệt đối theo chính sách bảo mật.</li>
          </NoteList>
        </NoteBox>

        {/* ✅ Tabs đặt lịch */}
        <div style={{ flex: 2, minWidth: 400 }}>
          <BookingTabs />
        </div>
      </PageWrapper>
      <FAQSection />
        <TestimonialSection />
    </div>
  );
};

export default Bookingpage;
