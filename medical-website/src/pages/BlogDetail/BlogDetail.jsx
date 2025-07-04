import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #2c3e50;
`;

const Meta = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 24px;
`;

const CoverImage = styled.img`
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 30px;
`;

const Content = styled.div`
  font-size: 17px;
  line-height: 1.8;
  color: #444;

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 20px 0;
  }

  h2, h3 {
    margin-top: 24px;
    color: #2c3e50;
  }

  p {
    margin: 16px 0;
  }

  /* ✨ Style bảng đẹp */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
  }

  table, th, td {
    border: 1px solid #ccc;
  }

  th, td {
    padding: 12px;
    text-align: left;
    font-size: 15px;
  }

  table thead {
    background: #f2f2f2;
  }
`;

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get("http://localhost:5000/posts");
        const found = res.data.find(
          (p) => p.slug === slug && p.status === "approved"
        );
        setPost(found);
      } catch (err) {
        console.error("❌ Lỗi khi tải bài viết:", err);
      }
    };

    fetchPost();
  }, [slug]);

  if (!post) return <p style={{ textAlign: "center" }}>Đang tải bài viết...</p>;

  return (
    <Container style={{ marginTop: "100px" }}>
      <Title>{post.title}</Title>
      <Meta>
        {post.author?.name || "Bác sĩ"} -{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </Meta>

      {post.image_url && (
        <CoverImage
          src={`http://localhost:5000${post.image_url}`}
          alt={post.title}
        />
      )}

      <Content dangerouslySetInnerHTML={{ __html: post.content }} />
    </Container>
  );
};

export default BlogDetail;
