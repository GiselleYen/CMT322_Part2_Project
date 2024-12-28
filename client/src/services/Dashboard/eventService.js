export const eventService = {
  async getEvents() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  async addEvent(event, token) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to add event');
    return response.json();
  },

  async updateEvent(eventId, event, token) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  async deleteEvent(eventId, token) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return response.json();
  },
};