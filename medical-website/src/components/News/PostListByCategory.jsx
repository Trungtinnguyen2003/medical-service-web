import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostCard = styled(motion.div)`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f3f3f3;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Content = styled.div`
  padding: 20px;
`;

const Title = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
`;

const Summary = styled.p`
  font-size: 15px;
  color: #475569;
  margin-bottom: 12px;
  line-height: 1.5;
`;

const ReadMore = styled.span`
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "→";
    margin-left: 6px;
  }
`;

const PostListByCategory = ({ posts = [] }) => {
  const navigate = useNavigate();

  return (
    <Grid>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          onClick={() => navigate(`/posts/${post.slug}`)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          {post.image_url && (
            <ImageWrapper image={`http://localhost:5000${post.image_url}`} />
          )}
          <Content>
            <Title>{post.title}</Title>
            <Summary>{post.summary}</Summary>
            <ReadMore>Xem thêm</ReadMore>
          </Content>
        </PostCard>
      ))}
    </Grid>
  );
};

export default PostListByCategory;
