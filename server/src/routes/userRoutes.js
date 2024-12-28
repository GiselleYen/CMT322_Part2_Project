const express = require('express');
const { admin, db } = require('../config/firebase'); // Firebase Admin SDK
const router = express.Router();

// Register a new user
router.post('/', async (req, res) => {
  try {
    const { name, matricNumber, yearOfStudy, email, password } = req.body;

    // Validate required fields
    if (!name || !matricNumber || !yearOfStudy || !email || !password) {
      return res.status(400).json({
        status: 'error',
        error: 'All fields are required'
      });
    }

    // Validate email domain
    if (!email.endsWith('@student.usm.my')) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid email domain. Use @student.usm.my'
      });
    }

    // Check if matric number is already registered
    const matricSnapshot = await db
      .collection('users')
      .where('matricNumber', '==', matricNumber)
      .get();

    if (!matricSnapshot.empty) {
      return res.status(409).json({
        status: 'error',
        error: 'Matric number already registered'
      });
    }

    // Check if email is already registered in Firebase Auth
    try {
      const userByEmail = await admin.auth().getUserByEmail(email);
      if (userByEmail) {
        return res.status(409).json({
          status: 'error',
          error: 'Email already registered'
        });
      }
    } catch (error) {
      // If error.code === 'auth/user-not-found' then the email is not registered, which is what we want
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Add user data to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      matricNumber,
      yearOfStudy,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Respond with success
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        name,
        email,
        matricNumber,
        yearOfStudy,
      },
    });

  } catch (error) {
    console.error('Error registering user:', error);

    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        status: 'error',
        error: 'Email is already in use'
      });
    }

    if (error.code === 'auth/invalid-password') {
      return res.status(409).json({
        status: 'error',
        error: 'Password must be at least 6 characters long'
      });
    }

    // Handle other Firebase errors
    if (error.code && error.code.startsWith('auth/')) {
      return res.status(400).json({
        status: 'error',
        error: error.message || 'Authentication error occurred'
      });
    }

    // General error fallback
    res.status(500).json({
      status: 'error',
      error: 'Failed to register user. Please try again later.'
    });
  }
});

module.exports = router;