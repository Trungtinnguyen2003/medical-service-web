import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import CategoryBanner from "../../components/News/CategoryBanner";
import FAQSection from "../../components/FAQSection/FAQSection";
import PostListByCategory from "../../components/News/PostListByCategory";

const Wrapper = styled.div`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  filter: blur(2px);
  transition: filter 0.4s ease;

  &:loaded {
    filter: none;
  }
`;

const PostContent = styled.div`
  padding: 20px;
`;

const PostTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
`;

const PostSummary = styled.p`
  font-size: 15px;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const ReadMore = styled.span`
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "→";
    font-size: 13px;
    margin-left: 6px;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #777;
`;

const CategoryBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resCat, resPosts] = await Promise.all([
          axios.get(`http://localhost:5000/post-categories/slug/${slug}`),
          axios.get(`http://localhost:5000/posts/by-category/${slug}`),
        ]);
        setCategory(resCat.data);
        setPosts(resPosts.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải bài viết hoặc danh mục:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const handleClick = (slug) => {
    navigate(`/posts/${slug}`);
  };

  return (
    <>
      <CategoryBanner
        title={category?.name || "Bài viết trong danh mục"}
        description={
          category?.description ||
          "Khám phá những tin tức, chia sẻ, kiến thức từ các chuyên gia."
        }
      />

      <Wrapper>
        {loading ? (
          <Loading>Đang tải bài viết...</Loading>
        ) : (
          <PostListByCategory posts={posts} />
        )}
      </Wrapper>

      <FAQSection />
    </>
  );
};

export default CategoryBlog;
