export const faqService = {
    async getFaqs() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faqs`);
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      return response.json();
    },
  
    async updateFaq(faq, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faqs/${faq.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(faq),
      });
      if (!response.ok) throw new Error("Failed to update FAQ");
      return response.json();
    },
  
    async addFaq(faq, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faqs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(faq),
      });
      if (!response.ok) throw new Error("Failed to add FAQ");
      return response.json();
    },
  
    async deleteFaq(key, token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/faqs/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete FAQ");
      return response.json();
    },
  };
  