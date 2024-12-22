import React, { useState,useRef,useEffect } from 'react';
import './Company.css';
import Button from '../../../components/button/button';
import {Modal, Form, Input,Card, Button as AntButton,Typography, Title,message} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined  } from "@ant-design/icons";



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
    hrEmail: '',
    logo: ''
   // linkedin:''
  });
  const { Paragraph,Title } = Typography;
  const { Meta } = Card;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm(); // Separate form instance for Add Modal
  // State for the list of companies
  const [companyList, setCompanyList] = useState([
    { 
      id: 1, 
      name: 'AMD', 
      companyDetail: 'AMD is the high performance and adaptive computing leader, powering the products and services that help solve the world\'s most important challenges. Our technologies advance the future of the data center, embedded, gaming and PC markets.\
\n\nFounded in 1969 as a Silicon Valley start-up, the AMD journey began with dozens of employees who were passionate about creating leading-edge semiconductor products. AMD has grown into a global company setting the standard for modern computing, with many important industry firsts and major technological achievements along the way.', 
      internPosition: 'System Design Engineer Intern',
      jobResponsibility: 'AMD is looking for a highly talented intern to join our Datacenter GPU Engineering System Design & Enablement team to learn up key technical activity in AI data center business.\
\nThis role will work closely with customer system design engineering team who are deeply involved on developing AMD Instinct based systems.\
\nThis engineer will work with validation and our customers during critical issue escalations and help get issues resolved in time to meet product development or sustaining milestones. ',
      jobRequirement: 'Experience with Linux kernel debugging\
\nExperience with Python/Shell scripting and C\
\nStrong problem-solving skills\
\nGood written and oral communication skills\
\nTeam player with strong interpersonal skills',
      benefitsOffered: 'Free snacks\
      \nGym membership.',
      hrEmail: 'hr@company1.com',
      logo: 'https://logos-world.net/wp-content/uploads/2020/03/AMD-Symbol.png',
    //  linkedin: 'https://www.linkedin.com/company/amd/?originalSubdomain=my'
    },
    { 
      id: 2, 
      name: 'ASE', 
      companyDetail: 'ASE Malaysia is a subsidiary of ASE Inc.*, the world\'s leading provider of semiconductor manufacturing services in assembly and test. We are committed to helping our customers succeed in the dynamic semiconductor market by providing them with transformative technologies, breakthrough innovations, and advanced development programs.\
*ASE Inc. is a member of ASE Technology Holding Co., Ltd. ', 
      internPosition: 'MIS (Management Info System)',
      jobResponsibility: 'Assist in manage the data in database',
      jobRequirement: 'Basic understanding of IT systems.\nDegree in related Computer Science and Information Management-related Fields\
      \nMust be able to converse in English and Mandarin is an added advantage.\
      \nPossess basic knowledge and skills in information technology, computer, and networking.',
      benefitsOffered: 'Annual performance review & increment\nComprehensive health & insurance coverage\
      \nSubsidized meal at in house cafeteria\nMulti level car park\nTools to work anywhere example laptops for eligible employees\nEmployees privilege program',
      hrEmail: 'hr@company2.com',
      logo: 'https://th.bing.com/th/id/OIP.4E2877c_zK2DDn0OFcrTswHaHT?rs=1&pid=ImgDetMain',
     // linkedin: 'https://www.linkedin.com/company/ase-electronics-m-sdn-bhd/'
    },
    { 
      id: 3, 
      name: 'Intel', 
      companyDetail: 'We create world-changing technology that improves the life of every person on the planet.\
\n\nIntel put the silicon in Silicon Valley. For more than 50 years, Intel and our people have had a profound influence on the world, driving business and society forward by creating radical innovation that revolutionizes the way we live.\
\n\nToday we are applying our reach, scale, and resources to enable our customers to capitalize more fully on the power of digital technology. Inspired by Moore’s Law, we continuously work to advance the design and manufacturing of semiconductors to help address our customers\' greatest challenges.', 
      internPosition: 'Full Stack Software Engineer',
      jobResponsibility: 'Designs, develops, tests, debugs and deploy software applications used by end users or integrated with other applications within manufacturing ecosystem.\
\nDevelopment spans the full application stack including both frontend and backend application development.\
\nUses modern software development methodologies and programming languages, follows secure coding practices and software legal compliance guidelines, analyzes user stories, writes both functional and test code, automates build and deployment, and performs unit integration and end to end testing of applications or systems.\
\nSolution develops with reusable software components, scalable framework and platform.\
\nWork closely with cross-functional teams to integrate solution with existing manufacturing systems, ensuring that the solutions are scalable, reliable, deliver tangible results and transform operations.\
\nCompletes SDL tasks, document development processes and maintain comprehensive records of codebases as well as procedures for installation and maintenance. Interact with end users to define system requirements and/or necessary modifications.\
\nStay abreast of the latest advancements in software development, and evaluate their applicability to the manufacturing processes and ecosystems.',
      jobRequirement: 'You must possess the below minimum qualifications to be initially considered for this position. Preferred qualifications are in addition to the minimum requirements and are considered a plus factor in identifying top candidates. Experience would be obtained through a combination of prior education level classes, and current level school classes, projects, research and relevant previous job and/or internship experience.',
      benefitsOffered: 'We offer a total compensation package that ranks among the best in the industry. It consists of competitive pay, stock, bonuses, as well as, benefit programs which include health, retirement, and vacation. ',
      hrEmail: 'hr@techinnovators.com',
      logo: 'https://th.bing.com/th/id/R.8e8e5d3e0b38ecd0688082625bbf1591?rik=KXVMRQZ4DisUpA&riu=http%3a%2f%2fpurepng.com%2fpublic%2fuploads%2flarge%2fpurepng.com-intel-logologobrand-logoiconslogos-251519939644r68ft.png&ehk=jBzDgPyZuKWPCApTheGKUI2UkgluVE%2bhStxECioQ3lg%3d&risl=&pid=ImgRaw&r=0',
    //  linkedin: 'https://www.linkedin.com/company/intel-corporation/'
    }
  ]);
 

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter companies based on search query
  const filteredCompanies = companyList.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())||
  company.internPosition.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const fileInputRef = useRef(null);
  // Open the modal to view company details
  const openCompanyDetails = (company) => {
    setCurrentCompany(company);
    setIsModalOpen(true);
  };

  // Open the Edit Modal and populate with company data
  const openEditModal = (company) => {
    setCurrentCompany(company);
    setIsEditModalOpen(true);
  };

    // Open Delete Confirmation Modal
   // const openDeleteModal = (company) => {
