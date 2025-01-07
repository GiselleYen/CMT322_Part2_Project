export const CompanyService = {
    async getCompany() { // Fetches a list of companies from the API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys`); // Makes a GET request to the API endpoint
      if (!response.ok) throw new Error('Failed to fetch company details'); // Throws an error if the response status is not OK
      return response.json(); // Parses and returns the JSON response
    },
  // Adds a new company to the API
    async addCompany(event, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys`, {
        method: "POST", // HTTP method for creating a new resource
        headers: {
          "Content-Type": "application/json", // Specifies the content type as JSON
          Authorization: `Bearer ${token}`, // Includes the authorization token for secured API access
        },
        body: JSON.stringify(event), // Converts the event object to a JSON string for the request body
      });
      if (!response.ok) throw new Error('Failed to add company');
      return response.json(); // Parses and returns the JSON response
    },
   // Updates an existing company in the API
    async updateCompany(eventId, event, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys/${eventId}`, {
        method: "PUT", // HTTP method for updating a resource
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to update company');
      return response.json();
    },
  // Deletes a company from the API
    async deleteCompany(eventId, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys/${eventId}`, {
        method: "DELETE", // HTTP method for deleting a resource
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete company');
      return response.json();
    },
  };