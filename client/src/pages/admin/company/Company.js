import React, { useState,useEffect } from 'react';
import './Company.css';
import Button from '../../../components/button/button';
import {Modal, Form, Input,Card, Button as AntButton,Typography, Title,message,Spin} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined  } from "@ant-design/icons";
import { getAuth } from 'firebase/auth';
import { CompanyService } from "../../../services/Company/CompanyService";

const CompanyManagePage = () => {
  // State for controlling the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false); 
  // State for managing the current company's data, initialized with default values
  const [currentCompany, setCurrentCompany] = useState({
    id: null,                      // Unique identifier for the company
    name: '',                      // Name of the company
    companyDetail: '',             // Detailed description of the company
    internPosition: '',            // Internship position offered by the company
    jobResponsibility: '',         // Responsibilities of the job/internship
    jobRequirement: '',            // Requirements for the job/internship
    benefitsOffered: '',           // Benefits provided by the company
    logo: '',                      // URL or path for the company's logo
    hrEmail: ''                     // HR contact email address
  });
  // State for determining the modal's type (either "add" for adding a company or "edit" for editing an existing one)
  const [modalType, setModalType] = useState(''); 
  // State to manage the loading indicator
  const [loading, setLoading] = useState(false);
  const { Paragraph,Title } = Typography;
  const { Meta } = Card;
  const { TextArea } = Input;
  // Creating a form instance using Ant Design's Form hooks for managing form state and validation
  const [form] = Form.useForm();
  // State for the list of companies
  const [companyList, setCompanyList] = useState([]);
  const [saving, setSaving] = useState(false);
 // useEffect hook to trigger fetching companies when the component mounts
  useEffect(() => {
    fetchCompanys();
  }, []);
// Function to fetch company data from the API
    const fetchCompanys = async () => {
      setLoading(true);
      try {
        const data = await CompanyService.getCompany();  // Make an API call to fetch company data
        setCompanyList(data); // Update the company list state with the fetched data
      } catch (error) { // If an error occurs, log it and show an error message
        console.error('Error fetching companys:', error);
        message.error('Failed to load companys');
      } finally {
        setLoading(false);
      }
    };
 
  // State for storing the search query entered by the user
  const [searchQuery, setSearchQuery] = useState('');

  // Filter companies based on search query
  const filteredCompanies = companyList.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())|| // Filter by company name
  company.internPosition.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by intern position
  );
 // Function to open the modal with a specific type
  const openModal = (type, company = {}) => {
    setModalType(type);  // Set the modal type (either "add" or "edit")
    const formattedCompany = { // Format the company data to transform specific fields into bullet points
      ...company,
      jobResponsibility: transformToBulletPoints(company.jobResponsibility || ''),
      jobRequirement: transformToBulletPoints(company.jobRequirement || ''),
      benefitsOffered: transformToBulletPoints(company.benefitsOffered || ''),
    };
    setCurrentCompany(formattedCompany); // Set the current company data in the state
    form.setFieldsValue(formattedCompany); // Pre-fill the form with the formatted company data
    setIsModalOpen(true);  // Open the modal
  };
// Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset all form fields
  };
// Function to handle the submission of the form data
  const handleSubmit = async () => {
    try {
      const auth = getAuth(); // Get Firebase authentication instance
      const user = auth.currentUser; // Get the currently authenticated user
// Check if the user is authenticated
      if (!user) {
        message.error("User not authenticated");
        return;
      }
// Validate the form fields and retrieve the values
      const values = await form.validateFields();
      setSaving(true);
// Retrieve the ID token for the authenticated user
      const token = await user.getIdToken();
// Format the form values, converting bullet points back into plain text
      const formattedValues = {
        ...values,
        jobResponsibility: formatBulletsToText(values.jobResponsibility),
        jobRequirement: formatBulletsToText(values.jobRequirement),
        benefitsOffered: formatBulletsToText(values.benefitsOffered),
      };
// Determine whether to add or update a company based on the modal type
      if (modalType === 'add') {
        await CompanyService.addCompany(formattedValues, token); // Add a new company
        message.success('Company added successfully');
      } else if (modalType === 'edit') {
        await CompanyService.updateCompany(currentCompany.id, formattedValues, token); // Update an existing company
        message.success('Company updated successfully');
      }
// Refresh the company list after the operation
      fetchCompanys();
      closeModal();
    } catch (error) {  // Handle errors during the add or update operation
      console.error(`Error ${modalType === 'add' ? 'adding' : 'updating'} company:`, error);
      message.error(`Failed to ${modalType === 'add' ? 'add' : 'update'} company`);
    }finally {
      setSaving(false);
    }
  };


