import React, { useState } from 'react';
import { Modal, Typography } from 'antd';
import ShortCard from '../../../components/shortcard/shortcard';
import './InternshipTips.css';

const { Title, Paragraph } = Typography;

const InternshipTips = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const shortCardData = [
    {
      title: "Resume Preparation",
      description: "Create a professional resume that showcases skills, academic achievements, and relevant projects to stand out.",
      imageSrc: "https://unchannel.org/images/blog/unchannel-resume-tips.jpg",
      buttonText: "Read More",
      sharedBy: "Mr.Hia Wei Qi",
      focusTitle: "Required and Optional Skills",
      focusDescription: [
        "Highlight relevant skills that match the required and optional skills in the job description.",
        "Tailor your resume to emphasize the skills, projects, or experiences that align with the company's expectations.",
        "Showcase your technical and soft skills in alignment with the scope of work.",
        "Include keywords from the job description to pass Applicant Tracking Systems (ATS).",
      ],
    },
    {
      title: "Interview Readiness",
      description: "Research the company, rehearse common questions, and prepare to explain how you can add value to the organization.",
      imageSrc: "https://jobs.theguardian.com/getasset/7096d9b7-59a6-49a5-904d-a117d3c0c4c6/",
      buttonText: "Read More",
      sharedBy: "Ms.Niana",
      focusTitle: "Scope of Work",
      focusDescription:[
          "Research the job's scope of work and prepare to discuss how your experiences align with the company's needs.",
          "Practice answering behavioral and situational questions that demonstrate your understanding of the role.",
          "Develop clear examples of how you've applied relevant skills in past projects or internships.",
      ],
    },
    {
      title: "Time Management",
      description: "Prioritize tasks effectively to meet deadlines and balance academic responsibilities with internship duties.",
      imageSrc: "https://sertifier.com/blog/wp-content/uploads/2023/10/The-Art-of-Time-Management-Skills.jpg",
      buttonText: "Read More",
      sharedBy: "Ms.Piruntha",
      focusTitle: "Internship Expectations",
      focusDescription: [
        "Show awareness of time management as a key skill to handle multiple responsibilities mentioned in the job description.",
        "Discuss tools or methods you use to manage deadlines effectively, such as calendars, project management tools, or prioritization techniques.",
        ],
      },
    {
      title: "Professional Communication",
      description: "Practice clear and respectful communication in conversations, emails, reports, and team meetings.",
      imageSrc: "https://www.sydle.com/blog/assets/post/improve-communication-62506c4d3bbdd67657964ba5/improve-communication.jpg",
      buttonText: "Read More",
      sharedBy: "Mr.Hia Wei Qi",
      focusTitle: "Collaboration and Soft Skills",
      focusDescription: [
        "Many job descriptions emphasize teamwork and communication.",
        "Highlight your ability to convey ideas clearly and collaborate effectively in diverse teams.",
        "Prepare examples of how you’ve demonstrated professional communication in past experiences (e.g., writing reports, presenting, or handling conflicts)."
      ],
    },
    {
      title: "Skill Enhancement",
      description: "Focus on learning computing tools, software, and methodologies relevant to the industry during the internship.",
      imageSrc: "https://imageio.forbes.com/specials-images/imageserve/630317507c39bc12ccfa8c6c/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
      buttonText: "Read More",
      sharedBy: "Ms.Liana",
      focusTitle: "Growth and Adaptability",
      focusDescription: [
        "Show how you are actively enhancing your skills to meet the required and optional skills listed in the job description.",
        "Discuss certifications, courses, or projects you’ve undertaken to develop competencies relevant to the role.",
        "Highlight your eagerness to learn on the job, which aligns with the company's expectations for growth-oriented interns.",
      ],
    },
    {
      title: "Adaptability",
      description: "Be open to learning new things, adjusting to challenges, and stepping outside your comfort zone.",
      imageSrc: "https://assets.thehansindia.com/h-upload/2020/02/14/263015-adaptability.webp",
      buttonText: "Read More",
      sharedBy: "Ms.Piruntha",
      focusTitle: "Being Open to Learning and Adjusting to Challenges",
      focusDescription: [
        "Adaptability involves being open to learning new things, adjusting to challenges, and stepping outside your comfort zone.", 
        "In an internship, this might mean learning new skills, adjusting to changing job requirements, or taking on unfamiliar tasks.", 
        "Demonstrating that you can adapt to new environments and challenges will show that you're flexible and capable of thriving in dynamic situations.",
        "Provide examples where you had to step outside your comfort zone, like learning new software or taking on additional responsibilities, and how you successfully adapted to the situation.",
      ],
    },
  ];

  const handleCardClick = (card) => {
    setModalContent(card);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const cardRows = chunkArray(shortCardData, 3);

  return (
    <div className="internship-tips-container">
      <div className="interntips_subtitle">
        <Title level={2}>Internship Tips</Title>
        <p>Let's get insider tips to make the most of our internship!</p>
      </div>

      {/* Cards Section */}
      {cardRows.map((row, rowIndex) => (
        <div className="shortcards-container" key={rowIndex}>
          {row.map((card, cardIndex) => (
            <ShortCard
              key={cardIndex}
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              buttonText={card.buttonText}
              onButtonClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      ))}

      {/* Modal Section */}
      <Modal
        title={
          <div 
            style={{ 
              color: 'var(--primary-color)', 
              fontSize: '24px', 
              fontWeight: 'bold', 
              textAlign: 'center',
              marginTop: '8px',
              marginBottom: '10px',
            }}
          >
            {modalContent.title}
          </div>
        }
        open={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        style = {{top:50, padding: "20px"}}
      >
        <Typography>
          <Paragraph>
            <strong>Shared by:</strong> <br /> {modalContent.sharedBy}
          </Paragraph>
          <Paragraph>
            <strong>Section Focus:</strong> <br /> {modalContent.focusTitle}
          </Paragraph>
          <Paragraph>
            <strong>Descriptions:</strong>
            <ul>
              {modalContent.focusDescription &&
                modalContent.focusDescription.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
            </ul>
          </Paragraph>
        </Typography>
      </Modal>
    </div>
  );
};

export default InternshipTips;