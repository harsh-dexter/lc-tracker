import express from 'express';
import { ensureAuth } from '../middleware/auth.js'; // Middleware to protect routes
import User from '../models/User.js';
import { encrypt, decrypt } from '../utils/crypto.js'; // Encryption utilities

const router = express.Router();

// =============================================================================
// == PROFILE ROUTES                                                          ==
// =============================================================================

// GET /profile - Get current logged-in user's profile info
// Note: This route will be mounted under /api/profile in server.js
router.get('/', ensureAuth, (req, res) => {
  res.json({
    id: req.user.id,
    googleId: req.user.googleId,
    displayName: req.user.displayName,
    email: req.user.email,
    // Check if the user object (populated by ensureAuth) has the key,
    // not directly checking the potentially unselected field from DB
    hasLeetCodeKey: !!req.user.leetcodeSessionKey
  });
});

// POST /profile/leetcode-key - Save encrypted session key
// Note: This route will be mounted under /api/profile/leetcode-key in server.js
router.post('/leetcode-key', ensureAuth, async (req, res) => {
  const { leetcodeSessionKey } = req.body;

  if (!leetcodeSessionKey || typeof leetcodeSessionKey !== 'string' || leetcodeSessionKey.trim() === '') {
    return res.status(400).json({ message: 'LeetCode session key is required.' });
  }

  try {
    const encryptedKey = encrypt(leetcodeSessionKey.trim());

    // Find user and update the key
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { leetcodeSessionKey: encryptedKey },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log(`LeetCode key updated successfully for user: ${req.user.displayName}`);
    res.json({ message: 'LeetCode session key updated successfully.' }); // Ensure valid JSON response
  } catch (error) {
    console.error(`Error updating LeetCode key:`, error);
    res.status(500).json({ message: 'Failed to update session key.' }); // Ensure valid JSON response
  }
});

export default router;