const transformToBulletPoints = (text) => {
  if (!text) return '';
  // Split by newline and add bullet points
  return text.split('\n').map(line => {
    // Check if the line already starts with a bullet point (ignore leading spaces)
    if (line.trim().startsWith('•')) {
      return line; // Return the line as is if it already starts with a bullet point
    }
    return `• ${line.trim()}`; // Otherwise, add a bullet point at the beginning of the line
  }).join('\n');
};
// Function to format text by removing bullet points (•) from each line
const formatBulletsToText = (text) => {
  if (!text) return ''; // Return an empty string if the input is not text
  return text
    .split('\n')  // Split the text into lines
    .map(line => line.replace(/^•\s*/, '')) // Remove the bullet point (•) and any leading space
    .join('\n'); // Join the lines back into a single string
};
// Function to handle the deletion of a company
const handleDelete = async (key) => {

    const auth = getAuth(); // Get Firebase authentication instance
    const user = auth.currentUser;  // Get the currently authenticated user
  // Check if the user is authenticated
        if (!user) {
          message.error("User not authenticated");
          return;
        }
 // Show a confirmation modal before proceeding with the deletion
    Modal.confirm({
      title: 'Are you sure you want to delete this company?',
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
      onOk: async () => { // Action to perform when "Delete" is confirmed
              try {
                const token = await user.getIdToken(); // Retrieve the user's ID token
                await CompanyService.deleteCompany(key, token); // Call the service to delete the company
                message.success("Company deleted successfully!");
                fetchCompanys();
              } catch (error) {
                console.error('Error deleting company:', error);
                message.error('Failed to delete company');
              }
            },
      onCancel() { // Log a message when deletion is cancelled
        console.log("Delete cancelled");
      },
    });
     // Close the delete modal after deletion
     closeModal();
  };
// Function to handle changes in a textarea field and add bullet points to non-empty lines
  const handleTextAreaChange = (field, event) => {
    const value = event.target.value; // Get the value from the event
     // Function to add bullet points to each non-empty line
    const addBulletPoints = (text) => {
      if (!text) return '';
      return text
        .split('\n')
        .map((line) => {
          // Add a bullet only if the line is not empty and does not already have one
          if (line.trim() && !line.trim().startsWith('•')) {
            return `• ${line.trim()}`;
          }
          return line; // Keep the line as-is if it's empty or already has a bullet
        })
        .join('\n');
    };
  
    form.setFieldsValue({ [field]: value }); // Update the form field first
    const updatedValue = addBulletPoints(value); // Apply bullet points to the value
    
    // Only apply bullet points if the value has changed
    if (updatedValue !== value) {
      form.setFieldsValue({ [field]: updatedValue });
    }
  };
