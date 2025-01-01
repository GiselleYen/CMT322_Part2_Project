import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import A_LongCard from "../../../components/a_longcard/a_longcard";
import ButtonComponent from "../../../components/button/button";
import "./A_BestIntern.css";
import { bestInternServices } from '../../../services/InternSportlight/bestInternServices';
import PropTypes from 'prop-types';
import { auth } from '../../../config/firebase';

const BestIntern = () => {
  const buttonText = "Edit";
  const [bestInternData, setBestInternData] = useState([
    {
      achieverRank: "Top 1 Achiever",
      internName: "Hia Wei Qi",
      position: "NI RND Software Engineer Intern 2023",
      quote: '"Great things happen outside your comfort zone—dare to explore!"',
      img: "/assets/images/HiaWeiQi.png",
      project: "Developing or enhancing software for test and measurement equipment.\nWorking on modules related to automated testing, signal processing, or hardware integration.\nParticipating in agile development processes like sprint planning, feature implementation, and bug fixing.",
      experience: "Exposure to software development life cycles (SDLC) and agile methodologies.\nHands-on experience with programming languages such as Python, C++, or LabVIEW.\nCollaborating with cross-functional teams, including hardware and firmware engineers.",
      growth: "Development of strong problem-solving skills in a technical and structured manner.\nGaining proficiency in debugging and optimizing code for performance and reliability.\nEnhanced communication and teamwork skills through cross-departmental collaborations.",
      email: "enweiyee0923@gmail.com",
      linkedin: "https://www.linkedin.com/in/hia-wei-qi-802a87116/",
    },
    {
      achieverRank: "Top 2 Achiever",
      internName: "Nur Liana binti Samsudin",
      position: "TNB Data Analytic Intern 2023",
      quote: '"Data may not always tell the story you want, but it always tells the story you need."',
      img: "/assets/images/NurLiana.png",
      project:"Conducting data analysis on operational, customer, or financial datasets.\nSupporting predictive analytics or machine learning projects for energy efficiency or grid optimization.\nBuilding dashboards for real-time monitoring or historical analysis of energy usage.",
      experience: "Working with tools like Python, R, or SQL for data processing and analysis.\nExperience with business intelligence platforms like Power BI or Tableau.\nExposure to large-scale energy datasets and utility-specific challenges.\nUnderstanding energy management systems and key performance indicators in the power sector.",
      growth: "Developing analytical thinking and critical reasoning for decision-making based on data insights.\nImproved presentation skills to communicate technical findings to non-technical stakeholders.\nFamiliarity with energy industry standards and sustainability goals.",
      email: "nurliana@gmail.com",
      linkedin: "https://www.linkedin.com/in/nur-liana-samsudin-454a15150/",
    },
    {
      achieverRank: "Top 3 Achiever",
      internName: "Piruntha Devi A/P Moganades",
      position: "Aemulus Frontend Developer 2023",
      quote: '"Keep moving forward no matter what happens."',
      img: "/assets/images/PirunthaDevi.png",
      project: "Developing or enhancing the user interface of semiconductor testing software.\nCreating intuitive and responsive web or desktop applications to simplify testing workflows.\nParticipating in the design and implementation of UI/UX improvements based on customer feedback.",
      experience: "Gaining hands-on experience with frontend frameworks like React.js, Angular, or Vue.js.\nWorking with APIs for backend integration using REST or GraphQL.\nExposure to version control systems (e.g., Git) and code review processes.\nUnderstanding semiconductor testing workflows and their implications in software design.",
      growth:"Enhanced skills in crafting user-friendly and visually appealing interfaces.\nDevelopment of creativity and attention to detail in UI/UX design.\nGaining experience in collaborating with backend developers and product managers.",
      email: "piruntha@gmail.com",
      linkedin: "https://www.linkedin.com/in/piruntha-devi/",
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalData, setModalData] = useState({});
  const [form] = Form.useForm();

  const navigateToSlide = (index) => {
    setCurrentSlide(index);
  };

  const showModal = (index) => {
    const latestData = bestInternData[index]; // Fetch the latest data dynamically
    setModalData({ ...latestData });
    setIsModalOpen(true);
  
    // Directly handle bullet points within form.setFieldsValue
    form.setFieldsValue({
      internName: latestData.internName,
      position: latestData.position,
      quote: latestData.quote,
      imageURL: latestData.img,
      project: Array.isArray(latestData.project)
        ? latestData.project.map((line) => `• ${line}`).join("\n")
        : latestData.project
          .split("\n")
          .map((line) => (line.trim() ? `• ${line.trim()}` : ""))
          .join("\n"),
      experience: Array.isArray(latestData.experience)
        ? latestData.experience.map((line) => `• ${line}`).join("\n")
        : latestData.experience
          .split("\n")
          .map((line) => (line.trim() ? `• ${line.trim()}` : ""))
          .join("\n"),
      growth: Array.isArray(latestData.growth)
        ? latestData.growth.map((line) => `• ${line}`).join("\n")
        : latestData.growth
          .split("\n")
          .map((line) => (line.trim() ? `• ${line.trim()}` : ""))
          .join("\n"),
      email: latestData.email,
      linkedin: latestData.linkedin,
    });
  };
  

  

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTextAreaKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentValue = form.getFieldValue(fieldName) || "";
      const updatedValue = currentValue + (currentValue.trim() ? "\n• " : "• ");
      form.setFieldValue(fieldName, updatedValue);
    }
  };  

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedInternData = [...bestInternData];
        const updatedIntern = {
          ...updatedInternData[currentSlide],
          internName: values.internName,
          position: values.position,
          quote: values.quote,
          img: values.imageURL,
          project: values.project
            .split("\n")
            .map((line) => line.replace(/^•\s*/, "").trim())
            .filter((line) => line),
          experience: values.experience
            .split("\n")
            .map((line) => line.replace(/^•\s*/, "").trim())
            .filter((line) => line),
          growth: values.growth
            .split("\n")
            .map((line) => line.replace(/^•\s*/, "").trim())
            .filter((line) => line),
          email: values.email,
          linkedin: values.linkedin,
        };

        updatedInternData[currentSlide] = updatedIntern;
        setBestInternData(updatedInternData);
        setIsModalOpen(false);
        message.success("Best intern info updated successfully!");
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
      });
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
          <ButtonComponent
            key={index}
            text={item.achieverRank}
            styleClass={`nav-button ${currentSlide === index ? "active" : ""}`}
            onClick={() => navigateToSlide(index)}
          />
        ))}
      </div>

      {/* Display active intern slide */}
      <div>
        <A_LongCard
          achieverRank={bestInternData[currentSlide].achieverRank}
          internName={bestInternData[currentSlide].internName}
          position={bestInternData[currentSlide].position}
          quote={bestInternData[currentSlide].quote}
          img={bestInternData[currentSlide].img}
          buttonText={buttonText}
          onButtonClick={() => showModal(currentSlide)} // Pass index only
        />
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        className="A_custom-modal"
        width={800}
        style={{
          top: 50,
        }}
      >
        <div className="modal-title">
          <h2>Edit Best Intern Info</h2>
        </div>

        <Form form={form} layout="vertical" className="A_custom-form" style={{ padding: "20px" }}>

          <Form.Item
            name="imageURL"
            label="Image URL"
            rules={[
              { required: true, message: "Please provide the URL of the intern's image" },
            ]}
          >
            <Input placeholder="Enter the URL of the intern's image" />
          </Form.Item>

          <Form.Item
            name="internName"
            label="Intern Name"
            rules={[{ required: true, message: "Please enter the previous top intern's name" }]}
          >
            <Input placeholder="Enter the previous top intern's name" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: "Please enter the intern's position" }]}
          >
            <Input placeholder="Enter the intern's position (e.g., Software Engineer)" />
          </Form.Item>

          <Form.Item
            name="quote"
            label="Quote"
            rules={[{ required: true, message: "Please enter a quote from the intern" }]}
          >
            <Input placeholder="Enter a memorable quote from the intern" />
          </Form.Item>

          <Form.Item
            name="project"
            label="Industrial Project"
            style={{ marginBottom: "157px" }}
            rules={[{ required: true, message: "Please add the industrial projects completed by the intern (one point per line)" }]}
          >
            <Input.TextArea
              rows={7}
              placeholder="Please press 'Enter' to start a new industrial project completed by the intern (one point per line)"
              onKeyDown={(e) => handleTextAreaKeyDown(e, "project")}
            />
          </Form.Item>

          <Form.Item
            name="experience"
            label="Industrial Experience"
            style={{ marginBottom: "157px" }}
            rules={[{ required: true, message: "Please describe the intern's industrial experience (one point per line)" }]}
          >
            <Input.TextArea
              rows={7}
              placeholder="Please press 'Enter' to start a new detail of the intern's industrial experience (one point per line)"
              onKeyDown={(e) => handleTextAreaKeyDown(e, "experience")}
            />
          </Form.Item>

          <Form.Item
            name="growth"
            label="Personal Growth"
            style={{ marginBottom: "157px" }}
            rules={[{ required: true, message: "Please describe intern's personal growth during the internship (one point per line)" }]}
          >
            <Input.TextArea
              rows={7}
              placeholder="Please press 'Enter' to start a new detail of the intern's personal growth during the internship (one point per line)"
              onKeyDown={(e) => handleTextAreaKeyDown(e, "growth")}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the intern's email" },
              { type: "email", message: "Please enter the intern's valid email address" },
            ]}
            style={{ marginBottom: "20px" }}
          >
            <Input placeholder="Enter the intern's email (e.g., example@example.com)" />
          </Form.Item>

          <Form.Item
            name="linkedin"
            label="LinkedIn"
            rules={[{ required: false, message: "Please enter the intern's LinkedIn profile URL (optional)" }]}
            style={{ marginBottom: "5px" }}
          >
            <Input placeholder="Enter the LinkedIn profile URL (e.g., https://linkedin.com/in/username) [optional]" />
          </Form.Item>

        </Form>

        <div className="modal-buttons">
          <ButtonComponent text="Cancel" onClick={handleModalClose} styleClass="cancel-button" />
          <ButtonComponent text="Save" onClick={handleSave} styleClass="save-button" />
        </div>
      </Modal>
    </div>
  );
};

export default BestIntern;
