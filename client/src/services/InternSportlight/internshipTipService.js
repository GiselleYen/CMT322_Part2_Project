export const internshipTipService = {
    async getInternshipTips() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/internshipTips`);
      if (!response.ok) throw new Error('Failed to fetch internship tips');
      return response.json();
    },
  
    async addInternshipTip(tip, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/internshipTips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tip),
      });
      if (!response.ok) throw new Error('Failed to add internship tip');
      return response.json();
    },
  
    async updateInternshipTip(tipId, tip, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/internshipTips/${tipId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tip),
      });
      if (!response.ok) throw new Error('Failed to update internship tip');
      return response.json();
    },
  
    async deleteInternshipTip(tipId, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/internshipTips/${tipId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete internship tip');
      return response.json();
    },
  };
  