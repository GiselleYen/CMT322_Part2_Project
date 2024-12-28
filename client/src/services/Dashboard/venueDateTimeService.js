export const venueDateTimeService = {
    async getVenueDateTime() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/venue-datetime`);
      if (!response.ok) throw new Error('Failed to fetch venue and time details');
      return response.json();
    },

    async updateVenueDateTime(eventDetails, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/venue-datetime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventDetails),
      });
      if (!response.ok) throw new Error('Failed to update venue details');
      return response.json();
    },
  };
  