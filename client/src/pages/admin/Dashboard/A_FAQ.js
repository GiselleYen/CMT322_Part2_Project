import React, { useState, useEffect } from "react";
import {
  CaretRightOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { message, Collapse, Button, Input, Modal, Form, Spin } from "antd";
import "./A_FAQ.css";
import ManageButton from "../../../components/manageButton/manageButton";
import ButtonComponent from "../../../components/button/button";
import { auth } from "../../../config/firebase";
import { faqService } from "../../../services/Dashboard/faqService";

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const data = await faqService.getFaqs();
        const sortedFaqs = data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
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

  const handleEdit = (faq) => {
    setCurrentFaq(faq);
    setIsModalOpen(true);
    if (faq) {
      form.setFieldsValue(faq);
    } else {
      form.resetFields();
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const user = auth.currentUser;
      if (!user) {
        message.error("User not authenticated");
        return;
      }

      const token = await user.getIdToken();
      const updatedValues = {
        ...values,
        updatedAt: new Date().toISOString(),
      };

      if (currentFaq) {
        await faqService.updateFaq({ ...currentFaq, ...updatedValues }, token);
        setFaqs((prevFaqs) =>
          prevFaqs
            .map((faq) =>
              faq.id === currentFaq.id ? { ...faq, ...updatedValues } : faq
            )
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
        message.success("FAQ updated successfully!");
      } else {
        const newFaq = await faqService.addFaq(updatedValues, token);
        setFaqs((prevFaqs) =>
          [...prevFaqs, newFaq].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          )
        );
        message.success("New FAQ added successfully!");
      }

      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this FAQ?",
      content: "This action cannot be undone.",
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
          message.error("Failed to delete FAQ.");
        }
      },
    });
  };

  const faqItems = faqs.map((faq) => ({
    key: faq.id.toString(),
    label: faq.question,
    children: (
      <>
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
      </>
    ),
  }));

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
        <svg
          viewBox="0 0 1200 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,0 L0,0 Z"
            fill="#1e0250"
          />
        </svg>
      </div>
      <div className="faq-header">
        <h2 className="faq-title">Manage FAQs</h2>
        <ManageButton text="Add FAQ" onClick={() => handleEdit(null)} />
      </div>

      <div className="faq-collapse">
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          ghost
          items={faqItems}
        />
      </div>

      <Modal
        className="A_FAQ-modal"
        title={
          <span className="modal-title">
            {currentFaq ? "Edit FAQ" : "Add FAQ"}
          </span>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[
          <Button 
            key="cancel" 
            className="cancel_button" 
            onClick={handleModalClose} 
            disabled={saving}>
            Cancel
          </Button>,
          <Button
            key="save"
            className="save_button"
            type="primary"
            onClick={handleSave}
            loading={saving}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          className="A_custom-form"
          style={{ padding: "20px" }}
          onFinish={handleSave}
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter a question" }]}
            style={{ marginTop: "-5px" }}
          >
            <Input placeholder="Enter the FAQ question" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: "60px" }}
            label="Answer"
            name="answer"
            rules={[{ required: true, message: "Please enter an answer" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter the FAQ answer" />
          </Form.Item>
        </Form>

        {/* <div className="modal-buttons">
          <ButtonComponent
            text="Cancel"
            onClick={handleModalClose}
            styleClass="cancel-button"
          />
          <ButtonComponent
            text="Save"
            onClick={handleSave}
            styleClass="save-button"
            disabled={saving}
          />
        </div> */}
      </Modal>
    </div>
  );
};

export default AdminFAQ;
