import React, { useState } from "react";
import { CaretRightOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Collapse, Button, Input, Modal, Form } from "antd";
import "./A_FAQ.css"; 
import ManageButton from "../../../components/manageButton/manageButton";
import ButtonComponent from "../../../components/button/button";


const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([
    {
      key: "1",
      label: "How do I reset my password?",
      children: "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your registered email.",
    },
    {
      key: "2",
      label: "Where can I find the tips or hints for industrial training?",
      children: "For tips or hints about industrial training, you can refer to the 'Spotlight' section, where senior interns and professionals share valuable advice and industry insights.",
    },
    {
      key: "3",
      label: "How can I contact support?",
      children: "You can contact support by emailing cssociety@student.usm.my or using the 'Feedback' option in the navigation menu.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [form] = Form.useForm();

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

  // Save FAQ (add or edit)
  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (currentFaq) {
          setFaqs((prevFaqs) =>
            prevFaqs.map((faq) =>
              faq.key === currentFaq.key ? { ...faq, ...values } : faq
            )
          );
          message.success("FAQ updated successfully!");
        } else {
          setFaqs((prevFaqs) => [
            ...prevFaqs,
            { key: String(prevFaqs.length + 1), ...values },
          ]);
          message.success("New FAQ added successfully!");
        }
        form.resetFields();
        setIsModalOpen(false); // Close the modal after save
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo); // Handle validation errors
      });
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Delete FAQ
  const handleDelete = (key) => {
    Modal.confirm({
      title: "Are you sure you want to delete this FAQ?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger", // Makes the OK button red
      cancelText: "Cancel",
      okButtonProps: {
        className: "delete-confirm-button", 
      },
      cancelButtonProps: {
        className: "cancel_button", // Custom class for Cancel button
      },
      onOk() {
        setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.key !== key));
        message.success('FAQ deleted successfully');
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };  
  

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
            <Collapse.Panel header={faq.label} key={faq.key}>
              <p>{faq.children}</p>
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
                  onClick={() => handleDelete(faq.key)}
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
            name="label"
            rules={[
                { required: true, message: "Please enter a question" }, // Validation rule
              ]}
              style={{ marginTop: "-5px" }}
             
          >
            <Input placeholder="Enter the FAQ question" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '60px' }}
            label="Answer"
            name="children"
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
