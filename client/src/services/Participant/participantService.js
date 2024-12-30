export const participantService = {
    async getParticipants() {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/participants`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        if (!response.ok) throw new Error('Failed to fetch participants');
        return response.json();
    },

    async getStatistics() {
      const url = `${process.env.REACT_APP_API_URL}/api/participants/statistics`;
      console.log('Fetching statistics from URL:', url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        console.error('Failed to fetch statistics:', response.statusText);
        throw new Error(`Failed to fetch statistics. Status: ${response.status}`);
      }
  
      return response.json();
    },
  };
  
  