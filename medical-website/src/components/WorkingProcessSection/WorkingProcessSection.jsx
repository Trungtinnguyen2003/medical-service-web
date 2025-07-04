import React from 'react';
import { motion } from 'framer-motion';
import {
  Section,
  Subtitle,
  Title,
  StepsWrapper,
  StepCard,
  StepNumber,
  StepImage,
  StepTitle,
  StepDesc
} from './WorkingProcessStyle';

import img1 from '../../assets/images/9.jpg';
import img2 from '../../assets/images/12.jpg';
import img3 from '../../assets/images/13.jpg';
import img4 from '../../assets/images/14.jpg';

const steps = [
  {
    number: '01',
    title: 'Chọn bác sĩ chuyên khoa',
    desc: 'Chúng tôi giúp bạn chọn đúng chuyên gia.',
    img: img1
  },
  {
    number: '02',
    title: 'Đặt lịch hẹn',
    desc: 'Linh hoạt và nhanh chóng, chỉ vài bước.',
    img: img2
  },
  {
    number: '03',
    title: 'Tư vấn chuyên sâu',
    desc: 'Bác sĩ sẽ tư vấn kỹ lưỡng tình trạng bạn.',
    img: img3
  },
  {
    number: '04',
    title: 'Chăm sóc & phục hồi',
    desc: 'Nhận sự quan tâm toàn diện từ đội ngũ.',
    img: img4
  }
];

const WorkingProcessSection = () => {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Subtitle>Quy trình làm việc</Subtitle>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Title>Quy trình chăm sóc y tế của chúng tôi</Title>
      </motion.div>

      <StepsWrapper>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.2
            }}
            viewport={{ once: true }}
          >
            <StepCard>
              <StepNumber>{step.number}</StepNumber>
              <StepImage src={step.img} alt={step.title} />
              <StepTitle>{step.title}</StepTitle>
              <StepDesc>{step.desc}</StepDesc>
            </StepCard>
          </motion.div>
        ))}
      </StepsWrapper>
    </Section>
  );
};

export default WorkingProcessSection;
