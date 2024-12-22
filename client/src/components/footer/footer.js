import React from 'react';
import './footer.css';
import { FacebookOutlined, InstagramOutlined, LinkedinOutlined, TelegramOutlined, MailOutlined, TikTokOutlined } from '@ant-design/icons';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 CS Society. All rights reserved.</p>
        <div className="social-links">
          <a href="https://www.facebook.com/cs.usm.my/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FacebookOutlined className='footer-icon'/>
          </a>
          <a href="https://www.instagram.com/cs.usm?igsh=MWVoa3pzeW00bmYwbg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramOutlined className='footer-icon'/>
          </a>
          <a href="https://www.linkedin.com/company/cssocietyusm/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinOutlined className='footer-icon' />
          </a>
          <a href="mailto:cssociety@student.usm.my" target="_blank" rel="noopener noreferrer" aria-label="Email">
            <MailOutlined className='footer-icon' />
          </a>
          <a href="https://www.tiktok.com/@cs.usm" target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
            <TikTokOutlined className='footer-icon' />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
