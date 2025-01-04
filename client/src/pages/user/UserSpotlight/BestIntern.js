import React, { useState, useRef, useEffect } from "react";
import { Carousel, Modal, Typography, message } from "antd";
import { MailOutlined, LinkedinOutlined } from "@ant-design/icons";
import { bestInternService } from "../../../services/InternSportlight/bestInternService";
import LongCard from "../../../components/longcard/longcard";
import Button from "../../../components/button/button";
import "./BestIntern.css";

const { Paragraph } = Typography;

const BestIntern = () => {
  const buttonText = "Discover More";
  const [currentSlide, setCurrentSlide] = useState(0); // Track the active slide
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [isAutoplay, setIsAutoplay] = useState(true); // Control carousel autoplay
  const convertToHTML = (text) => text.replace(/\n/g, "<br />");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const carouselRef = useRef();
  const [bestInternData, setBestInternData] = useState([]);

  useEffect(() => {
    console.log("Previous:", bestInternData); 
    fetchInterns();
  }, []);
  
  const fetchInterns = async () => {
    setLoading(true);
    console.log("fetchingIntern ...");  // Corrected from console() to console.log()
    try {
      const data = await bestInternService.getBestInterns();
      setBestInternData(data);
      console.log("fetching successfully");  
      console.log(data);
      if (data && Array.isArray(data)) {
        setBestInternData(data);  // Update state
      } else {
        console.error("Fetched data is not in the expected format");
      }
    } catch (error) {
      console.error("Error fetching best intern information:", error);
      message.error("Failed to load best intern information");
    } finally {
      setLoading(false);
    }
  };

  const handleSlideChange = (current) => {
    setCurrentSlide(current);
  };

  const navigateToSlide = (index) => {
    carouselRef.current.goTo(index);
  };

  const showModal = (index) => {
    setCurrentSlide(index);
    setIsModalOpen(true);
    setIsAutoplay(false); // Stop autoplay when modal is open
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsAutoplay(true); // Resume autoplay when modal is closed
  };

  const currentData = bestInternData[currentSlide] || {};

  return (
    <div className="best-intern-container">
      <div className="bestintern_subtitle">
        <h2>Best Interns of 2023: Top 3 Achievers</h2>
        <p>
          CS Future Leaders, click 'Discover More' to get inspired by the top
          interns' industrial projects, experiences, and insights!
        </p>
      </div>

      <div className="carousel-navigation">
        {bestInternData.map((item, index) => (
          <Button
            key={index}
            text={item.achieverRank}
            styleClass={`nav-button ${currentSlide === index ? "active" : ""}`}
            onClick={() => navigateToSlide(index)}
          />
        ))}
      </div>

      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        autoplay={isAutoplay}
        autoplaySpeed={5000}
        afterChange={handleSlideChange}
      >
        {bestInternData.map((item, index) => (
          <div key={index}>
            <LongCard
              achieverRank={item.achieverRank}
              internName={item.internName}
              position={item.position}
              quote={item.quote}
              img={item.img}
              buttonText={buttonText}
              onButtonClick={() => showModal(index)} // Show modal on button click
            />
          </div>
        ))}
      </Carousel>

      {/* Modal */}
      <Modal
  open={isModalOpen}
  onOk={handleModalClose}
  onCancel={handleModalClose}
  footer={null}
  className="custom-modal"
  width={800}
  style={{ top: 50, padding: "20px" }}
>
  <div className="modal-title">
    <h2>{currentData.internName}</h2>
    <h4>{currentData.position}</h4>
  </div>
  <div className="custom-bullet-points">
      <Paragraph>
      <strong>Industrial Project:</strong>
      <ul>
        {Array.isArray(currentData.project)
          ? currentData.project.map((item, index) => <li key={index}>{item}</li>)
          : currentData.project?.split("\n").map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </Paragraph>
    <Paragraph>
      <strong>Industrial Experience:</strong>
      <ul>
        {Array.isArray(currentData.experience)
          ? currentData.experience.map((item, index) => <li key={index}>{item}</li>)
          : currentData.experience?.split("\n").map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </Paragraph>
    <Paragraph>
      <strong>Personal Growth:</strong>
      <ul>
        {Array.isArray(currentData.growth)
          ? currentData.growth.map((item, index) => <li key={index}>{item}</li>)
          : currentData.growth?.split("\n").map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </Paragraph>

  </div>
  <div className="separator-line"></div>
  <div className="modal-contact">
    <h4>Get in Touch</h4>
    <pre>Have questions about my experience? Feel free to reach out at:</pre>
    <div className="modal-contact-info">
      <strong>
        <a
          href={`mailto:${currentData.email}?subject=Internship%20Inquiry`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MailOutlined style={{ marginRight: 8 }} /> Email
        </a>
      </strong>
      <br />
      <strong>
        <a
          href={currentData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedinOutlined style={{ marginRight: 8 }} /> LinkedIn
        </a>
      </strong>
    </div>

  </div>
</Modal>

    </div>
  );
};

export default BestIntern;
