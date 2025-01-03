import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { Modal } from 'antd';

function SessionChecker() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === '/' ||location.pathname === '/register' ||location.pathname === '/forgot-pswd' ) {
      // No need to handle session expiry on the login page
      return;
    }

    // Save the current page whenever it changes
    authService.setCurrentPage(location.pathname);

    const expiryTime = authService.getSessionExpiryTime();
    const timeLeft = expiryTime - new Date().getTime();

    

    if (timeLeft <= 0) {
      // If the session has already expired, show the modal
      showModalAndClearSession();
      return;
    }

    const timeout = setTimeout(() => {
      // Trigger session expiry logic when session is about to expire
      showModalAndClearSession();
    }, timeLeft);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [location.pathname]);

  const showModalAndClearSession = () => {
    authService.clearSession(); // Clear the session
    setIsModalVisible(true); // Show the modal to notify the user
  };

  const handleOk = () => {
    setIsModalVisible(false); // Close the modal
    navigate('/'); // Redirect to the login page
  };

  return (
    <Modal
      title="Session Expired"
      open={isModalVisible}
      onOk={handleOk}
      closable={false} // Prevent closing the modal by clicking outside
      className="A_custom-modal"
      footer={[
        <button
          key="loginAgain"
          onClick={handleOk}
          className="save_button"
          style={{ borderRadius: '8px', padding: '15px' }}
        >
          Login Again
        </button>,
      ]}
    >
      <h6 style={{ marginBottom: '30px', textAlign: 'center' }}>
        Your session has expired. Please log in again to continue.
      </h6>
    </Modal>
  );
}

export default SessionChecker;