//      setCurrentCompany(company);
      //setIsDeleteModalOpen(true);
 //   };

// Update form values when currentCompany changes
useEffect(() => {
  if (isEditModalOpen && currentCompany) {
    form.setFieldsValue(currentCompany);  // Update form fields with currentCompany data
  }
}, [isEditModalOpen, currentCompany, form]);

  // Close all modals
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input field
    }
  };
  // Handle input changes in the Edit and Add form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value
    }));
  };

// Handle file input change for logo
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentCompany((prevCompany) => ({
        ...prevCompany,
        logo: reader.result // store base64 image data
      }));
    };
    reader.readAsDataURL(file);
  }
};

{/*const handleTextAreaKeyDown = (e, fieldName) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent the default Enter key behavior (new line)
    const currentValue = currentCompany[fieldName] || ""; // Get current field value
    const updatedValue = currentValue + (currentValue.trim() ? "\n• " : "• "); // Add bullet point to new line
    setCurrentCompany((prev) => ({ ...prev, [fieldName]: updatedValue })); // Update field value in state
  }
};*/}

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

  // Handle the form submission for editing the company
  const handleEditSubmit = (event) => {
    event.preventDefault();
    {/*setCompanyList((prevList) =>
      prevList.map((company) =>
        company.id === currentCompany.id ? { ...company, ...currentCompany } : company
      )
    );*/}
    form.validateFields().then((values)=>{
     // Convert bullet points to plain text before saving
  const formatBulletsToText = (text) => {
    return text
      .split('\n')
      .map((line) => line.replace(/^•\s*/, '')) // Remove bullets
      .join('\n');
  };


  // Create a new company object with formatted fields
  const updatedCompany = {
    ...currentCompany,
    jobResponsibility: formatBulletsToText(currentCompany.jobResponsibility),
    jobRequirement: formatBulletsToText(currentCompany.jobRequirement),
    benefitsOffered: formatBulletsToText(currentCompany.benefitsOffered),
  };

  // Update the company list with the modified company details
  setCompanyList((prevList) =>
    prevList.map((company) =>
      company.id === currentCompany.id ? { ...company, ...updatedCompany } : company
    )
  );
  message.success('Company updated successfully');
    closeModal(); // Close both modals
})
.catch((error)=>{
  console.log('Form validation failed:', error);
  message.error('Please fill in all required fields.');
});
  };

  // Handle the form submission for adding a new company
  const handleAddSubmit = (event) => {
    event.preventDefault();
    formAdd.validateFields()
    .then((values) => {
      // Function to convert bullet points to plain text
  const formatBulletsToText = (text) => {
    return text
      .split('\n')
      .map((line) => line.replace(/^•\s*/, '')) // Remove bullets from each line
      .join('\n');
  };
    {/*const newCompany = { ...currentCompany, id: companyList.length+1 };*/} // Give it a unique ID
    const newCompany = {
      ...currentCompany,
      jobResponsibility: formatBulletsToText(currentCompany.jobResponsibility),
      jobRequirement: formatBulletsToText(currentCompany.jobRequirement),
      benefitsOffered: formatBulletsToText(currentCompany.benefitsOffered),
      id: companyList.length + 1, // Give it a unique ID
    };
    setCompanyList((prevList) => [...prevList, newCompany]); // Add new company to list
    setCurrentCompany({ id: null, name: '', companyDetail: '', internPosition: '', jobResponsibility: '', jobRequirement: '', benefitsOffered: '',  hrEmail: '' , logo: ''/*linkedin: ''*/}); // Reset form
    console.log('Company ID:', newCompany.id);
    message.success('Event added successfully');
    form.resetFields();
    closeModal(); // Close the add modal
    formAdd.resetFields(); // Reset the form after submitting
  })
  .catch((error) => {
    console.log('Form validation failed:', error);
    message.error('Please fill in all required fields.');
  });
  };

  const handleDelete = (key) => {
    
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
      onOk() {
        // Perform the deletion
        setCompanyList((prevList) => {
          console.log('delete')
          // First, filter out the company to delete
          const newList = prevList.filter((company) => company.id !== key);
      
          // Then, shift the IDs of all companies whose ID is greater than the deleted ID
          return newList.map((company) => {
            if (company.id > key) {
              return { ...company, id: company.id - 1 }; // Decrease ID by 1
            }
            return company;
          });
        });
        message.success('Event deleted successfully');
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
     // Close the delete modal after deletion
     closeModal();
  };





  return (
    <div className="company-manage-page">
      <div className="background-picture">
      <h1 className="management-title">Start your journey here</h1>

      {/*<Button
        text="Add Company"
        onClick={() => {
          setCurrentCompany({ id: null, name: '', companyDetail: '', internPosition: '', jobResponsibility: '', jobRequirement: '', benefitsOffered: '', logo: '', hrEmail: '' });
          setIsAddModalOpen(true);
        }}
        styleClass="add-button"
      />*/}

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
      <AntButton type="primary" className="company-add-button" icon={<PlusOutlined />} onClick={() => {
          setCurrentCompany({ id: null, name: '', companyDetail: '', internPosition: '', jobResponsibility: '', jobRequirement: '', benefitsOffered: '', logo: '', hrEmail: ''/*linkedin: ''*/ });
          setIsAddModalOpen(true);
        }}>
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
                onClick={() => openCompanyDetails(company)}
              >
                <div className="card-content">
                <Meta title={<div className="company-name">{company.name}</div>}
                 description={<div className="position">{company.internPosition}</div>}/>
                </div>
                <div className="button-container">
                  <Button
                    text="Edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop propagation when clicking Edit button
                      openEditModal(company);
                    }}
                    icon={<EditOutlined />}
                    styleClass="edit-button"
                  />
                  <Button
                    text="Delete"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop propagation when clicking Delete button
        
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

      {/* Modal for viewing company details */}
      <Modal
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
      width={1000}
    >{/*<div className='modal-overlay'>*/}
      <div className="modal-container">
      {/*{currentCompany.logo && (
          <img src={currentCompany.logo} alt={currentCompany.name} className="modal-company-logo" />
        )}*/}
      {currentCompany.companyDetail && (
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
    <ul>
          {/* Split the string by newline character and map over it to create list items */}
          {currentCompany.jobResponsibility.split('\n').map((responsibilities, index) => (
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
    <ul>
          {/* Split the string by newline character and map over it to create list items */}
          {currentCompany.jobRequirement.split('\n').map((requirement, index) => (
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
    <ul>
          {/* Split the string by newline character and map over it to create list items */}
          {currentCompany.benefitsOffered.split('\n').map((benefit, index) => (
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
)}
{/*{currentCompany.linkedin && (
  <div>
    <strong className="company-modal-title">LinkedIn</strong>
    <Typography>
      <Paragraph>{currentCompany.linkedin}</Paragraph>
    </Typography>
  </div>
)}*/}
      </div>
      {/*</div>*/}
    </Modal>

      
      {/* Modal for editing company details */}
      <Modal
      className="company-manage-modal"
        title={<span className="modal-title-custom">{"Edit Company"}</span>}
        visible={isEditModalOpen}
        /*onVisibleChange={(visible) => {
          if (visible) {
            form.resetFields(); 
          }
        }}*/
        onOk={handleEditSubmit}
        onCancel={closeModal}
        okText="Save"
        cancelText="Cancel"
       // afterClose={() => form.resetFields()} // This ensures the form is reset when the modal is closed
        okButtonProps={{
          className: 'save_button', // Apply custom class to OK button (Save button)
        }}
        cancelButtonProps={{
          className: 'cancel_button', // Apply custom class to Cancel button
        }}
        style={{top:50}}
        width={800}
        
      >
        <Form  layout="vertical" style={{ padding: "20px" }} className="company-manage-form" form={form} initialValues={currentCompany}>
        <Form.Item label="Logo">
              <input type="file" ref={fileInputRef} onChange={handleLogoChange} />
          </Form.Item>
          <Form.Item 
          label="Company Name" 
          name="name" rules={[{ required: true, message: "Company name is required!" }]}>
            <Input
              name="name"
              value={currentCompany.name}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Intern Position" name="internPosition" rules={[{ required: true, message: "Intern position is required!" }]}>
            <Input
              name="internPosition"
              //value={currentCompany.internPosition}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Company Detail" style={{ marginBottom: "157px" }} name="companyDetail" rules={[{ required: true, message: "Company detail is required!" }]}>
            <Input.TextArea
              name="companyDetail"
              //value={currentCompany.companyDetail}
              onChange={handleInputChange}
              rows={7}
            />
          </Form.Item>
          <Form.Item label="Job Responsibilities" style={{ marginBottom: "157px" }}>
            <Input.TextArea
              name="jobResponsibility"
              value={transformToBulletPoints(currentCompany.jobResponsibility)}
              onChange={handleInputChange}
              rows={7}
              
            />
          </Form.Item>
          <Form.Item label="Job Requirements" style={{ marginBottom: "157px" }}>
            <Input.TextArea
              name="jobRequirement"
              value={transformToBulletPoints(currentCompany.jobRequirement)}
              onChange={handleInputChange}
              rows={7}

            />
          </Form.Item>
          <Form.Item label="Benefits Offered" style={{ marginBottom: "157px" }}>
            <Input.TextArea
              name="benefitsOffered"
            
              value={transformToBulletPoints(currentCompany.benefitsOffered)}
          
              onChange={handleInputChange}
              rows={7}

            />
          </Form.Item>
          <Form.Item label="HR Email" name="hrEmail" rules={[{ required: true, message: "HR email is required!" }]}>
            <Input
              type="email"
              name="hrEmail"
              //value={currentCompany.hrEmail}
              onChange={handleInputChange}
       
            />
          </Form.Item>
          {/*<Form.Item label="LinkedIn">
            <Input
              name="linkedin"
              value={currentCompany.linkedin}
              onChange={handleInputChange}
       
            />
          </Form.Item>*/}
          
              
              
        </Form>
      </Modal>

     
       {/* Modal for adding new company */}
       <Modal
       className="company-manage-modal"
        title={<span className="modal-title-custom">{"Add New Company"}</span>}
        visible={isAddModalOpen}
        onCancel={closeModal}
        onOk={handleAddSubmit}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{
          className: 'save_button', // Apply custom class to OK button (Save button)
        }}
        cancelButtonProps={{
          className: 'cancel_button', // Apply custom class to Cancel button
        }}
        style={{top:50}}
        width={800}
        
      >
        
        <Form layout="vertical" className="company-manage-form" style={{ padding: "20px" }} form={formAdd}> 
        <Form.Item label="Logo" >
              <input type="file" ref={fileInputRef} onChange={handleLogoChange} />
          </Form.Item>
          <Form.Item label="Company Name" name="add-company-name" rules={[{ required: true, message: "Company name is required!" }]}>
            <Input
              name="name"
              value={currentCompany.name}
              onChange={handleInputChange}
          
            />
          </Form.Item>
          <Form.Item label="Intern Position" name="add-company-intern" rules={[{ required: true, message: "Intern position is required!" }]}>
            <Input
              name="internPosition"
              value={currentCompany.internPosition}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Company Detail" style={{ marginBottom: "157px" }} name="add-company-detail" rules={[{ required: true, message: "Company detail is required!" }]}>
            <Input.TextArea
              name="companyDetail"
              value={currentCompany.companyDetail}
              onChange={handleInputChange}
              rows={7}
              
            />
          </Form.Item>
          <Form.Item label="Job Responsibilities" style={{ marginBottom: "157px" }}>
            <Input.TextArea
              name="jobResponsibility"
              value={transformToBulletPoints(currentCompany.jobResponsibility)}
              onChange={handleInputChange}
              rows={7}
            />
          </Form.Item>
          <Form.Item label="Job Requirements" style={{ marginBottom: "157px" }}>
            <Input.TextArea
              name="jobRequirement"
              value={transformToBulletPoints(currentCompany.jobRequirement)}
              onChange={handleInputChange}
              rows={7}
            />
          </Form.Item>
          <Form.Item label="Benefits Offered" style={{ marginBottom: "157px" }}>
            <Input.TextArea
              name="benefitsOffered"
              value={transformToBulletPoints(currentCompany.benefitsOffered)}
              onChange={handleInputChange}
              rows={7}
            />
          </Form.Item>
          <Form.Item label="HR Email" name="add-hr-detail" rules={[{ required: true, message: "HR email is required!" }]}>
            <Input
              type="email"
              name="hrEmail"
              value={currentCompany.hrEmail}
              onChange={handleInputChange}
            />
          </Form.Item>
          
          {/*<Form.Item label="LinkedIn">
            <Input
              name="linkedin" // Updated to match the value prop
              value={currentCompany.linkedin}
              onChange={handleInputChange}
       
            />
          </Form.Item>*/}
     
        </Form>
      </Modal>
      {/* Modal for confirming company deletion */}
    
        {/*<Modal
        title={`Confirm Deletion`}
        visible={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={closeModal}
        okText="Delete"
        cancelText="Cancel"
        style={{top:50}}
      
        okButtonProps={{
          className: 'delete-confirm-button', // Apply custom class to OK button (Save button)
        }}
        cancelButtonProps={{
          className: 'cancel_button', // Apply custom class to Cancel button
        }}
        
      > <p>Are you sure to delete {currentCompany.name}?</p></Modal>*/}
      
    </div>
  );
};

export default CompanyManagePage;
