export const bestInternServices = {
    async getBestInterns() {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bestInterns`);
        if (!response.ok) throw new Error('Failed to fetch best interns');
        return response.json();
    },

    async updateBestInterns(bestInterns, token) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bestInterns`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bestInterns }),
        });
        if (!response.ok) throw new Error('Failed to update best interns');
        return response.json();
    }
};