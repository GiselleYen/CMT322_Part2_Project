export const announcementService = {
    async getAnnouncements() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcements`);
      if (!response.ok) throw new Error('Failed to fetch announcements');
      return response.json();
    },
  
    async updateAnnouncements(announcements, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcements`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ announcements }),
      });
      if (!response.ok) throw new Error('Failed to update announcements');
      return response.json();
    }
  };