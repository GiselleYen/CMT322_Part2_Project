const express = require('express');
const { db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const router = express.Router();

router.post('/users', authenticateUser, async (req, res) => {
  try {
    const { name, matricNumber, yearOfStudy, email } = req.body;
    const userId = req.user.uid;

    // Validate required fields
    if (!name || !matricNumber || !yearOfStudy || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email domain
    if (!email.endsWith('@student.usm.my')) {
      return res.status(400).json({ error: 'Invalid email domain' });
    }

    // Check if matric number is already registered
    const existingUserQuery = await db
      .collection('users')
      .where('matricNumber', '==', matricNumber)
      .get();

    if (!existingUserQuery.empty) {
      return res.status(400).json({ error: 'Matric number already registered' });
    }

    // Create user document in Firestore
    await db.collection('users').doc(userId).set({
      name,
      matricNumber,
      yearOfStudy,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

module.exports = router;