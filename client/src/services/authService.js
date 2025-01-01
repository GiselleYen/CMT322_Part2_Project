export const authService = {
    setSession: (role, token, expiryTime) => {
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);
      localStorage.setItem('expiryTime', expiryTime); // Store the expiry time in localStorage
      localStorage.setItem('currentPage', window.location.pathname); // Store the current page
    },
  
    isSessionValid: () => {
      const expiryTime = localStorage.getItem('expiryTime');
      if (!expiryTime) return false;
      return new Date().getTime() < expiryTime; // Check if current time is before the expiry time
    },
  
    getSessionExpiryTime: () => {
      return localStorage.getItem('expiryTime'); // Return the stored expiry time
    },
  
    clearSession: () => {
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('expiryTime'); // Remove the expiry time from localStorage
      localStorage.removeItem('currentPage'); // Clear the stored page
    },
  
    getCurrentPage: () => {
      return localStorage.getItem('currentPage') || '/'; // Default to home if no current page is saved
    },
  
    setCurrentPage: (url) => {
      localStorage.setItem('currentPage', url); // Store the given URL as the current page
    },
  };
  