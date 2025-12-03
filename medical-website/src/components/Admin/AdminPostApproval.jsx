// src/components/Admin/AdminPostApproval.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditPostModal from "./EditPostModal";


// Toast cấu hình


const Wrapper = styled.div`
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ active }) => (active ? "#2563eb" : "#e5e7eb")};
  color: ${({ active }) => (active ? "white" : "black")};
  font-weight: 600;
  cursor: pointer;
`;

const PostItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  background: #f9fafb;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 20px;
`;

const Status = styled.span`
  font-size: 14px;
  color: ${({ status }) =>
    status === "approved"
      ? "green"
      : status === "rejected"
      ? "red"
      : "#f59e0b"};
`;

const ButtonGroup = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  color: white;
  background-color: ${({ type }) =>
    type === "approve"
      ? "#16a34a"
      : type === "reject"
      ? "#dc2626"
      : type === "edit"
      ? "#0ea5e9"
      : "#6b7280"};
`;

const Summary = styled.p`
  font-style: italic;
  margin-top: 8px;
  color: #6b7280;
`;

const Image = styled.img`
  width: 200px;
  border-radius: 8px;
  margin: 10px 0;
`;

const ContentBox = styled.div`
  margin-top: 10px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  max-height: 300px;
  overflow: auto;
`;

const AdminPostApproval = () => {
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("pending");
  const [editingPost, setEditingPost] = useState(null);


  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    const url =
      tab === "pending"
        ? "http://localhost:5000/posts/pending"
        : "http://localhost:5000/posts";
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const filtered =
      tab === "approved"
        ? res.data.filter((p) => p.status === "approved")
        : res.data;
    setPosts(filtered);
  };

  const handleUpdate = async (postId, status) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/posts/${postId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(`✔ Đã cập nhật trạng thái bài viết: ${status}`);
    fetchPosts();
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Bạn có chắc muốn xoá bài viết này không?")) return;
    await axios.delete(`http://localhost:5000/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.info("🗑 Đã xoá bài viết.");
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [tab]);

  return (
    <Wrapper style={{ marginTop: "20px" }} >
      <h2>Quản lý Bài viết</h2>
      <Tabs style={{ marginTop: "10px" }}>
        <TabButton active={tab === "pending"} onClick={() => setTab("pending") }>
          Chờ duyệt
        </TabButton>
        <TabButton active={tab === "approved"} onClick={() => setTab("approved")}>
          Đã duyệt
        </TabButton>
      </Tabs>

      {posts.length === 0 && <p>Không có bài viết nào.</p>}
      {posts.map((post) => (
        <PostItem key={post.id}>
          <Title>{post.title}</Title>
          <p>Chuyên mục: {post.category?.name || "Không rõ"}</p>
          <p>
          <div><strong>Người đăng:</strong> {post.author?.name || "Không rõ"}</div>
          <div><strong>Email:</strong> {post.author?.email || "Không rõ"}</div>

          </p>
          <Summary>{post.summary}</Summary>
          {post.image_url && (
            <Image src={`http://localhost:5000${post.image_url}`} alt="Ảnh bài viết" />
          )}
          <ContentBox dangerouslySetInnerHTML={{ __html: post.content }} />
          <Status status={post.status}>Trạng thái: {post.status}</Status>

          <ButtonGroup>
            {tab === "pending" && (
              <>
                <Button type="approve" onClick={() => handleUpdate(post.id, "approved")}>
                  Duyệt
                </Button>
                <Button type="reject" onClick={() => handleUpdate(post.id, "rejected")}>
                  Từ chối
                </Button>
              </>
            )}
            {tab === "approved" && (
              <>
                <Button type="edit" onClick={() => setEditingPost(post)}>
  Sửa
</Button>

                <Button type="reject" onClick={() => handleDelete(post.id)}>
                  Xoá
                </Button>
              </>
            )}
          </ButtonGroup>
        </PostItem>
      ))}
      {editingPost && (
  <EditPostModal
    post={editingPost}
    onClose={() => setEditingPost(null)}
    onUpdated={fetchPosts}
  />
)}

    </Wrapper>
    
  );
};

export default AdminPostApproval;
