import React, { useState } from "react";
import styled from "styled-components";

const CalendarWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
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

  ${({ disabled }) =>
    disabled &&
    `
      opacity: 0.25;
      pointer-events: none;
    `}

  ${({ active }) =>
    active &&
    `
      font-weight: 700;
      color: #00a6ff;
    `}

  &:hover {
    background: ${({ disabled }) => (disabled ? "transparent" : "#e6f4ff")};
  }
`;

const CalendarPickerDepartment = ({ onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30); // ngày giới hạn 30 ngày

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const firstDay = new Date(year, month, 1).getDay(); // 0 = CN
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rows = [];
  let dayNum = 1 - firstDay;

  for (let i = 0; i < 6; i++) {
    const cells = [];

    for (let j = 0; j < 7; j++) {
      const date = new Date(year, month, dayNum);
      const isCurrentMonth = date.getMonth() === month;

      // kiểm tra điều kiện disable
      const isBeforeToday = date < today;
      const isAfterLimit = date > maxDate;
      const isSunday = date.getDay() === 0; // hide Chủ Nhật
      const isValidRange =
        date >= today && date <= maxDate && !isSunday && isCurrentMonth;

      cells.push(
        <DayCell
          key={j}
          disabled={!isValidRange}
          active={isValidRange}
          onClick={() => {
            if (isValidRange) {
              const iso = date.toLocaleDateString("en-CA");
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

  return (
    <CalendarWrapper>
      <Header>Chọn ngày khám</Header>

      <Nav>
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
          ‹
        </button>
        <span style={{ fontSize: 18, fontWeight: 600 }}>
          THÁNG {month + 1}-{year}
        </span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
          ›
        </button>
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

export default CalendarPickerDepartment;
