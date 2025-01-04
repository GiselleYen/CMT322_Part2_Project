import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Button, Spin } from 'antd';
import { getAuth } from "firebase/auth";
import A_LongCard from "../../../components/a_longcard/a_longcard";
import ButtonComponent from "../../../components/button/button";
import "./A_BestIntern.css";
import {bestInternService} from "../../../services/InternSportlight/bestInternService";
import PropTypes from 'prop-types';


const A_BestIntern = () => {
  const buttonText = "Edit";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalIntern, setModalIntern] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [bestInternData, setBestInternData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const navigateToSlide = (index) => {
    setCurrentSlide(index);
  };

  const showModal = (index) => {
    const latestData = bestInternData[index]; // Fetch the latest data dynamically
    
    // Convert the createdAt field to timestamp format if it's a date object or string
    const createdAtTimestamp = 
      typeof latestData.createdAt === 'string'
        ? new Date(latestData.createdAt).getTime() // Convert to timestamp if it's a string
        : latestData.createdAt; // If it's already a timestamp, leave it as is
  
    // Update modal intern data with the correct createdAt format
    setModalIntern({ ...latestData, createdAt: createdAtTimestamp });
  
    setIsEditMode(true);
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
      createdAt: createdAtTimestamp, // Optionally include in the form if needed
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

  const handleSave = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      message.error("User not authenticated");
      return;
    }
  
    try {
      // Validate all fields before saving
      const values = await form.validateFields();
  
      setSaving(true); // Show loading spinner during save process
      const token = await user.getIdToken();
  
      // Ensure createdAt is in timestamp format when saving (convert back if necessary)
      const createdAtTimestamp = 
        typeof values.createdAt === 'string'
          ? new Date(values.createdAt).getTime() // Convert to timestamp if it's a string
          : values.createdAt; // If it's already a timestamp, leave it as is
  
      // Prepare the updated intern data
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
        createdAt: createdAtTimestamp, // Add the corrected createdAt timestamp
      };
  
      // Save updated data to Firestore
      await bestInternService.updateBestIntern(
        updatedIntern.id, // Assuming `id` exists in the intern data
        updatedIntern,
        token // Pass the ID token for authenticated saving
      );
  
      // Update local state with the new data
      updatedInternData[currentSlide] = updatedIntern;
      setBestInternData(updatedInternData);
      setIsModalOpen(false);
      message.success("Best intern info updated successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Failed to save data. Please try again.");
    } finally {
      setSaving(false); // Hide loading spinner after save process
    }
  };
  
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

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
      {bestInternData[currentSlide] ? (
        <A_LongCard
          achieverRank={bestInternData[currentSlide].achieverRank}
          internName={bestInternData[currentSlide].internName}
          position={bestInternData[currentSlide].position}
          quote={bestInternData[currentSlide].quote}
          img={bestInternData[currentSlide].img}
          buttonText={buttonText}
          onButtonClick={() => showModal(currentSlide)} // Pass index only
        />
      ) : (
        <div>No data available</div> // Fallback UI when data is not available
      )}
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
          <ButtonComponent
            text={saving ? "Saving..." : "Save"}
            onClick={handleSave}
            loading={saving}
            disabled={
              saving 
              // || 
              // !form.isFieldsTouched(true) || 
              // form.getFieldsError().some(({ errors }) => errors.length)
            }
            styleClass="save-button"
          />
        </div>
      </Modal>
    </div>
  );
};

export default A_BestIntern;
