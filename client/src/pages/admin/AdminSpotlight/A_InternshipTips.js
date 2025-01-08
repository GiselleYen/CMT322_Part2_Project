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

  const handleEditClick = (tip = null) => {
    if (tip) {
    // Convert the createdAt field to timestamp format if it's a date object or string
    const createdAtTimestamp = typeof tip.createdAt === 'string'
      ? new Date(tip.createdAt).getTime()  // Convert to timestamp if it's a string
      : tip.createdAt;  // If it's already a timestamp, leave it as is

      // Populating the form for editing an existing tip
      form.setFieldsValue({
        title: tip.title,
        description: tip.description,
        sharedBy: tip.sharedBy,
        focusTitle: tip.focusTitle,
        focusDescription: Array.isArray(tip.focusDescription)
          ? tip.focusDescription.map((line) => `• ${line}`).join("\n")
          : tip.focusDescription
            .split("\n"), // Split string into array by newline
            // .map((line) => `• ${line}`) // Add bullets to each line
          //   .join("\n"), // Join into a single string with new lines
        imageSrc: tip.imageSrc, // Include the image URL for editing
        createdAt: createdAtTimestamp, // Pass timestamp instead of string
      });
      setModalTip(tip);
      setIsEditMode(true); // Enable edit mode
    } else {
      // Resetting the form for adding a new tip
      form.resetFields();
      setIsEditMode(false); // Disable edit mode (for adding)
      setModalTip({ imageSrc: "" }); // Initialize a blank modal tip
    }
    setIsModalOpen(true);
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
        setSaving(true);
        const token = await user.getIdToken();

    // Ensure createdAt is in timestamp format when saving (convert back if necessary)
    const createdAtTimestamp = typeof values.createdAt === 'string'
      ? new Date(values.createdAt).getTime()  // Convert to timestamp if it's a string
      : values.createdAt;  // If it's already a timestamp, leave it as is
        // Process the data
        const updatedContent = {
          ...modalTip,
          ...values,
          createdAt: createdAtTimestamp,  // Ensure createdAt is in timestamp format
          focusDescription: values.focusDescription
            .split("\n") // Split lines into an array
            .map((line) => line.replace(/^•\s*/, "")) // Remove bullets and leading spaces
            // .filter((line) => line.trim() !== ""), // Remove empty lines
        };
  
    // Determine whether we are adding or editing the tip
    const saveFunction = isEditMode && modalTip.id 
      ? internshipTipService.updateInternshipTip(modalTip.id, updatedContent, token) 
      : internshipTipService.addInternshipTip(updatedContent, token);

    const savedTip = await saveFunction;

    // Update the state based on whether we added or updated the tip
    setInternTipsData((prevData) =>
      isEditMode
        ? prevData.map((tip) => (tip.id === savedTip.id ? savedTip : tip)) // Update existing tip
        : [...prevData, savedTip] // Add new tip
    );

    message.success(isEditMode ? "Internship tip updated successfully!" : "New internship tip added successfully!");

    // Close the modal and reset form fields after saving
    setIsModalOpen(false);
    form.resetFields();
    // handleCancelClick();
    fetchInternshipTips();
  } catch (error) {
    console.error("Error saving internship tip:", error);
    message.error("Failed to save internship tip");
  } finally {
    setSaving(false); // Set saving back to false after the save operation is complete
  }
};

  const handleModalClose = () => {
    // Reset the imageSrc to empty when closing the modal
    setModalTip((prev) => ({ ...prev, imageSrc: "" }));
    setIsModalOpen(false);
  };



  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const handleDelete = (id) => {
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
      async onOk() {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
  
          if (!user) {
            message.error("User not authenticated");
            return;
          }
  
          const token = await user.getIdToken();
          
          // Call the service to delete the tip
          await internshipTipService.deleteInternshipTip(id, token);
  
          // Update state to reflect deletion
          setInternTipsData((prevData) => prevData.filter((tip) => tip.id !== id));
  
          message.success("Internship tip deleted successfully!"); // Display success message
        } catch (error) {
          console.error("Error deleting internship tip:", error);
          message.error("Failed to delete internship tip. Please try again.");
        }
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };
  

  const tipRows = chunkArray(internTipsData, 3);
    
  if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }

  return (
    <div className="internship-tips-container">
      <div className="interntips_subtitle">
        <Title level={2}>Internship Tips</Title>
        <p>Let's get insider tips to make the most of our internship!</p>
      </div>
      <div className="manage-details-container"> 
        <ManageButton
          type="primary"
          className="manage_details_button"
          text="Add Internship Tips"
          onClick={() => handleEditClick()} // Call without arguments to add
        />
      </div>


      {/* tips Section */}
      {tipRows.map((row, rowIndex) => (
        
        <div className="shortcards-container" key={rowIndex}>
          {row.map((tip, tipIndex) => (
            <A_ShortCard
              key={tipIndex}
              title={tip.title}
              description={tip.description}
              imageSrc={tip.imageSrc}
              buttonText="Edit"
              onEditClick={() => handleEditClick(tip)}
              onDeleteClick={() => handleDelete(tip.id)} // Pass the title as the key to identify the tip to delete
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
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              className="save_button" 
              type="primary" 
              onClick={handleSave}
              loading={saving}
              disabled={saving}
            >
              Save
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" className="A_InternTips-form" style={{ padding: "20px" }}>
        <Form.Item
            label="Image URL"
            name="imageSrc"
            rules={[
              {
                required: true,
                message: "Please enter the Image URL!",
              },
            ]}
          >
            <Input
              value={modalTip.imageSrc}
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
