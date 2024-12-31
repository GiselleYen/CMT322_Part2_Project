// sessionchecker.js
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { Modal } from 'antd';

function SessionChecker() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      // If the user is already on the login page, do not show the session expiry modal
      return;
    }

    const expiryTime = authService.getSessionExpiryTime();
    const timeLeft = expiryTime - new Date().getTime();

    if (timeLeft <= 0) {
      // If session has already expired
      setIsModalVisible(true);
      authService.clearSession();
      return;
    }

    const timeout = setTimeout(() => {
      // Trigger session expiry logic when the session is about to expire
      setIsModalVisible(true);
      authService.clearSession();
    }, timeLeft);

    return () => clearTimeout(timeout); // Cleanup the timeout on unmount
  }, [location.pathname]); // Add location.pathname to dependency array to track route changes

  const handleOk = () => {
    // Redirect to the login page when the modal's OK button is clicked
    navigate('/');
    setIsModalVisible(false); // Close the modal when redirecting
  };

  // If we're already on the login page, we don't need to show the modal
  if (location.pathname === '/') {
    return null; // Don't render anything on the login page
  }

  return (
    <Modal
    title="Session Expired"
    visible={isModalVisible}
    onOk={handleOk}
    okText="Login Again"
    closable={false} // Prevent closing the modal by clicking outside
    className="A_custom-modal"
    footer={[
            <button key="loginAgain" onClick={handleOk} className="save_button" style={{ borderRadius: '8px', padding:'15px' }}>
                Login Again
            </button>
    ]}
  >
       <h6 style={{ marginBottom: '30px', textAlign:'center'}}>Your session has expired. Please log in again to continue.</h6>
    </Modal>
  );
}

export default SessionChecker;
