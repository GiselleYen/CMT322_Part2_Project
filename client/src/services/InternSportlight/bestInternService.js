export const bestInternService = {
  // Fetch all best interns
  async getBestInterns() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bestInterns`);
    if (!response.ok) throw new Error('Failed to fetch best interns');
    return response.json();
  },

  // Update existing best intern details
  async updateBestIntern(internId, intern, token) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bestInterns/${internId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(intern),
    });
    if (!response.ok) throw new Error('Failed to update best intern');
    return response.json();
  },
};
