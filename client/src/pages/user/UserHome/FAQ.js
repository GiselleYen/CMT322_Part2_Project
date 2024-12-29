import React, { useEffect, useState } from 'react';
import { Collapse, Spin, message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import './FAQ.css'; 
import { auth } from '../../../config/firebase';
import { faqService } from "../../../services/Dashboard/faqService";

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);  // To manage loading state

    useEffect(() => {
        // Fetch FAQs from the backend
        const fetchFaqs = async () => {
            try {
                const data = await faqService.getFaqs();  // Assuming this makes a GET request to the backend
                setFaqs(data);
            } catch (error) {
                message.error('Failed to load FAQs');
                console.error(error);
            } finally {
                setLoading(false);  // Set loading to false once the request is complete
            }
        };

        fetchFaqs();
    }, []);  // Empty array ensures this runs once when the component is mounted

    if (loading) {
        return <Spin size="large" />;  // Show a loading spinner while fetching data
    }

    return (
        <div className="faq-container">
            <div className="wave-divider">
            <svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,0 L0,0 Z" fill="#1e0250"/>
            </svg>
            </div>
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-collapse">
                <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    ghost
                >
                    {faqs.map(faq => (
                        <Collapse.Panel header={faq.question} key={faq.id}>
                            <p>{faq.answer}</p>
                        </Collapse.Panel>
                    ))}
                </Collapse>
            </div>
        </div>
    );
};

export default FAQ;
