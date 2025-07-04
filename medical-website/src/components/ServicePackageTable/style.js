import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin: 20px 0;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

export const Th = styled.th`
  background-color: #1976d2;
  color: white;
  padding: 12px;
  text-align: center;
  border: 1px solid #ccc;
`;

export const Td = styled.td`
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: #fff;
`;
