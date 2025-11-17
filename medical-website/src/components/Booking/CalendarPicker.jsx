import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isSameDay, parseISO } from "date-fns";

const CalendarWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
    display: block;   
`;

const Header = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #00a6ff;
  margin-bottom: 15px;
`;

const Nav = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;

  button {
    border: none;
    background: none;
    font-size: 22px;
    cursor: pointer;
    color: #007bff;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;

  th {
    padding: 10px 0;
    font-weight: 700;
    color: #777;
  }
`;

const DayCell = styled.td`
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.2s;

  ${({ isPast }) => isPast && `opacity: 0.25; pointer-events: none;`}
  ${({ inactive }) => inactive && `opacity: 0.3;`}
  ${({ active }) =>
    active &&
    `
    color: #007bff;
    font-weight: 700;
  `}

  &:hover {
    background: ${({ active }) => (active ? "#e6f4ff" : "transparent")};
  }
`;

const CalendarPicker = ({ doctorId, onSelectDate }) => {
  const [availableDays, setAvailableDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch ngày bác sĩ có lịch
  useEffect(() => {
    if (!doctorId) return;
    fetch(`http://localhost:5000/doctors/${doctorId}/available-days`)
      .then((res) => res.json())
      .then((data) =>
        setAvailableDays(data.map((d) => parseISO(d)))
      )
      .catch((err) => console.log("❌ Error:", err));
  }, [doctorId]);

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

 // JS: 0 = CN, 1 = Hai, ...
let firstDay = new Date(year, month, 1).getDay();

// Giữ Chủ Nhật = 0 (đúng với cột "CN" ở lịch FE)
const startDay = firstDay; 

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Tạo grid 6 hàng x 7 cột
  const rows = [];
 let dayNum = 1 - startDay;


  for (let i = 0; i < 6; i++) {
    const cells = [];
    for (let j = 0; j < 7; j++) {
      const date = new Date(year, month, dayNum);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const isCurrentMonth = date.getMonth() === month;
      const isAvailable = availableDays.some((d) => isSameDay(d, date));

      cells.push(
        <DayCell
          key={j}
          inactive={!isAvailable || !isCurrentMonth}
          isPast={isPast}
          active={isAvailable && isCurrentMonth && !isPast}
          onClick={() => {
            if (isAvailable && !isPast && isCurrentMonth) {
              const iso = date.toLocaleDateString("en-CA"); // chuẩn YYYY-MM-DD, không lệch giờ

              onSelectDate(iso);
            }
          }}
        >
          {isCurrentMonth ? date.getDate() : ""}
        </DayCell>
      );
      dayNum++;
    }
    rows.push(<tr key={i}>{cells}</tr>);
  }

  const nextMonth = () =>
    setCurrentMonth(new Date(year, month + 1, 1));
  const prevMonth = () =>
    setCurrentMonth(new Date(year, month - 1, 1));

  return (
    <CalendarWrapper>
      <Header>Vui lòng chọn ngày khám</Header>
      <Nav>
        <button onClick={prevMonth}>‹</button>
        <span style={{ fontSize: 18, fontWeight: 600 }}>
          THÁNG {month + 1}-{year}
        </span>
        <button onClick={nextMonth}>›</button>
      </Nav>

      <Table>
        <thead>
          <tr>
            <th>CN</th>
            <th>Hai</th>
            <th>Ba</th>
            <th>Tư</th>
            <th>Năm</th>
            <th>Sáu</th>
            <th>Bảy</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </CalendarWrapper>
  );
};

export default CalendarPicker;
