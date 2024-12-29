import React, { useState, useEffect } from "react";
import { CaretRightOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Collapse, Button, Input, Modal, Form, Spin } from "antd";
import "./A_FAQ.css"; 
import ManageButton from "../../../components/manageButton/manageButton";
import ButtonComponent from "../../../components/button/button";
import { auth } from '../../../config/firebase';
import { faqService } from "../../../services/Dashboard/faqService";

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [form] = Form.useForm();

  // Fetch FAQs on component load
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const data = await faqService.getFaqs();
        // Sort FAQs based on the updatedAt field in descending order
        const sortedFaqs = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setFaqs(sortedFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        message.error("Failed to load FAQs.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Open modal for add/edit
  const handleEdit = (faq) => {
    setCurrentFaq(faq);
    setIsModalOpen(true);
    if (faq) {
      form.setFieldsValue(faq);
    } else {
      form.resetFields();
    }
  };

  // Save FAQ (add or update)
  const handleSave = async () => {
    form
      .validateFields()
      .then(async (values) => {
        const user = auth.currentUser;
        if (!user) {
          message.error("User not authenticated");
          return;
        }
  
        const token = await user.getIdToken();
        const updatedValues = { ...values, updatedAt: new Date().toISOString() }; // Ensure updatedAt is set to current time
  
        if (currentFaq) {
          // Update existing FAQ in Firebase
          await faqService.updateFaq({ ...currentFaq, ...updatedValues }, token);
  
          // Update the local state with the updated FAQ and sort
          setFaqs((prevFaqs) => {
            const updatedFaqs = prevFaqs.map((faq) =>
              faq.id === currentFaq.id ? { ...faq, ...updatedValues } : faq
            );
            // Sort FAQs after update
            return updatedFaqs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          });
          message.success("FAQ updated successfully!");
        } else {
          // Add new FAQ to Firebase
          const newFaq = await faqService.addFaq(updatedValues, token);
          console.log("New FAQ:", newFaq); // Log to ensure the new FAQ is correct
  
          // Add the new FAQ to the state and sort
          setFaqs((prevFaqs) => {
            const updatedFaqs = [...prevFaqs, newFaq];
            // Sort FAQs after adding
            return updatedFaqs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          });
          message.success("New FAQ added successfully!");
        }
  
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Validation error:", error);
      });
  };
  
  
  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Delete FAQ
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this FAQ?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        className: "delete-confirm-button",
      },
      cancelButtonProps: {
        className: "cancel_button",
      },
      async onOk() {
        try {
          const user = auth.currentUser;
          const token = await user.getIdToken();
          await faqService.deleteFaq(id, token);
          setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id));
          message.success("FAQ deleted successfully!");
        } catch (error) {
          console.error("Error deleting FAQ:", error);
          message.error("Failed to delete FAQ.");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="faq-container">
      <div className="wave-divider">
        <svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,0 L0,0 Z" fill="#1e0250"/>
         </svg>
      </div>
      <div className="faq-header">
        <h2 className="faq-title">Manage FAQs</h2>
        <ManageButton 
          text="Add FAQ" 
          onClick={() => handleEdit(null)}
        />
      </div>

      <div className="faq-collapse">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          ghost
        >
          {faqs.map((faq) => (
            <Collapse.Panel header={faq.question} key={faq.id}>
              <p>{faq.answer}</p>
              <div className="faq-actions">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(faq)}
                >
                  Edit
                </Button>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(faq.id)}
                >
                  Delete
                </Button>
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
 
       <Modal
        title={<span className="modal-title" >
          {currentFaq ? "Edit FAQ" : "Add FAQ"}</span>}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        className="A_custom-modal"
        width={800}
        style = {{
          top:50,
        }}
        >

        <Form form={form} 
              layout="vertical"  
              className="A_custom-form"
              style={{ padding: '20px'}}
              onFinish={handleSave}>
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter a question" }] }
            style={{ marginTop: "-5px" }}
          >
            <Input placeholder="Enter the FAQ question" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '60px' }}
            label="Answer"
            name="answer"
            rules={[{ required: true, message: "Please enter an answer" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter the FAQ answer" />
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

export default AdminFAQ;
