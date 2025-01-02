import React, { useState, useEffect } from 'react';
import { Modal, Typography, message } from 'antd';
import ShortCard from '../../../components/shortcard/shortcard';
import { internshipTipService } from '../../../services/InternSportlight/internshipTipService';
import './InternshipTips.css';

const { Title, Paragraph } = Typography;

const InternshipTips = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTip, setModalTip] = useState({});
  const [internTipsData, setInternTipsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Previous:", internTipsData); 
    fetchInternshipTips();
  }, []);
  
  const fetchInternshipTips = async () => {
    setLoading(true);
    console.log("fetching ...");  // Corrected from console() to console.log()
    try {
      const data = await internshipTipService.getInternshipTips();
      setInternTipsData(data);
      console.log("fetching successfully");  
      console.log(data);
      if (data && Array.isArray(data)) {
        setInternTipsData(data);  // Update state
      } else {
        console.error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching internship tips:", error);
      message.error("Failed to load internship tips");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (card) => {
    setModalTip(card);
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

  const cardRows = chunkArray(internTipsData, 3);

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
            {modalTip.title}
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
            <strong>Shared by:</strong> <br /> {modalTip.sharedBy}
          </Paragraph>
          <Paragraph>
            <strong>Section Focus:</strong> <br /> {modalTip.focusTitle}
          </Paragraph>
          <Paragraph>
            <strong>Descriptions:</strong>
            <ul>
              {modalTip.focusDescription &&
                modalTip.focusDescription.map((point, index) => (
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