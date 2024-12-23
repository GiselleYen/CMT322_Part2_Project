import React, { useState, useRef } from "react";
import { Modal, Typography, Form, Input, Button, Radio, Space, message } from "antd";
import A_ShortCard from "../../../components/a_shortcard/a_shortcard";
import ManageButton from "../../../components/manageButton/manageButton";
import "./A_InternshipTips.css";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const A_InternshipTips = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [form] = Form.useForm();
  const fileInputRef = useRef(null); // Add a ref for the file input element
  const [shortCardData, setShortCardData] = useState([
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
  ]);

  // Add bullet points to the new line on pressing Enter
  const handleTextAreaKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default newline behavior
      const currentValue = form.getFieldValue("focusDescription") || "";
      const updatedValue = currentValue + (currentValue.trim() ? "\n• " : "• ");
      form.setFieldValue("focusDescription", updatedValue);
    }
  };




  // Reset modal state when opening the modal for adding a new card
  const handleAddNewClick = () => {
    setModalContent({ imageSrc: "" }); // Reset modal content including imageSrc
    form.resetFields(); // Reset form fields
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
    setIsModalOpen(true);
  };

  const handleEditClick = (card) => {
    setModalContent(card); // Set modal content to the card that is being edited
    form.setFieldsValue({
      title: card.title,
      description: card.description,
      sharedBy: card.sharedBy,
      focusTitle: card.focusTitle,
      focusDescription: card.focusDescription
        .map((line) => `• ${line}`) // Add bullets to each line
        .join("\n"), // Join • into a single string with new lines
      // Exclude imageSrc here as it will be handled separately
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form
      .validateFields() // Validate all fields before saving
      .then((values) => {
        // Process the data only if validation passes
        const updatedContent = {
          ...modalContent,
          ...values,
          focusDescription: values.focusDescription
            .split("\n") // Split lines into an array
            .map((line) => line.replace(/^•\s*/, "")) // Remove bullets and leading spaces
            .filter((line) => line.trim() !== ""), // Remove empty lines
          imageSrc: modalContent.imageSrc || "", // Ensure imageSrc is included in the updated content
        };
  
        if (modalContent.title) {
          // Update existing card
          setShortCardData((prevData) =>
            prevData.map((card) =>
              card.title === modalContent.title ? updatedContent : card
            )
          );
          message.success("Internship tip updated successfully!"); // Success message for update
        } else {
          // Add new card
          setShortCardData((prevData) => [
            ...prevData,
            {
              ...updatedContent,
              imageSrc: modalContent.imageSrc || "", // If no image, set an empty string
            },
          ]);
          message.success("New internship tip added successfully!"); // Success message for adding new tip
        }

        setIsModalOpen(false);
        form.resetFields(); // Reset the form after successful save
      })
      .catch((errorInfo) => {
        // Handle validation errors
        console.error("Validation Failed:", errorInfo);
      });
  }; 

  const handleModalClose = () => {
    // Reset the imageSrc to empty when closing the modal
    setModalContent((prev) => ({ ...prev, imageSrc: "" }));
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setModalContent((prev) => ({ ...prev, imageSrc: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setModalContent((prev) => ({ ...prev, imageSrc: "" }));
    }
  };

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Internship Tip?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger", // Makes the OK button red
      cancelText: "Cancel",
      okButtonProps: {
        className: "delete-confirm-button",
      },
      cancelButtonProps: {
        className: "cancel_button",
      },
      onOk() {
        setShortCardData((prevData) => prevData.filter((card) => card.title !== key));
        message.success ("Internship tip deleted successfully!"); // Display success message after deletion
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const cardRows = chunkArray(shortCardData, 3);

  return (
    <div className="internship-tips-container">
      <div className="interntips_subtitle">
        <Title level={2}>Internship Tips</Title>
        <p>Let's get insider tips to make the most of our internship!</p>
      </div>
      <div className="manage-details-container">
        <ManageButton type="primary" className="manage_details_button" text="Add Internship Tips" onClick={handleAddNewClick} />
      </div>

      {/* Cards Section */}
      {cardRows.map((row, rowIndex) => (
        
        <div className="shortcards-container" key={rowIndex}>
          {row.map((card, cardIndex) => (
            <A_ShortCard
              key={cardIndex}
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              buttonText="Edit"
              onEditClick={() => handleEditClick(card)}
              onDeleteClick={() => handleDelete(card.title)} // Pass the title as the key to identify the card to delete
            />
          ))}
        </div>
      ))}

      {/* Modal Section */}
      <Modal
        className="A_InternTips-modal"
        title={<span className="modal-title-custom">{modalContent.title ? "Edit Internship Tip" : "Add New Internship Tip"}</span>}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleModalClose}
        // okText="Save"
        // cancelText="Cancel"
        width={700}
        style = {{top:50}}
        // okButtonProps={{ className: "save_button" }}
        // cancelButtonProps={{ className: "cancel_button" }}
        footer={
          <div style={{   
            marginTop: "-13px",
            marginRight: "-1px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}>
            <Button 
              className="cancel_button" 
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button 
              className="save_button" 
              type="primary" 
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" className="A_InternTips-form" style={{ padding: "20px" }}>
          <Form.Item label="Upload Image">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef} // Attach the ref here
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title for the internship tip card" }]}
          >
            <Input placeholder="Enter the title for the internship tip card" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            style={{ marginBottom: "48px" }}
            rules={[{ required: true, message: "Please enter a description for the internship tip card" }]}
          >
            <TextArea rows={2} placeholder="Enter a brief description of the internship tip card" />
          </Form.Item>

          {/* Radio Buttons with Grouping for "Shared By" */}
          <Form.Item
            name="sharedBy"
            label="Shared By"
            rules={[{ required: true, message: "Please select who shared this tip" }]}
          >
            <Radio.Group className="custom-radio-group">
              <Space size="large">
                <Radio.Button value="Mr.Hia Wei Qi">Mr. Hia Wei Qi</Radio.Button>
                <Radio.Button value="Ms.Liana">Ms. Liana</Radio.Button>
                <Radio.Button value="Ms.Piruntha">Ms. Piruntha</Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="focusTitle"
            label="Focus Title"
            rules={[{ required: true, message: "Please enter a focus title for this internship tip " }]}
          >
            <Input placeholder="Enter the area of focus for this internship tip (e.g., Required and Optional Skills)" />
          </Form.Item>
          <Form.Item
            name="focusDescription"
            label="Focus Description (Each point on a new line)"
            style={{ marginBottom: "208px" }}
            rules={[{ required: true, message: "Please enter at least one focus description" }]}
          >
            <TextArea
              rows={10}
              onKeyDown={handleTextAreaKeyDown}
              placeholder="Please press 'Enter' to start a new focus description point."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default A_InternshipTips;
