export const resetService = {
    async getUser() {
      // Fetch request to the API endpoint for getting user details
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/resets`);
      if (!response.ok) throw new Error('Failed to fetch user details'); // Check if the response is not okay
      return response.json(); // Parse the response JSON and return it
    },
  };