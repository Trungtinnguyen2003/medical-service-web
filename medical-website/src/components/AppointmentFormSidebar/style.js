import styled from "styled-components";

export const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  max-height: 90vh;
  overflow-y: auto;
  max-width: 360px; /* 👈 nhỏ lại chiều rộng */
  margin: 0 auto; /* 👈 canh giữa nếu dùng trong container lớn */

  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const Title = styled.h3`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #0f172a;
  text-align: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 10px; /* 👈 nhỏ padding */
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px; /* 👈 nhỏ chữ */
  box-sizing: border-box;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  appearance: auto;
  box-sizing: border-box;
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #2563eb;
  }
`;
