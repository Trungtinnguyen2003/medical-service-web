import styled from "styled-components";

/* PAGE */
export const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 120px auto 80px auto;
  padding: 0 24px;
`;

/* HEADER */
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 40px;
  border-radius: 32px;
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 40%, #e9e7ff 100%);
  border: 1px solid rgba(180, 190, 255, 0.5);
  box-shadow: 0 20px 50px rgba(70, 60, 180, 0.12);
  position: relative;
`;

export const AvatarWrapper = styled.div`
  padding: 6px;
  border-radius: 28px;
  background: linear-gradient(135deg, #7dd3fc, #818cf8, #c084fc);
  box-shadow: 0 12px 45px rgba(99, 102, 241, 0.35);
`;

export const Avatar = styled.img`
  width: 170px;
  height: 200px;
  object-fit: cover;
  border-radius: 22px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DoctorName = styled.h1`
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(90deg, #1e293b, #334155);
  background-clip: text;
  color: transparent;
`;

export const DoctorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 15px;
`;

/* ACTION BUTTON */
export const ActionButton = styled.button`
  margin-top: 10px;
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 35px rgba(124, 58, 237, 0.35);
  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(99, 102, 241, 0.45);
  }
`;

/* CARD */
export const GradientCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  padding: 28px;
  border-radius: 24px;
  margin-top: 30px;
  box-shadow: 0 15px 40px rgba(30, 41, 59, 0.08);
  border: 1px solid rgba(203, 213, 225, 0.5);
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 14px;
`;

export const SectionBody = styled.div`
  font-size: 15px;
  color: #475569;
  line-height: 1.7;
  margin-top: 6px;
  white-space: pre-line; /* ⭐ GIỮ XUỐNG DÒNG + BULLET */
`;

/* SERVICE GROUP */
export const ServiceGroup = styled.div`
  margin-bottom: 20px;

  h4 {
    color: #4338ca;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 6px;
  }
`;

export const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  font-size: 14.5px;
  color: #334155;
`;

/* RELATED DOCTORS */
export const RelatedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
`;

export const RelatedDoctorCard = styled.div`
  width: 220px;
  padding: 16px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(203, 213, 225, 0.7);
  box-shadow: 0 15px 35px rgba(30, 41, 59, 0.1);
  transition: 0.25s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 22px 45px rgba(79, 70, 229, 0.25);
  }

  .avatar {
    width: 100%;
    height: 210px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 12px;
  }

  h4 {
    font-size: 16.5px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  p {
    font-size: 13.5px;
    color: #64748b;
    margin-bottom: 10px;
  }

  button {
    width: 100%;
    padding: 8px 0;
    border-radius: 12px;
    border: none;
    background: #0f172a;
    color: white;
    margin-bottom: 6px;
    cursor: pointer;
    font-size: 13.5px;

    &.book {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      box-shadow: 0 12px 25px rgba(124, 58, 237, 0.3);
    }
  }
`;
