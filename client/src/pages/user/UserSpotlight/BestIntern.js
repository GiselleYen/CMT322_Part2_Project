import React, { useState, useRef } from "react";
import { Carousel, Modal, Typography } from "antd";
import { MailOutlined, LinkedinOutlined } from '@ant-design/icons'
import LongCard from "../../../components/longcard/longcard";
import Button from "../../../components/button/button";
import "./BestIntern.css";

const { Paragraph } = Typography;

const BestIntern = () => {
  const bestInternData = [
    {
      achieverRank: "Top 1 Achiever",
      internName: "Hia Wei Qi",
      position: "NI RND Software Engineer Intern 2023",
      quote: "'Great things happen outside your comfort zone—dare to explore!'",
      img: "/assets/images/HiaWeiQi.png",
      buttonText: "Discover More",
      buttonLink: "",
      modalContent: {
        project: [
          "Developing or enhancing software for test and measurement equipment.",
          "Working on modules related to automated testing, signal processing, or hardware integration.",
          "Participating in agile development processes like sprint planning, feature implementation, and bug fixing.",
        ],
        experience: [
          "Exposure to software development life cycles (SDLC) and agile methodologies.",
          "Hands-on experience with programming languages such as Python, C++, or LabVIEW.",
          "Collaborating with cross-functional teams, including hardware and firmware engineers.",
        ],
        growth: [
          "Development of strong problem-solving skills in a technical and structured manner.",
          "Gaining proficiency in debugging and optimizing code for performance and reliability.",
          "Enhanced communication and teamwork skills through cross-departmental collaborations.",
        ],
        email: "enweiyee0923@gmail.com",
        linkedin: "https://www.linkedin.com/in/hia-wei-qi-802a87116/",
      },
    },
    {
      achieverRank: "Top 2 Achiever",
      internName: "Nur Liana binti Samsudin",
      position: "TNB Data Analytic Intern 2023",
      quote: "'Data may not always tell the story you want, but it always tells the story you need.'",
      img: "/assets/images/NurLiana.png",
      buttonText: "Discover More",
      buttonLink: "",
      modalContent: {
        project: [
          "Conducting data analysis on operational, customer, or financial datasets.",
          "Supporting predictive analytics or machine learning projects for energy efficiency or grid optimization.",
          "Building dashboards for real-time monitoring or historical analysis of energy usage.",
        ],
        experience: [
          "Working with tools like Python, R, or SQL for data processing and analysis.",
          "Experience with business intelligence platforms like Power BI or Tableau.",
          "Exposure to large-scale energy datasets and utility-specific challenges.",
          "Understanding energy management systems and key performance indicators in the power sector.",
        ],
        growth: [
          "Developing analytical thinking and critical reasoning for decision-making based on data insights.",
          "Improved presentation skills to communicate technical findings to non-technical stakeholders.",
          "Familiarity with energy industry standards and sustainability goals.",
        ],
        email: "nurliana@gmail.com",
        linkedin: "https://www.linkedin.com/in/nur-liana-samsudin-454a15150/",
      },
    },
    {
      achieverRank: "Top 3 Achiever",
      internName: "Piruntha Devi A/P Moganades",
      position: "Aemulus Frontend Developer 2023",
      quote: "'Keep moving forward no matter what happens.'",
      img: "/assets/images/PirunthaDevi.png",
      buttonText: "Discover More",
      buttonLink: "",
      modalContent: {
        project: [
          "Developing or enhancing the user interface of semiconductor testing software.",
          "Creating intuitive and responsive web or desktop applications to simplify testing workflows.",
          "Participating in the design and implementation of UI/UX improvements based on customer feedback.",
        ],
        experience: [
          "Gaining hands-on experience with frontend frameworks like React.js, Angular, or Vue.js.",
          "Working with APIs for backend integration using REST or GraphQL.",
          "Exposure to version control systems (e.g., Git) and code review processes.",
          "Understanding semiconductor testing workflows and their implications in software design.",
        ],
        growth: [
          "Enhanced skills in crafting user-friendly and visually appealing interfaces.",
          "Development of creativity and attention to detail in UI/UX design.",
          "Gaining experience in collaborating with backend developers and product managers.",
        ],
        email: "piruntha@gmail.com",
        linkedin: "https://www.linkedin.com/in/piruntha-devi/",
      },
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0); // Track the active slide
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [modalData, setModalData] = useState({}); // Data for modal
  const [isAutoplay, setIsAutoplay] = useState(true); // Control carousel autoplay
  const carouselRef = useRef();

  const handleSlideChange = (current) => {
    setCurrentSlide(current);
  };

  const navigateToSlide = (index) => {
    carouselRef.current.goTo(index);
  };

  const showModal = (data, internName, position, index) => {
    setModalData({...data, internName, position });
    setIsModalOpen(true);
    // Stop autoplay when the modal is shown
    setIsAutoplay(false);

    // Set the current slide and navigate to the selected one
    setCurrentSlide(index);
    carouselRef.current.goTo(index);  // Navigate to the selected slide
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Resume autoplay when closing the modal
   setIsAutoplay(true);
  };

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
              buttonText={item.buttonText}
              onButtonClick={() => showModal(item.modalContent, item.internName, item.position, index)} // Show modal on button click
            />
          </div>
        ))}
      </Carousel>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={null} // Remove default footer
        className="custom-modal"
        width={800}
        style = {{top:50, padding: "20px"}}
      >
        {/* Custom Title */}
        <div className="modal-title">
            <h2>{modalData.internName}</h2>
            <h4>{modalData.position}</h4>
          </div>

        {/* Modal Content */}
        <div className="custom-bullet-points">
          <Paragraph>
            <strong>Industrial Project:</strong>
            <ul>
              {modalData.project &&
                modalData.project.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </Paragraph>
          <Paragraph>
            <strong>Industrial Experience:</strong>
            <ul>
              {modalData.experience &&
                modalData.experience.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </Paragraph>
          <Paragraph>
            <strong>Personal Growth:</strong>
            <ul>
              {modalData.growth &&
                modalData.growth.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </Paragraph>
        </div>
      <div className="separator-line"></div>
        <div className="modal-contact">
          <h4>Get in Touch</h4>
          <pre>Have questions about my experience? Feel free to reach out at:<br></br>
          </pre>

          <div className="modal-contact-info">
            <strong><a href={`mailto:${modalData.email}?subject=Internship%20Inquiry&body=Dear%20Mr./Ms.%20${modalData.internName},%0A%0AI%20hope%20you%20are%20doing%20well.%20I%20have%20an%20inquiry%20regarding...%0A%0ABest%20regards,%0A[Your%20Name]`} 
            target="_blank" rel="noopener noreferrer">
            <MailOutlined style={{ marginRight: 8 }} /> Email
              <br />
            </a></strong>
            <strong><a href={modalData.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedinOutlined style={{ marginRight: 8 }} />  LinkedIn
            </a></strong>{" "}
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default BestIntern;
