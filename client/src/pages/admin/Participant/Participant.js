import React, { useState, useEffect } from "react";
import { Divider, Table, Card, Row, Col, Spin } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { participantService } from '../../../services/Participant/participantService'; 
import './Participant.css';

const ParticipantPage = ({ isLoggedIn }) => {
  const [participantData, setParticipantData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalParticipants: 0,
    recentParticipants: 0
  });
  const [error, setError] = useState(null);

  // Fetch participants and statistics on component mount
  useEffect(() => {
    setLoading(true);
    const fetchParticipants = async () => {
      try {
        const data = await participantService.getParticipants();
        // Filter out the participant with the email "cssociety@student.usm.my"
        const filteredData = data.filter(participant => participant.email !== "cssociety@student.usm.my");
        setParticipantData(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatistics = async () => {
      try {
        const stats = await participantService.getStatistics();
        setStatistics(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
    fetchStatistics();

  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Matric Number",
      dataIndex: "matricNumber",
      key: "matricNumber",
    },
    {
      title: "Year of Study",
      dataIndex: "yearOfStudy",
      key: "yearOfStudy",
      sorter: (a, b) => {
        // Check if yearOfStudy exists and split the value, otherwise default to 0
        const yearA = a.yearOfStudy ? parseInt(a.yearOfStudy.split(" ")[1]) : 0;
        const yearB = b.yearOfStudy ? parseInt(b.yearOfStudy.split(" ")[1]) : 0;
        return yearA - yearB;
      },
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      sorter: (a, b) => {

        // Convert DD/MM/YYYY to YYYY-MM-DD format
        const convertToDate = (dateString) => {
          const [day, month, year] = dateString.split('/');
          return new Date(`${year}-${month}-${day}`);
        };
    
        // Convert the registration dates to Date objects
        const dateA = a.registrationDate ? convertToDate(a.registrationDate) : new Date(0);
        const dateB = b.registrationDate ? convertToDate(b.registrationDate) : new Date(0);
    
        // Return the comparison result for sorting
        return dateA - dateB;
      },
    }
  ];

  if (!isLoggedIn) {
    return <div className='login-alert'><h5>Please log in to view the content.</h5></div>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="participant-page">
      <Divider>
        <h2 className="participant-title">Participant Listing</h2>
      </Divider>
      
      <Row gutter={[16, 16]} className="statistics-container">
        <Col span={12}>
            <Card className="stat-card" style={{ height: '100%' }}>
              <Row align="middle">
                <Col>
                  <UserOutlined style={{ fontSize: "42px", color: "#1e0250" }} />
                </Col>
                <Col style={{ marginLeft: "20px" }}>
                  <h3>Total Participants</h3>
                  <p>{statistics.totalParticipants}</p>
                </Col>
              </Row>
            </Card>
        </Col>
        
        <Col span={12}>
            <Card className="stat-card" style={{ height: '100%' }}>
              <Row align="middle">
                <Col>
                  <CalendarOutlined style={{ fontSize: "42px", color: "#1e0250" }} />
                </Col>
                <Col style={{ marginLeft: "20px" }}>
                  <h3>New Participants (Last 7 Days)</h3>
                  <p>{statistics.recentParticipants}</p>
                </Col>
              </Row>
            </Card>
        </Col>
      </Row>

      <Table
        className="participant-table"
        dataSource={participantData} // Updated to use filtered data
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(record) => record.email} // Add this line to use a unique key for each row
      />
    </div>
  );
};

export default ParticipantPage;
