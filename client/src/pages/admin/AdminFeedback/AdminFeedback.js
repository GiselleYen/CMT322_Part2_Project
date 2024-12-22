import React, { useState } from "react";
import { Divider, Row, Col, Card, Button, Tag, Select, Space, Pagination } from "antd";
import { CheckCircleOutlined, MessageOutlined, SortAscendingOutlined, SortDescendingOutlined, FileDoneOutlined, FileTextOutlined, ExceptionOutlined } from "@ant-design/icons";
import './AdminFeedback.css';

const FeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState([
    {
      key: 1,
      email: "wenping@student.usm.my",
      feedback: "Can you add more fantastic features? ",
      submissionDateTime: "2024-11-28 10:30 AM",
      status: "Not Done",
    },
    {
      key: 2,
      email: "yensan@student.usm.my",
      feedback: "Where can I get the event link?",
      submissionDateTime: "2024-11-27 3:15 PM",
      status: "Not Done",
    },
    {
      key: 3,
      email: "weien@student.usm.my",
      feedback: "Thanks for the spotlight! It's really helpful for me!!",
      submissionDateTime: "2024-11-23 2:45 PM",
      status: "Done",
    },
    {
      key: 4,
      email: "wenyee@student.usm.my",
      feedback: "I'm wish to explore more companies and internship opportunities!",
      submissionDateTime: "2024-11-21 1:55 PM",
      status: "Not Done",
    },
    {
      key: 5,
      email: "weien@student.usm.my",
      feedback: "Will this event be recorded and shared with us? If yes, where we can get the recording?",
      submissionDateTime: "2024-11-27 6:45 PM",
      status: "Done",
    },
  ]);

  const [sortedData, setSortedData] = useState(feedbackData);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Set the number of items per page

  // Calculate statistics
  const calculateStatistics = (data) => {
    const totalFeedback = data.length;
    const feedbackDone = data.filter((feedback) => feedback.status === "Done").length;
    const feedbackNotDone = totalFeedback - feedbackDone;

    return { totalFeedback, feedbackDone, feedbackNotDone };
  };

  const { totalFeedback, feedbackDone, feedbackNotDone } = calculateStatistics(feedbackData);

  // Handle Sorting
const handleSort = (order) => {
  const sorted = [...sortedData].sort((a, b) => {
    const dateA = new Date(a.submissionDateTime);
    const dateB = new Date(b.submissionDateTime);
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
  setSortedData(sorted);
  setSortOrder(order);
  setCurrentPage(1); // Reset to the first page
};

// Handle Filtering
const handleFilter = (value) => {
  setStatusFilter(value);
  const filteredData = value === "All" ? feedbackData : feedbackData.filter((feedback) => feedback.status === value);

  if (sortOrder) {
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.submissionDateTime);
      const dateB = new Date(b.submissionDateTime);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortedData(sorted);
  } else {
    setSortedData(filteredData);
  }
  setCurrentPage(1); // Reset to the first page
};

  const handleReply = (email, feedback) => {
    const template = `Hello,

  Thank you for your feedback. We’ve reviewed your input and would like to address your suggestions:

  Your feedback:
  "${feedback}"

  [Insert response here]

  Best regards,  
  CS Society`;

    const encodedTemplate = encodeURIComponent(template);
    window.location.href = `mailto:${email}?subject=Response to VCSIRF Feedback&body=${encodedTemplate}`;
  };

  const handleMarkAsDone = (key) => {
    // Update the feedback status to "Done"
    const updatedData = feedbackData.map((item) =>
      item.key === key ? { ...item, status: "Done" } : item
    );

    setFeedbackData(updatedData);
    setSortedData(updatedData);
  };

  // Pagination: slice the data based on current page and page size
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-feedback-page">
      <Divider>
        <h2 className="feedback-title">User Feedback</h2>
      </Divider>

      {/* Statistics Section using Cards */}
      <Row gutter={[16, 16]} className="statistics-container" style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card className="stat-card" bordered={false} style={{ height: '100%' }}>
            <Row align="middle">
              <Col>
                <FileTextOutlined style={{ fontSize: "42px", color: "#1e0250" }} />
              </Col>
              <Col style={{ marginLeft: "20px" }}>
                <h3>Total Feedback</h3>
                <p>{totalFeedback}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card" bordered={false} style={{ height: '100%' }}>
            <Row align="middle">
              <Col>
                <FileDoneOutlined style={{ fontSize: "42px", color: "#1e0250" }} />
              </Col>
              <Col style={{ marginLeft: "20px" }}>
                <h3>Feedback Done</h3>
                <p>{feedbackDone}</p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card" bordered={false} style={{ height: '100%' }}>
            <Row align="middle">
              <Col>
                <ExceptionOutlined style={{ fontSize: "42px", color: "#1e0250" }} />
              </Col>
              <Col style={{ marginLeft: "20px" }}>
                <h3>Feedback Not Done</h3>
                <p>{feedbackNotDone}</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Filter & Sort Controls */}
      <Divider orientation="right">
        <div className="filter-sort-controls" style={{ marginBottom: 20 }}>
          <Space>
            <Select
              defaultValue="All"
              style={{ width: 120 }}
              onChange={handleFilter}
            >
              <Select.Option value="All">All Statuses</Select.Option>
              <Select.Option value="Done">Done</Select.Option>
              <Select.Option value="Not Done">Not Done</Select.Option>
            </Select>

            <Button
              className="sort_button"
              icon={sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => handleSort(sortOrder === "asc" ? "desc" : "asc")}
            >
              Sort by Date
            </Button>
          </Space>
        </div>
      </Divider>

      {/* Feedback Cards */}
      <Row gutter={[16, 16]}>
        {paginatedData.map((feedback) => (
          <Col span={8} key={feedback.key}>
            <Card
              hoverable
              title={`From ${feedback.email}`}
              bordered={false}
              extra={
                <Tag color={feedback.status === "Done" ? "green" : "red"}>
                  {feedback.status}
                </Tag>
              }
              className="feedback-card"
            >
              <div className="feedback-card-content">
                <p className="feedback-text">{feedback.feedback}</p>
                <p>
                  <strong>Submitted on: </strong>
                  {feedback.submissionDateTime}
                </p>
              </div>
              <div className="feedback-card-actions">
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  className="reply_button"
                  onClick={() => handleReply(feedback.email, feedback.feedback)}
                >
                  Reply
                </Button>
                <Button
                  type="default"
                  className="cancel_button"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleMarkAsDone(feedback.key)}
                  disabled={feedback.status === "Done"}
                >
                  Mark as Done
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      <Pagination
        align="end"
        current={currentPage}
        pageSize={pageSize}
        total={sortedData.length}
        onChange={onPageChange}
        style={{ marginTop: 30}}
      />
    </div>
  );
};

export default FeedbackPage;
