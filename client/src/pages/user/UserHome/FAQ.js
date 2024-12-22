import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import './FAQ.css'; 

const items = [
    {
        key: '1',
        label: 'How do I reset my password?',
        children: "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your registered email.",
    },
    {
        key: '2',
        label: 'Where can I find the tips or hints for industrial training?',
        children: "For tips or hints about industrial training, you can refer to the 'Spotlight' section, where senior interns and professionals share valuable advice and industry insights.",
    },
    {
        key: '3',
        label: "How can I contact support?",
        children: "You can contact support by emailing cssociety@student.usm.my or using the 'Feedback' option in the navigation menu.",
    },
];

const FAQ = () => {
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
                    items={items}
                />
            </div>
        </div>
    );
};

export default FAQ;
