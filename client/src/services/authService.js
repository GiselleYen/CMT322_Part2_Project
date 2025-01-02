import Cookies from 'js-cookie';

export const authService = {
  setSession: (role, token, expiryTime) => {
    // Store the token in a non-HttpOnly cookie (for access in JS)
    Cookies.set('token', token, { expires: 1, sameSite: 'strict', secure: true });
    
    // Store the role in cookies, but don't store sensitive user data like userId or email in cookies or localStorage
    Cookies.set('role', role, { expires: 1, sameSite: 'strict', secure: true });
    Cookies.set('expiryTime', expiryTime, { expires: 1, sameSite: 'strict', secure: true });

    // Store non-sensitive data like currentPage in localStorage
    localStorage.setItem('currentPage', window.location.pathname); // Example: Store the last visited page
  },
  
    isSessionValid: () => {
      const expiryTime = Cookies.get('expiryTime');
      return new Date().getTime() < expiryTime; // Check if current time is before the expiry time
    },
  
    getSessionExpiryTime: () => {
      return Cookies.get('expiryTime'); // Return the  expiry time
    },

    // Get the user's role
    getRole: () => {
      return Cookies.get('role') || null; // Return role from cookies or null if not set
    },
  
    clearSession: () => {
      Cookies.remove('email');
      Cookies.remove('role');
      Cookies.remove('token');
      Cookies.remove('expiryTime');
      localStorage.removeItem('currentPage'); // Clear the stored page
    },
  
    getCurrentPage: () => {
      return localStorage.getItem('currentPage') || '/'; // Default to home if no current page is saved
    },
  
    setCurrentPage: (url) => {
      localStorage.setItem('currentPage', url); // Store the given URL as the current page
    },
  };
  