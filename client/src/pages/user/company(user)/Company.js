import React, { useState,useEffect } from 'react';
import './CompanyUser.css'; // Reuse the same CSS styles
import Button from '../../../components/button/button';
import {Card,Typography,Modal, Title, message} from 'antd'
import { CompanyService } from "../../../services/Company/CompanyService";

const UserCompanyListPage = () => {

  const [companyList,setCompanyList] = useState([]);
  const { Paragraph,Title } = Typography;
  const { Meta } = Card;

  // State for the modal and selected company
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({});

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await CompanyService.getCompany();
      setCompanyList(data);
    } catch (error) {
      console.error('Error fetching companys:', error);
      message.error('Failed to load companys');
    } 
  };
  // Filter companies based on search query
  const filteredCompanies = companyList.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  company.internPosition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open the modal with company details
  const openCompanyDetails = (company) => {
    setCurrentCompany(company);
    setIsModalOpen(true); 
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
   // setCurrentCompany(null); 
  };

  // Handle applying to the company (opens email client)
  const handleApply = (email) => {
    window.location.href = `mailto:${email}?subject=Internship Application&body=Dear HR,%0A%0AI am writting for the inquiry about this internship position / apply for this internship position?%0A%0AThank you!`;
  };

  return (

    <div className="user-company-page">
       <div className="user-background-picture">
      <h1 className="user-page-title">Start your journey here</h1>

      {/* Search bar */}
      <div className="user-search-container">
        <input
          type="text"
          className="user-search-bar"
          placeholder="Search by company name or internship position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      </div>
      <div className="user-company-subtitle">
        <Title level={2}>Your Dream Internship Awaits</Title>
        <p>Start your professional journey with the best companies in the industry.</p>
      </div>
      {/* Company List */}
      <div className="user-company-list">
        <div className="user-company-cards">
          {filteredCompanies.length === 0 ? (
            <p>No companies found.</p>
          ) : (
            filteredCompanies.map((company) => (
              <Card
              key={company.id}
              className='user-company-card'
              hoverable
              cover={<img alt={company.name} src={company.logo} className="user-company-logo" />}
              //onClick={() => openCompanyDetails(company)}
            >
              <div className="user-card-content">
              <Meta title={<div className="user-company-name">{company.name}</div>}
               description={<div className="user-position">{company.internPosition}</div>}/>
              </div>
              
          <div className="user-button-container">
            <Button
            text="Read More"
            onClick={() => openCompanyDetails(company)}
            //styleClass="apply-button"
          />
            </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal for displaying company details */}
    
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
       style={{ top: 50}}
       width={1000}
       footer={null}>
        
          <div className="user-modal-container">


      {currentCompany.companyDetail && (
  <div>
    <strong className="user-company-modal-title">Company Information</strong>
    <Typography>
      <Paragraph>{currentCompany.companyDetail}</Paragraph>
    </Typography>
  </div>
)}

{currentCompany.jobResponsibility && (
  <div>
    <strong className="user-company-modal-title">Job Responsibilities</strong>
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
    <strong className="user-company-modal-title">Job Requirement/Qualification</strong>
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
    <strong className="user-company-modal-title">Benefits Offered</strong>
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

<div className="separator-line"></div>
<div className="user-inquiry-text">
  <Typography>
    <Paragraph>
    Got questions or ready to take the next step in your career? 🚀 Whether you're curious
      about the internship role or eager to apply, simply click the 'Apply Now' button to
      reach out to the HR team. We're excited to hear from you and help you start your journey with us!
    </Paragraph>
  </Typography>
</div>
{/* Apply Button (centered) */}
<div className='user-apply-button'>
  <Button
    text="Apply Now"
    onClick={() => handleApply(currentCompany.hrEmail)} // Trigger apply action
    //styleClass="apply-button"
  />
          </div>
     
            
          </div>
        
        </Modal>
    </div>
  );
};

export default UserCompanyListPage;
