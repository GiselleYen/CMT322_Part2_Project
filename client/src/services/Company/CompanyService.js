export const CompanyService = {
    async getCompany() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys`);
      if (!response.ok) throw new Error('Failed to fetch company details');
      return response.json();
    },
  
    async addCompany(event, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to add company');
      return response.json();
    },
  
    async updateCompany(eventId, event, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to update company');
      return response.json();
    },
  
    async deleteCompany(eventId, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/companys/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete company');
      return response.json();
    },
  };