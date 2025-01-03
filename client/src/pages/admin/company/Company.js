import React, { useState,useRef,useEffect } from 'react';
import './Company.css';
import Button from '../../../components/button/button';
import {Modal, Form, Input,Card, Button as AntButton,Typography, Title,message,Spin} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined  } from "@ant-design/icons";
import { getAuth } from 'firebase/auth';
import { CompanyService } from "../../../services/Company/CompanyService";

const CompanyManagePage = () => {
  // States for managing modals and company data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for showing company details
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal for editing company
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal for adding new company
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal for confirming deletion
  const [currentCompany, setCurrentCompany] = useState({
    id: null,
    name: '',
    companyDetail: '',
    internPosition: '',
    jobResponsibility: '',
    jobRequirement: '',
    benefitsOffered: '',
    logo: '',
    hrEmail: ''
  });
  const [modalType, setModalType] = useState(''); // "add" or "edit"
  const [loading, setLoading] = useState(false);
  const { Paragraph,Title } = Typography;
  const { Meta } = Card;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  // State for the list of companies
  const [companyList, setCompanyList] = useState([]);
 
  useEffect(() => {
    fetchCompanys();
  }, []);

    const fetchCompanys = async () => {
      setLoading(true);
      try {
        const data = await CompanyService.getCompany();
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching companys:', error);
        message.error('Failed to load companys');
      } finally {
        setLoading(false);
      }
    };
 
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter companies based on search query
  const filteredCompanies = companyList.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())||
  company.internPosition.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const openModal = (type, company = {}) => {
    setModalType(type);
    const formattedCompany = {
      ...company,
      jobResponsibility: transformToBulletPoints(company.jobResponsibility || ''),
      jobRequirement: transformToBulletPoints(company.jobRequirement || ''),
      benefitsOffered: transformToBulletPoints(company.benefitsOffered || ''),
    };
    setCurrentCompany(formattedCompany);
    form.setFieldsValue(formattedCompany);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        message.error("User not authenticated");
        return;
      }

      const values = await form.validateFields();
      const token = await user.getIdToken();

      const formattedValues = {
        ...values,
        jobResponsibility: formatBulletsToText(values.jobResponsibility),
        jobRequirement: formatBulletsToText(values.jobRequirement),
        benefitsOffered: formatBulletsToText(values.benefitsOffered),
      };

      if (modalType === 'add') {
        await CompanyService.addCompany(formattedValues, token);
        message.success('Company added successfully');
      } else if (modalType === 'edit') {
        await CompanyService.updateCompany(currentCompany.id, formattedValues, token);
        message.success('Company updated successfully');
      }

      fetchCompanys();
      closeModal();
    } catch (error) {
      console.error(`Error ${modalType === 'add' ? 'adding' : 'updating'} company:`, error);
      message.error(`Failed to ${modalType === 'add' ? 'add' : 'update'} company`);
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

const formatBulletsToText = (text) => {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => line.replace(/^•\s*/, ''))
    .join('\n');
};

  const handleDelete = async (key) => {

    const auth = getAuth();
        const user = auth.currentUser;
    
        if (!user) {
          message.error("User not authenticated");
          return;
        }

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
      onOk: async () => {
              try {
                const token = await user.getIdToken();
                await CompanyService.deleteCompany(key, token);
                message.success("Company deleted successfully!");
                fetchCompanys();
              } catch (error) {
                console.error('Error deleting company:', error);
                message.error('Failed to delete company');
              }
            },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
     // Close the delete modal after deletion
     closeModal();
  };

  const handleTextAreaChange = (field, event) => {
    const value = event.target.value;
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
    const updatedValue = addBulletPoints(value);
    
    // Only apply bullet points if the value has changed
    if (updatedValue !== value) {
      form.setFieldsValue({ [field]: updatedValue });
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
    <div className="company-manage-page">
      <div className="background-picture">
      <h1 className="management-title">Start your journey here</h1>

      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by company name or internship position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      </div>
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
      <div className="company-list">
        <div className="company-cards">
          {filteredCompanies.length === 0 ? (
            <p>No companies found.</p>
          ) : (
            filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="company-card"
                hoverable
                cover={<img alt={company.name} src={company.logo} className="company-logo" />}
                //onClick={() => openCompanyDetails(company)}
              >
                <div className="card-content">
                <Meta title={<div className="company-name">{company.name}</div>}
                 description={<div className="position">{company.internPosition}</div>}/>
                </div>
                <div className="button-container">
                  <Button
                    text="Edit"
                    onClick={() => {
                      //e.stopPropagation(); // Stop propagation when clicking Edit button
                      openModal('edit', company);
                    }}
                    icon={<EditOutlined />}
                    styleClass="edit-button"
                  />
                  <Button
                    text="Delete"
                    onClick={() => {
                      //e.stopPropagation(); // Stop propagation when clicking Delete button
        
                      handleDelete(company.id);
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
        visible={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText={modalType === 'add' ? 'Add' : 'Save'}
        cancelText="Cancel"
        okButtonProps={{ className: 'save_button' }}
        cancelButtonProps={{ className: 'cancel_button' }}
        style={{ top: 50 }}
        width={800}
      >
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


{/* Modal for viewing company details */}
{/*<Modal
title={
  <div 
    style={{ 
      color: 'var(--primary-color)', 
      fontSize: '24px', 
      fontWeight: 'bold', 
      textAlign: 'center',
      marginTop: '8px',
      marginBottom: '10px',
    }}
  >
    {currentCompany.name}
  </div>
}
visible={isModalOpen}
onCancel={closeModal}
footer={null} // Removing default footer buttons (you can add custom ones if needed)
style={{ top: 50}}
width={1000}*/}
//>{/*<div className='modal-overlay'>*/}
//<div className="modal-container">
{/*{currentCompany.logo && (
    <img src={currentCompany.logo} alt={currentCompany.name} className="modal-company-logo" />
  )}*/}
{/*{currentCompany.companyDetail && (
<div>
<strong className="company-modal-title">Company Information</strong>
<Typography>
<Paragraph>{currentCompany.companyDetail}</Paragraph>
</Typography>
</div>

)}

{currentCompany.jobResponsibility && (
<div>
<strong className="company-modal-title">Job Responsibilities</strong>
<Typography>
<ul>*/}
    {/* Split the string by newline character and map over it to create list items */}
    {/*{currentCompany.jobResponsibility.split('\n').map((responsibilities, index) => (
      <li key={index}>{responsibilities}</li> // Each benefit is rendered as a list item
    ))}
  </ul>
</Typography>
</div>
)}

{currentCompany.jobRequirement && (
<div>
<strong className="company-modal-title">Job Requirement/Qualification</strong>
<Typography>
<ul>*/}
    {/* Split the string by newline character and map over it to create list items */}
    {/*{currentCompany.jobRequirement.split('\n').map((requirement, index) => (
      <li key={index}>{requirement}</li> // Each benefit is rendered as a list item
    ))}
  </ul>
</Typography>
</div>
)}

{currentCompany.benefitsOffered && (
<div>
<strong className="company-modal-title">Benefits Offered</strong>
<Typography>
<ul>*/}
    {/* Split the string by newline character and map over it to create list items */}
    {/*{currentCompany.benefitsOffered.split('\n').map((benefit, index) => (
      <li key={index}>{benefit}</li> // Each benefit is rendered as a list item
    ))}
  </ul>
</Typography>
</div>
)}

{currentCompany.hrEmail && (
<div>
<strong className="company-modal-title">HR Email</strong>
<Typography>
<Paragraph>{currentCompany.hrEmail}</Paragraph>
</Typography>
</div>
)}*/}
{/*{currentCompany.linkedin && (
<div>
<strong className="company-modal-title">LinkedIn</strong>
<Typography>
<Paragraph>{currentCompany.linkedin}</Paragraph>
</Typography>
</div>
)}*/}
//</div>
{/*</div>*/}
//</Modal>