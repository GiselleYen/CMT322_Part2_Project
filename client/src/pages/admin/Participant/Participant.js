import React, { useState } from "react";
import { Divider, Table, Card, Row, Col } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import './Participant.css';

const ParticipantPage = () => {

  const participantData = [
    {
      key: 1,
      name: "Soh Yen San",
      email: "yensan@student.usm.my",
      registrationDate: "2024-11-27",
      matricNo: "158339",
      year: "Year 3",
    },
    {
      key: 2,
      name: "Ng Wen Ping",
      email: "wenping@student.usm.my",
      registrationDate: "2024-11-26",
      matricNo: "158772",
      year: "Year 2",
    },
    {
      key: 3,
      name: "Yee Wei En",
      email: "weien@student.usm.my",
      registrationDate: "2024-11-23",
      matricNo: "157929",
      year: "Year 3",
    },
    {
      key: 4,
      name: "Wong Wen Yee",
      email: "wenyee@student.usm.my",
      registrationDate: "2024-11-20",
      matricNo: "159490",
      year: "Year 4",
    },
   
  ];

  // Calculate the number of participants in the last 7 days
  const recentParticipants = participantData.filter(
    (p) => new Date() - new Date(p.registrationDate) <= 7 * 24 * 60 * 60 * 1000
  ).length;

  // Calculate the number of participants 7-14 days ago
  const previousParticipants = participantData.filter(
    (p) => new Date() - new Date(p.registrationDate) > 7 * 24 * 60 * 60 * 1000 &&
           new Date() - new Date(p.registrationDate) <= 14 * 24 * 60 * 60 * 1000
  ).length;

  const totalParticipants = participantData.length;

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
      dataIndex: "matricNo",
      key: "matricNo",
    },
    {
        title: "Year of Study",
        dataIndex: "year",
        key: "year",
        sorter: (a, b) => {
          const yearA = parseInt(a.year.split(" ")[1]);
          const yearB = parseInt(b.year.split(" ")[1]);
          return yearA - yearB;
        },
      },
    {
        title: "Registration Date",
        dataIndex: "registrationDate",
        key: "registrationDate",
        sorter: (a, b) =>
          new Date(a.registrationDate) - new Date(b.registrationDate),
      },
  ];

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
                <UserOutlined style={{ fontSize: "42px", color: "#1e0250"}} />
                </Col>
                <Col style={{ marginLeft: "20px" }}>
                <h3>Total Participants</h3>
                <p>{totalParticipants}</p>
                </Col>
            </Row>
            </Card>
        </Col>
        
        <Col span={12}>
            <Card className="stat-card" style={{ height: '100%' }} >
            <Row align="middle">
                <Col>
                <CalendarOutlined style={{ fontSize: "42px", color: "#1e0250" }} />
                </Col>
                <Col style={{ marginLeft: "20px" }}>
                <h3>New Participants (Last 7 Days)</h3>
                <p>{recentParticipants}</p>
                </Col>
            </Row>
            </Card>
        </Col>
    </Row>


      <Table
        className="participant-table"
        dataSource={participantData}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ParticipantPage;
