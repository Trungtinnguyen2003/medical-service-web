// src/pages/Profile/style.js
import styled from "styled-components";

export const Container = styled.div`
  max-width: 720px;
  margin: 40px auto;
  padding: 24px;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
`;

export const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  object-fit: cover;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const SaveButton = styled.button`
  background-color: #ff6b00;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
`;

export const CancelButton = styled.button`
  background-color: #eee;
  color: black;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
`;
