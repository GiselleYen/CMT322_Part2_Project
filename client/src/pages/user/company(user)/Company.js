import React, { useState } from 'react';
import './CompanyUser.css'; // Reuse the same CSS styles
import Button from '../../../components/button/button';
import {Card,Typography,Modal, Title} from 'antd'
//import { MailOutlined, LinkedinOutlined } from '@ant-design/icons'
const UserCompanyListPage = () => {
  // Example company data (you can imagine this data is fetched or passed as props)
  const [companyList] = useState([
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
      //linkedin: 'https://www.linkedin.com/company/amd/?originalSubdomain=my'
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
      //linkedin: 'https://www.linkedin.com/company/ase-electronics-m-sdn-bhd/'
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
      //linkedin: 'https://www.linkedin.com/company/intel-corporation/'
     }
  ]);
  const { Paragraph,Title } = Typography;
  const { Meta } = Card;

  // State for the modal and selected company
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({});

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

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

            {/* Company Information */}
           {/*} {currentCompany.logo && (
          <img src={currentCompany.logo} alt={currentCompany.name} className="user-modal-company-logo" />
        )}*/}
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

{/*{currentCompany.hrEmail && (
  <div>
    <strong className="user-company-modal-title">HR Email</strong>
    <Typography>
      <Paragraph>{currentCompany.hrEmail}</Paragraph>
    </Typography>
  </div>
)}*/}
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
          {/*<div className="company-modal-contact-info">
            <strong><a href={`mailto:${currentCompany.hrEmail}?subject=Internship Application&body=Dear HR,%0A%0AI am writting for the inquiry about this internship position / apply for this internship position?%0A%0AThank you!`} 
            target="_blank" rel="noopener noreferrer">
            <MailOutlined style={{ marginRight: 8 }} /> Email
              <br />
            </a></strong>
            <strong><a href={currentCompany.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedinOutlined style={{ marginRight: 8 }} />  LinkedIn
            </a></strong>{" "}
            </div>*/}
            
          </div>
        
        </Modal>
    </div>
  );
};

export default UserCompanyListPage;
