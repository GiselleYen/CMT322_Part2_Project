import React, { useState, useEffect } from "react";
import { Divider, Row, Col, Card, Button, Tag, Select, Space, Pagination, message, Spin } from "antd";
import { CheckCircleOutlined, MessageOutlined, SortAscendingOutlined, SortDescendingOutlined, FileDoneOutlined, FileTextOutlined, ExceptionOutlined } from "@ant-design/icons";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../../config/firebase"; // Ensure correct path to Firebase config
import "./AdminFeedback.css";

// Utility function (encode)
const encodeForMailto = (text) => encodeURIComponent(text.replace(/\r?\n/g, '%0A'));

const FeedbackPage = ({ isLoggedIn }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Set the number of items per page

  useEffect(() => {
    setLoading(true);
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const feedbackRef = collection(db, "feedback");
      const q = query(feedbackRef, orderBy("submissionDateTime", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        submissionDateTime: new Date(doc.data().submissionDateTime.seconds * 1000).toLocaleString(),
      }));
      setFeedbackData(data);
      setSortedData(data);
    } catch (error) {
      message.error("Failed to fetch feedback data: " + error.message);
    }finally {
      setLoading(false);
    }
  };

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
    const filteredData =
      value === "All" ? feedbackData : feedbackData.filter((feedback) => feedback.status === value);

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
    const handleReply = (email, feedback) => {
      const template = `Hello,
    
    Thank you for your feedback. We’ve reviewed your input and would like to address your suggestions:
    
    Your feedback:
    "${feedback}"
    
    [Insert response here]
    
    Best regards,
    CS Society`;
    
      // Use encodeURIComponent for the entire template
      const encodedTemplate = encodeURIComponent(template);
    
      // Construct the mailto link
      window.location.href = `mailto:${email}?subject=Response to VCSIRF Feedback&body=${encodedTemplate}`;
    };
    
  };
  

  const handleMarkAsDone = async (id) => {
    try {
      const feedbackDoc = doc(db, "feedback", id);
      await updateDoc(feedbackDoc, { status: "Done" });
      message.success("Feedback marked as done!");
      fetchFeedback(); // Refresh data after update
    } catch (error) {
      message.error("Failed to update feedback: " + error.message);
    }
  };

  //pagination
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

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
                <p>{feedbackData.length}</p>
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
                <p>{feedbackData.filter((item) => item.status === "Done").length}</p>
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
                <p>{feedbackData.filter((item) => item.status === "Not Done").length}</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Filter & Sort Controls */}
      <Divider orientation="right">
        <div className="filter-sort-controls" style={{ marginBottom: 20 }}>
          <Space>
            <Select defaultValue="All" style={{ width: 120 }} onChange={handleFilter}>
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
          <Col span={8} key={feedback.id}>
            <Card
              hoverable
              title={`From ${feedback.email}`}
              bordered={false}
              extra={
                <Tag color={feedback.status === "Done" ? "green" : "red"}>{feedback.status}</Tag>
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
                  onClick={() => handleMarkAsDone(feedback.id)}
                  disabled={feedback.status === "Done"}
                >
                  Mark as Done
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        align="end"
        current={currentPage}
        pageSize={pageSize}
        total={sortedData.length}
        onChange={onPageChange}
        style={{ marginTop: 30 }}
      />
    </div>
  );
};

export default FeedbackPage;
