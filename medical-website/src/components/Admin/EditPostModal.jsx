import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
  z-index: 1000;
`;


const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Modal = styled.div`
  background: white;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  margin: 5% auto;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;


const Input = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
`;

const ContentScroll = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 10px;
`;

const Select = styled.select`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
`;

const EditPostModal = ({ post, onClose, onUpdated }) => {
  const [form, setForm] = useState({ ...post });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/post-categories").then((res) =>
      setCategories(res.data)
    );
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/posts/${post.id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("✔ Đã cập nhật bài viết");
    onUpdated();
    onClose();
  };

  return (
    <Overlay>
      <Modal>
        <h2>Chỉnh sửa bài viết</h2>
        <ContentScroll>
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề" />
          <Input name="summary" value={form.summary} onChange={handleChange} placeholder="Mô tả ngắn" />
          <Input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Đường dẫn ảnh" />
          <Select name="post_category_id" value={form.post_category_id} onChange={handleChange}>
            <option value="">-- Chọn chuyên mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          <CKEditor
            editor={ClassicEditor}
            data={form.content}
            onChange={(event, editor) =>
              setForm({ ...form, content: editor.getData() })
            }
          />
        </ContentScroll>
        <Footer>
          <Button onClick={handleUpdate}>Cập nhật</Button>
          <Button style={{ background: "#6b7280" }} onClick={onClose}>
            Hủy
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
  
};

export default EditPostModal;
