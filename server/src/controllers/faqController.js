const FAQModel = require('../models/faq');

const faqController = {
  async getFAQs(req, res) {
    try {
      const faqs = await FAQModel.getAll();
      res.json(faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
  },

  async addFAQ(req, res) {
    try {
      const { question, answer } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      // Add the FAQ and get the new FAQ object with the ID and timestamps
      const newFAQ = await FAQModel.add({ question, answer });

      // Respond with the full FAQ object
      res.json(newFAQ); // Return the FAQ with id, question, answer, createdAt, updatedAt
    } catch (error) {
      console.error('Error adding FAQ:', error);
      res.status(500).json({ error: 'Failed to add FAQ' });
    }
  },

  async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const { question, answer } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      await FAQModel.update(id, { question, answer });
      res.json({ message: 'FAQ updated successfully' });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      res.status(500).json({ error: 'Failed to update FAQ' });
    }
  },

  async deleteFAQ(req, res) {
    try {
      const { id } = req.params;

      await FAQModel.delete(id);
      res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  },
};

module.exports = faqController;
