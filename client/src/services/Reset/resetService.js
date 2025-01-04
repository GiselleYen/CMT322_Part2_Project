export const resetService = {
    async getUser() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/resets`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      return response.json();
    },
  };