// Loading state - Display a spinner while data is being loaded
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  } 


  return (
    <div className="company-manage-page">
     {/* Background section with a header and search bar */}
      <div className="background-picture">
      <h1 className="management-title">Start your journey here</h1>
     {/* Search bar container */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by company name or internship position..."
          value={searchQuery}  // Bind input value to the search query state
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state on input change
        />
      </div>
      </div>
      {/* Header section with subtitle and "Add Company" button */}
      <div className="header-container">
      <div className="company-subtitle">
        <Title level={2}>Your Dream Internship Awaits</Title>
        <p>Start your professional journey with the best companies in the industry.</p>
      </div>
      <AntButton type="primary" className="company-add-button" icon={<PlusOutlined />} onClick={() => 
          openModal('add')
        }>
                Add Company
              </AntButton>
              </div>
      {/* Company list section */}
      <div className="company-list">
        <div className="company-cards">
          {/* Show message if no companies match the search query */}
          {filteredCompanies.length === 0 ? (
            <p>No companies found.</p>
          ) : (  // Map over the filtered company list and render each as a card
            filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="company-card"
                hoverable
                cover={<img alt={company.name} src={company.logo} className="company-logo" />}
              > {/* Card content */}
                <div className="card-content">
                <Meta title={<div className="company-name">{company.name}</div>}
                 description={<div className="position">{company.internPosition}</div>}/>
                </div> {/* Button container for "Edit" and "Delete" actions */}
                <div className="button-container">
                  <Button
                    text="Edit"
                    onClick={() => {
                      openModal('edit', company); // Open the modal for editing with company data
                    }}
                    icon={<EditOutlined />}
                    styleClass="edit-button"
                  />
                  <Button
                    text="Delete"
                    onClick={() => {
                      handleDelete(company.id); // Call the delete function with the company ID
                    }}
                    icon={<DeleteOutlined />}
                    styleClass="delete-button"
                  />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Add/Edit Modal */}
      <Modal  
        className="company-manage-modal"
        title={<span className="modal-title-custom">{modalType === 'add' ? 'Add New Company' : 'Edit Company'}</span>}
        visible={isModalOpen} // Controls the modal's visibility
        onCancel={closeModal}  // Closes the modal when cancel button is clicked
        onOk={handleSubmit}  // Submits the form when OK button is clicked
        okText={modalType === 'add' ? 'Add' : 'Save'} // Dynamic text for the OK button
        cancelText="Cancel"
        okButtonProps={{ className: 'save_button', loading: saving,disabled:saving}}
        cancelButtonProps={{ className: 'cancel_button',disabled:saving }}
        style={{ top: 50 }}
        width={800}
      > {/* Form for managing company details */}
        <Form layout="vertical" className="company-manage-form" form={form}>
          <Form.Item label="Logo" name="logo" rules={[{ required: true, message: 'Please input the logo URL!' }]}>
            <Input placeholder="Enter image URL" />
          </Form.Item>
          <Form.Item label="Company Name" name="name" rules={[{ required: true, message: 'Company name is required!' }]}>
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item label="Intern Position" name="internPosition" rules={[{ required: true, message: 'Intern position is required!' }]}>
            <Input placeholder="Enter intern position" />
          </Form.Item>
          <Form.Item label="Company Detail" name="companyDetail" rules={[{ required: true, message: 'Company detail is required!' }]} style={{ marginBottom: "157px" }}>
            <Input.TextArea rows={7} placeholder="Enter company details" />
          </Form.Item>
          <Form.Item label="Job Responsibilities" name="jobResponsibility" style={{ marginBottom: "157px" }}>
            <Input.TextArea rows={7} placeholder="Enter job responsibilities" onChange={(e) => handleTextAreaChange('jobResponsibility', e)}/>
          </Form.Item>
          <Form.Item label="Job Requirements" name="jobRequirement" style={{ marginBottom: "157px" }}>
            <Input.TextArea rows={7} placeholder="Enter job requirements" onChange={(e) => handleTextAreaChange('jobRequirement', e)}/>
          </Form.Item>
          <Form.Item label="Benefits Offered" name="benefitsOffered" style={{ marginBottom: "157px" }}>
            <Input.TextArea rows={7} placeholder="Enter benefits offered" onChange={(e) => handleTextAreaChange('benefitsOffered', e)}/>
          </Form.Item>
          <Form.Item label="HR Email" name="hrEmail" rules={[{ required: true, message: 'HR email is required!' }]}>
            <Input type="email" placeholder="Enter HR email" />
          </Form.Item>
        </Form>
      </Modal>
 
    </div>
  );
};
export default CompanyManagePage;
