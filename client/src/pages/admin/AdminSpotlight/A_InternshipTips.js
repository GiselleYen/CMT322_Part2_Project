import React, { useState, useEffect } from "react";
import { Modal, Typography, Form, Input, Button, Radio, Space, message, Spin } from "antd";
import { getAuth } from "firebase/auth"; 
import A_ShortCard from "../../../components/a_shortcard/a_shortcard";
import ManageButton from "../../../components/manageButton/manageButton";
import { internshipTipService } from "../../../services/InternSportlight/internshipTipService";
import "./A_InternshipTips.css";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const A_InternshipTips = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTip, setModalTip] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [internTipsData, setInternTipsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
  
  // Monitor changes to internTipsData to see if re-render occurs
  useEffect(() => {
    console.log("internTipsData updated:", internTipsData);  // This will log every time internTipsData changes
  }, [internTipsData]);

  // Add bullet points to the new line on pressing Enter
  const handleTextAreaKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default newline behavior
      const currentValue = form.getFieldValue("focusDescription") || "";
      const updatedValue = currentValue + (currentValue.trim() ? "\n• " : "• ");
      form.setFieldValue("focusDescription", updatedValue);
    }
  };

  // Handle adding new cards
  const handleAddNewClick = () => {
    setModalTip({ imageSrc: "" }); // Reset modal content including imageSrc
    form.resetFields(); // Reset form fields
    setIsModalOpen(true);
  };

  const handleEditClick = (card) => {
    if (card){
    form.setFieldsValue({
      title: card.title,
      description: card.description,
      sharedBy: card.sharedBy,
      focusTitle: card.focusTitle,
      focusDescription: Array.isArray(card.focusDescription)
        ? card.focusDescription.map((line) => `• ${line}`).join("\n")
        : card.focusDescription
          .split("\n") // Split string into array by newline
          .map((line) => `• ${line}`) // Add bullets to each line
          .join("\n"), // Join into a single string with new lines
      imageURL: card.imageSrc, // Include the image URL for editing
    });
    setIsEditMode(true);
  } else {
    form.resetFields();
    setIsEditMode(false);
  }
  setModalTip(card);
  setIsModalOpen(true);
  };
  

  const handleSave = () => {
    form
      .validateFields() // Validate all fields before saving
      .then((values) => {
        // Process the data only if validation passes
        const updatedContent = {
          ...modalTip,
          ...values,
          focusDescription: values.focusDescription
            .split("\n") // Split lines into an array
            .map((line) => line.replace(/^•\s*/, "")) // Remove bullets and leading spaces
            .filter((line) => line.trim() !== ""), // Remove empty lines
        };
  
        if (modalTip.title) {
          // Update existing card
          setInternTipsData((prevData) =>
            prevData.map((card) =>
              card.title === modalTip.title ? updatedContent : card
            )
          );
          message.success("Internship tip updated successfully!"); // Success message for update
        } else {
          // Add new card
          setInternTipsData((prevData) => [
            ...prevData,
            {
              ...updatedContent,
              imageSrc: modalTip.imageSrc || "", // If no image, set an empty string
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
    setModalTip((prev) => ({ ...prev, imageSrc: "" }));
    setIsModalOpen(false);
  };

  // Replace file input with image URL input
  const handleImageUrlChange = (e) => {
    setModalTip((prev) => ({ ...prev, imageSrc: e.target.value }));
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
        setInternTipsData((prevData) => prevData.filter((card) => card.title !== key));
        message.success ("Internship tip deleted successfully!"); // Display success message after deletion
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const cardRows = chunkArray(internTipsData, 3);

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
        title={<span className="modal-title-custom">{modalTip.title ? "Edit Internship Tip" : "Add New Internship Tip"}</span>}
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
        <Form.Item
            label="Image URL"
            name="imageURL"
            rules={[
              {
                required: true,
                message: "Please enter the Image URL!",
              },
            ]}
          >
            <Input
              value={modalTip.imageSrc}
              onChange={handleImageUrlChange}
              placeholder="Enter an image URL for the internship tip"
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
